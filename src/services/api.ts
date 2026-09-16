import axios from 'axios';
import { User, Doctor, Appointment, DashboardStats, AdminStats, AppointmentStatus } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healthcare_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    // Auto-logout on 401 unauthorized token failure if not on login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      if (localStorage.getItem('healthcare_token')) {
        localStorage.removeItem('healthcare_token');
        localStorage.removeItem('healthcare_user');
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(new Error(message));
  }
);

// Auth Services
export const authService = {
  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
  }): Promise<{ success: boolean; token: string; user: User }> => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; token: string; user: User }> => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  getCurrentUser: async (): Promise<{ success: boolean; user: User }> => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    email?: string;
  }): Promise<{ success: boolean; message: string; user: User }> => {
    const savedUser = localStorage.getItem('healthcare_user');
    const userId = savedUser ? JSON.parse(savedUser)._id : '';
    const res = await api.put(`/users/${userId}`, data);
    return res.data;
  },
};

// Doctor Services
export const doctorService = {
  getDoctors: async (params?: {
    search?: string;
    specialization?: string;
  }): Promise<{ success: boolean; count: number; doctors: Doctor[] }> => {
    const res = await api.get('/doctors', { params });
    return res.data;
  },

  getDoctorById: async (id: string): Promise<{ success: boolean; doctor: Doctor }> => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  createDoctor: async (doctorData: Partial<Doctor>): Promise<{ success: boolean; doctor: Doctor }> => {
    const res = await api.post('/doctors', doctorData);
    return res.data;
  },

  updateDoctor: async (id: string, doctorData: Partial<Doctor>): Promise<{ success: boolean; doctor: Doctor }> => {
    const res = await api.put(`/doctors/${id}`, doctorData);
    return res.data;
  },

  deleteDoctor: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/doctors/${id}`);
    return res.data;
  },
};

// Appointment Services
export const appointmentService = {
  bookAppointment: async (appointmentData: {
    doctor?: string;
    doctorId?: string;
    date: string;
    time: string;
    reason: string;
  }): Promise<{ success: boolean; message: string; appointment: Appointment }> => {
    const payload = {
      doctorId: appointmentData.doctorId || appointmentData.doctor,
      date: appointmentData.date,
      time: appointmentData.time,
      reason: appointmentData.reason,
    };
    const res = await api.post('/appointments', payload);
    return res.data;
  },

  createAppointment: async (appointmentData: {
    doctor?: string;
    doctorId?: string;
    date: string;
    time: string;
    reason: string;
  }): Promise<{ success: boolean; message: string; appointment: Appointment }> => {
    return appointmentService.bookAppointment(appointmentData);
  },

  getMyAppointments: async (): Promise<{ success: boolean; count: number; appointments: Appointment[] }> => {
    const res = await api.get('/appointments/my');
    return res.data;
  },

  getAllAppointments: async (params?: {
    status?: string;
  }): Promise<{ success: boolean; count: number; appointments: Appointment[] }> => {
    const res = await api.get('/appointments', { params });
    return res.data;
  },

  getAppointmentById: async (id: string): Promise<{ success: boolean; appointment: Appointment }> => {
    const res = await api.get(`/appointments/${id}`);
    return res.data;
  },

  updateAppointmentStatus: async (
    id: string,
    statusOrData:
      | AppointmentStatus
      | string
      | { status?: string; date?: string; time?: string; reason?: string }
  ): Promise<{ success: boolean; message: string; appointment: Appointment }> => {
    const payload =
      typeof statusOrData === 'string'
        ? { status: statusOrData }
        : statusOrData;
    const res = await api.put(`/appointments/${id}`, payload);
    return res.data;
  },

  cancelAppointment: async (id: string): Promise<{ success: boolean; message: string; appointment: Appointment }> => {
    return appointmentService.updateAppointmentStatus(id, { status: 'Cancelled' });
  },

  deleteAppointment: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  },
};

// User Services
export const userService = {
  getUsers: async (params?: {
    search?: string;
  }): Promise<{ success: boolean; count: number; users: User[] }> => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  getUserById: async (id: string): Promise<{ success: boolean; user: User }> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  updateUserProfile: async (
    id: string,
    data: { name?: string; phone?: string; email?: string }
  ): Promise<{ success: boolean; message: string; user: User }> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  getAdminStats: async (): Promise<{ success: boolean; stats: DashboardStats }> => {
    const res = await api.get('/users/stats');
    return res.data;
  },
};

// Admin Services convenience wrapper
export const adminService = {
  getStats: async (): Promise<{ success: boolean; stats: AdminStats }> => {
    return userService.getAdminStats();
  },
  getPatients: async (params?: { search?: string }): Promise<{ success: boolean; count: number; patients: User[] }> => {
    const res = await userService.getUsers(params);
    return { success: res.success, count: res.count, patients: res.users };
  },
  getPatientById: async (id: string): Promise<{ success: boolean; user: User }> => {
    return userService.getUserById(id);
  },
};

export default api;
