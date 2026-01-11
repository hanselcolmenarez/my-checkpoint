import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  Timestamp
} from '@angular/fire/firestore';
import { Schedule } from '../../shared/interfaces';
import { AuthService } from './auth.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  private schedules = signal<Schedule[]>([]);
  private loading = signal(false);
  
  readonly allSchedules = () => this.schedules();
  readonly isLoading = () => this.loading();

  async createSchedule(scheduleData: Omit<Schedule, 'id' | 'companyId' | 'isActive'>): Promise<string> {
    try {
      const user = this.authService.user();
      if (!user || user.role !== 'admin') {
        throw new Error('No tienes permisos de administrador');
      }

      const schedule: Schedule = {
        id: uuidv4(),
        companyId: user.companyId,
        isActive: true,
        ...scheduleData
      };

      await addDoc(collection(this.firestore, 'schedules'), schedule);
      await this.loadSchedules(); // Recargar lista
      return schedule.id;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  async loadSchedules(): Promise<void> {
    try {
      this.loading.set(true);
      const user = this.authService.user();
      if (!user) return;

      const q = query(
        collection(this.firestore, 'schedules'),
        where('companyId', '==', user.companyId),
        orderBy('name')
      );

      const querySnapshot = await getDocs(q);
      const schedulesList: Schedule[] = [];
      
      querySnapshot.forEach((doc) => {
        schedulesList.push({ id: doc.id, ...doc.data() } as Schedule);
      });

      this.schedules.set(schedulesList);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async updateSchedule(id: string, data: Partial<Schedule>): Promise<void> {
    try {
      const scheduleRef = doc(this.firestore, `schedules/${id}`);
      await updateDoc(scheduleRef, {
        ...data,
        updatedAt: new Date()
      });
      await this.loadSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  }

  async deleteSchedule(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, `schedules/${id}`));
      await this.loadSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }

  async getScheduleById(id: string): Promise<Schedule | null> {
    try {
      const docRef = doc(this.firestore, `schedules/${id}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Schedule;
      }
      return null;
    } catch (error) {
      console.error('Error getting schedule:', error);
      throw error;
    }
  }

  async toggleScheduleStatus(id: string, isActive: boolean): Promise<void> {
    return this.updateSchedule(id, { isActive });
  }
}