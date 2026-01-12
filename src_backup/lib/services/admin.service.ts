import { writable } from 'svelte/store';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, AttendanceRecord, Schedule } from '$lib/types';

// Stores
export const employees = writable<User[]>([]);
export const allAttendance = writable<AttendanceRecord[]>([]);
export const schedules = writable<Schedule[]>([]);
export const isLoading = writable(false);
export const error = writable<string | null>(null);

// Cargar empleados
export async function loadEmployees(companyId: string) {
  try {
    isLoading.set(true);
    error.set(null);
    
    const q = query(
      collection(db, 'users'),
      where('companyId', '==', companyId),
      where('role', '==', 'employee'),
      orderBy('displayName')
    );

    const snapshot = await getDocs(q);
    const employeesList = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as User;
    });

    employees.set(employeesList);
  } catch (err: any) {
    console.error('Error loading employees:', err);
    error.set('Error al cargar empleados');
  } finally {
    isLoading.set(false);
  }
}

// Cargar todos los registros de asistencia
export async function loadAllAttendance(companyId: string, startDate?: Date, endDate?: Date) {
  try {
    isLoading.set(true);
    
    let q = query(
      collection(db, 'attendance'),
      where('companyId', '==', companyId),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    const attendanceList = snapshot.docs.map(doc => {
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

    allAttendance.set(attendanceList);
  } catch (err: any) {
    console.error('Error loading attendance:', err);
    error.set('Error al cargar registros');
  } finally {
    isLoading.set(false);
  }
}

// Cargar horarios
export async function loadSchedules(companyId: string) {
  try {
    const q = query(
      collection(db, 'schedules'),
      where('companyId', '==', companyId),
      orderBy('name')
    );

    const snapshot = await getDocs(q);
    const schedulesList = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Schedule;
    });

    schedules.set(schedulesList);
  } catch (err: any) {
    console.error('Error loading schedules:', err);
  }
}

// Crear nuevo empleado
export async function createEmployee(employeeData: Partial<User>) {
  try {
    isLoading.set(true);
    error.set(null);
    
    // Nota: La creación real del usuario se hace en auth.service
    // Esta función es para crear/actualizar el documento en Firestore
    
    const employeeDoc = {
      ...employeeData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (employeeData.uid) {
      await updateDoc(doc(db, 'users', employeeData.uid), employeeDoc);
    } else {
      await addDoc(collection(db, 'users'), employeeDoc);
    }
    
    return true;
  } catch (err: any) {
    console.error('Error creating employee:', err);
    error.set('Error al crear empleado');
    throw err;
  } finally {
    isLoading.set(false);
  }
}

// Actualizar empleado
export async function updateEmployee(employeeId: string, updates: Partial<User>) {
  try {
    await updateDoc(doc(db, 'users', employeeId), {
      ...updates,
      updatedAt: new Date()
    });
    return true;
  } catch (err: any) {
    console.error('Error updating employee:', err);
    throw err;
  }
}

// Crear horario
export async function createSchedule(scheduleData: Partial<Schedule>) {
  try {
    const scheduleDoc = {
      ...scheduleData,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'schedules'), scheduleDoc);
    return docRef.id;
  } catch (err: any) {
    console.error('Error creating schedule:', err);
    throw err;
  }
}

// Obtener estadísticas
export async function getDashboardStats(companyId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Empleados totales
    const employeesQuery = query(
      collection(db, 'users'),
      where('companyId', '==', companyId),
      where('role', '==', 'employee'),
      where('isActive', '==', true)
    );
    
    const employeesSnapshot = await getDocs(employeesQuery);
    const totalEmployees = employeesSnapshot.size;
    
    // Registros de hoy
    const todayQuery = query(
      collection(db, 'attendance'),
      where('companyId', '==', companyId),
      where('date', '==', today)
    );
    
    const todaySnapshot = await getDocs(todayQuery);
    const todayRecords = todaySnapshot.docs.map(doc => doc.data());
    
    const activeToday = todayRecords.length;
    const lateToday = todayRecords.filter(r => r.status === 'late').length;
    const absentToday = totalEmployees - activeToday;
    
    return {
      totalEmployees,
      activeToday,
      lateToday,
      absentToday
    };
  } catch (err: any) {
    console.error('Error getting dashboard stats:', err);
    return {
      totalEmployees: 0,
      activeToday: 0,
      lateToday: 0,
      absentToday: 0
    };
  }
}
