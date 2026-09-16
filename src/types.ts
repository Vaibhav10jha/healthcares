export type Role = 'patient' | 'admin';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: string;
  bio: string;
  availableDays: string[];
  availableTime: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  doctor: {
    _id: string;
    name: string;
    specialization: string;
    qualification?: string;
    image?: string;
    phone?: string;
    email?: string;
  };
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
}

export type AdminStats = DashboardStats;
