export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'employee';
  companyId: string;
  rut?: string;
  position?: string;
  scheduleRef?: string;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  companyId: string;
  date: string; // YYYY-MM-DD
  checkInTime: Date | null;
  checkOutTime: Date | null;
  type: 'password' | 'manual' | 'qr';
  status: 'on-time' | 'late' | 'early-departure' | 'absent';
  hoursWorked: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailySummary {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: string | null;
  status: string;
}

export interface Company {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoURL?: string;
}
