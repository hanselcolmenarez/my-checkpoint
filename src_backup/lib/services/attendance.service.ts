import { writable, derived } from 'svelte/store';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { user } from './auth.service';
import type { AttendanceRecord, DailySummary } from '$lib/types';
import { format, parseISO, differenceInHours, differenceInMinutes, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

// Stores
export const todayRecords = writable<AttendanceRecord[]>([]);
export const historyRecords = writable<AttendanceRecord[]>([]);
export const dailySummary = writable<DailySummary | null>(null);
export const isLoading = writable(false);
export const error = writable<string | null>(null);

// Cargar datos iniciales
user.subscribe(async (currentUser) => {
  if (currentUser?.role === 'employee') {
    await loadTodayRecords(currentUser.uid);
    await loadHistory(currentUser.uid);
  }
});

async function loadTodayRecords(userId: string) {
  try {
    isLoading.set(true);
    error.set(null);
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      where('date', '==', today),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const records = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkInTime: data.checkInTime?.toDate() || null,
        checkOutTime: data.checkOutTime?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as AttendanceRecord;
    });

    todayRecords.set(records);
    updateDailySummary(records);
  } catch (err: any) {
    console.error('Error loading today records:', err);
    error.set('Error al cargar registros del día');
  } finally {
    isLoading.set(false);
  }
}

async function loadHistory(userId: string, limitCount: number = 10) {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const records = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkInTime: data.checkInTime?.toDate() || null,
        checkOutTime: data.checkOutTime?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as AttendanceRecord;
    });

    historyRecords.set(records);
  } catch (err: any) {
    console.error('Error loading history:', err);
  }
}

function updateDailySummary(records: AttendanceRecord[]) {
  if (records.length === 0) {
    dailySummary.set(null);
    return;
  }

  const todayRecord = records[0];
  const summary: DailySummary = {
    date: todayRecord.date,
    checkIn: todayRecord.checkInTime 
      ? format(todayRecord.checkInTime, 'HH:mm') 
      : null,
    checkOut: todayRecord.checkOutTime 
      ? format(todayRecord.checkOutTime, 'HH:mm') 
      : null,
    hoursWorked: todayRecord.hoursWorked 
      ? `${todayRecord.hoursWorked.toFixed(2)}h`
      : null,
    status: todayRecord.status
  };

  dailySummary.set(summary);
}

export async function markAttendance(type: 'password' | 'manual' = 'password', password?: string) {
  try {
    isLoading.set(true);
    error.set(null);
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Usuario no autenticado');

    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const userId = currentUser.uid;
    
    // Verificar si ya existe un registro hoy
    const existingRecord = await getTodayRecord(userId, today);
    
    let recordId: string;
    
    if (!existingRecord) {
      // Primera marca del día (Entrada)
      const record: AttendanceRecord = {
        userId,
        companyId: currentUser.companyId,
        date: today,
        checkInTime: now,
        checkOutTime: null,
        type,
        status: calculateStatus(now, 'check-in', currentUser.scheduleRef),
        hoursWorked: null,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'attendance'), record);
      recordId = docRef.id;
      
      // Actualizar store
      todayRecords.update(records => [...records, { ...record, id: recordId }]);
    } else {
      // Segunda marca del día (Salida)
      const updatedRecord = {
        ...existingRecord,
        checkOutTime: now,
        status: calculateStatus(now, 'check-out', currentUser.scheduleRef, existingRecord.checkInTime),
        hoursWorked: calculateHoursWorked(existingRecord.checkInTime!, now),
        updatedAt: now
      };
      
      // Actualizar en Firestore
      const recordRef = doc(db, 'attendance', existingRecord.id!);
      await updateDoc(recordRef, {
        checkOutTime: now,
        status: updatedRecord.status,
        hoursWorked: updatedRecord.hoursWorked,
        updatedAt: now
      });
      
      recordId = existingRecord.id!;
      
      // Actualizar store
      todayRecords.update(records => 
        records.map(r => r.id === existingRecord.id ? updatedRecord : r)
      );
    }
    
    // Recargar datos
    await loadTodayRecords(userId);
    await loadHistory(userId);
    
    return recordId;
  } catch (err: any) {
    console.error('Error marking attendance:', err);
    error.set('Error al marcar asistencia');
    throw err;
  } finally {
    isLoading.set(false);
  }
}

async function getTodayRecord(userId: string, date: string): Promise<AttendanceRecord | null> {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      where('date', '==', date)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      checkInTime: data.checkInTime?.toDate() || null,
      checkOutTime: data.checkOutTime?.toDate() || null,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as AttendanceRecord;
  } catch (err) {
    console.error('Error getting today record:', err);
    return null;
  }
}

function getCurrentUser() {
  let currentUser: any = null;
  user.subscribe(value => { currentUser = value; })();
  return currentUser;
}

function calculateStatus(
  timestamp: Date,
  type: 'check-in' | 'check-out',
  scheduleRef?: string,
  checkInTime?: Date | null
): AttendanceRecord['status'] {
  // Por ahora, simplificado - después se puede integrar con horarios reales
  const hour = timestamp.getHours();
  const minute = timestamp.getMinutes();
  
  if (type === 'check-in') {
    if (hour > 8 || (hour === 8 && minute > 45)) {
      return 'late';
    }
    return 'on-time';
  } else {
    // Para salida, verificar si trabajó menos de 8 horas
    if (checkInTime) {
      const hoursWorked = differenceInHours(timestamp, checkInTime);
      if (hoursWorked < 8) {
        return 'early-departure';
      }
    }
    return 'on-time';
  }
}

function calculateHoursWorked(checkIn: Date, checkOut: Date): number {
  const hours = differenceInHours(checkOut, checkIn);
  const minutes = differenceInMinutes(checkOut, checkIn) % 60;
  return parseFloat((hours + (minutes / 60)).toFixed(2));
}

// Funciones utilitarias para componentes
export function formatAttendanceDate(dateString: string): string {
  return format(parseISO(dateString), 'dd/MM/yy');
}

export function formatAttendanceTime(date: Date | null): string {
  return date ? format(date, 'HH:mm') : '--:--';
}

export function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'on-time': 'bg-green-100 text-green-800',
    'late': 'bg-yellow-100 text-yellow-800',
    'early-departure': 'bg-orange-100 text-orange-800',
    'absent': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    'on-time': 'A tiempo',
    'late': 'Tardanza',
    'early-departure': 'Salida temprano',
    'absent': 'Ausente'
  };
  return texts[status] || status;
}
