import bcrypt from 'bcryptjs';

// Seed Initial Data
export const initialDoctors = [
  {
    _id: 'doc_1',
    name: 'Dr. Sarah Jenkins, MD',
    email: 'sarah.jenkins@healthcareplus.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Cardiology',
    qualification: 'MD, FACC - Harvard Medical School',
    experience: '14 years',
    bio: 'Board-certified cardiologist specializing in preventive cardiovascular medicine, hypertension management, and echocardiography. Passionate about empowering patients through lifestyle changes.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTime: '09:00 AM - 03:00 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-10').toISOString(),
  },
  {
    _id: 'doc_2',
    name: 'Dr. Marcus Vance, MD',
    email: 'marcus.vance@healthcareplus.com',
    phone: '+1 (555) 345-6789',
    specialization: 'General Consultation',
    qualification: 'MBBS, MD - Johns Hopkins University',
    experience: '11 years',
    bio: 'Experienced family medicine physician with expertise in comprehensive adult medicine, chronic illness management, and preventative health screenings.',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableTime: '08:30 AM - 04:30 PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date('2025-01-12').toISOString(),
    updatedAt: new Date('2025-01-12').toISOString(),
  },
  {
    _id: 'doc_3',
    name: 'Dr. Elena Rostova, DDS',
    email: 'elena.rostova@healthcareplus.com',
    phone: '+1 (555) 456-7890',
    specialization: 'Dental Care',
    qualification: 'DDS - Columbia University College of Dental Medicine',
    experience: '9 years',
    bio: 'Dedicated dental specialist offering restorative dentistry, smile design, periodontal therapy, and gentle preventive oral healthcare for all ages.',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    availableTime: '10:00 AM - 05:00 PM',
    image: 'https://images.unsplash.com/photo-1594824813589-3221ba293077?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString(),
  },
  {
    _id: 'doc_4',
    name: 'Dr. David Chen, MD',
    email: 'david.chen@healthcareplus.com',
    phone: '+1 (555) 567-8901',
    specialization: 'Pediatrics',
    qualification: 'MD, FAAP - Stanford University School of Medicine',
    experience: '12 years',
    bio: 'Compassionate pediatrician focusing on newborn care, child development milestones, immunizations, and adolescent wellness in a warm, welcoming atmosphere.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    availableTime: '09:00 AM - 04:00 PM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date('2025-01-18').toISOString(),
    updatedAt: new Date('2025-01-18').toISOString(),
  },
  {
    _id: 'doc_5',
    name: 'Dr. Amara Patel, MD',
    email: 'amara.patel@healthcareplus.com',
    phone: '+1 (555) 678-9012',
    specialization: 'Dermatology',
    qualification: 'MD, FAAD - University of California, San Francisco (UCSF)',
    experience: '8 years',
    bio: 'Clinical and aesthetic dermatologist experienced in treating eczema, acne, skin cancer screenings, and advanced medical dermatological therapies.',
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
    availableTime: '09:30 AM - 03:30 PM',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
  },
];

// Pre-hashed password for "admin123" and "patient123"
const adminHashedPassword = bcrypt.hashSync('admin123', 10);
const patientHashedPassword = bcrypt.hashSync('patient123', 10);

export const initialUsers = [
  {
    _id: 'user_admin_1',
    name: 'Dr. Arthur Mitchell (Admin)',
    email: 'admin@healthcareplus.com',
    phone: '+1 (555) 019-2834',
    password: adminHashedPassword,
    role: 'admin',
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
  },
  {
    _id: 'user_patient_1',
    name: 'Emily Watson',
    email: 'patient@healthcareplus.com',
    phone: '+1 (555) 912-3847',
    password: patientHashedPassword,
    role: 'patient',
    createdAt: new Date('2025-01-05').toISOString(),
    updatedAt: new Date('2025-01-05').toISOString(),
  },
  {
    _id: 'user_patient_2',
    name: 'Robert Miller',
    email: 'robert.m@example.com',
    phone: '+1 (555) 438-1928',
    password: patientHashedPassword,
    role: 'patient',
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-01-08').toISOString(),
  }
];

export const initialAppointments = [
  {
    _id: 'apt_1',
    patient: 'user_patient_1',
    doctor: 'doc_1',
    date: '2026-09-18',
    time: '10:00 AM',
    reason: 'Annual routine cardiovascular follow-up and blood pressure check.',
    status: 'Confirmed',
    createdAt: new Date('2025-02-01').toISOString(),
    updatedAt: new Date('2025-02-01').toISOString(),
  },
  {
    _id: 'apt_2',
    patient: 'user_patient_1',
    doctor: 'doc_3',
    date: '2026-09-22',
    time: '11:30 AM',
    reason: 'Routine 6-month dental cleaning and enamel checkup.',
    status: 'Pending',
    createdAt: new Date('2025-02-05').toISOString(),
    updatedAt: new Date('2025-02-05').toISOString(),
  },
  {
    _id: 'apt_3',
    patient: 'user_patient_2',
    doctor: 'doc_2',
    date: '2026-08-10',
    time: '02:00 PM',
    reason: 'Seasonal allergy consultation and prescription renewal.',
    status: 'Completed',
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
  },
];

// In-Memory active database store
class MemoryDataStore {
  constructor() {
    this.users = [...initialUsers];
    this.doctors = [...initialDoctors];
    this.appointments = [...initialAppointments];
  }

  resetToSeed() {
    this.users = [...initialUsers];
    this.doctors = [...initialDoctors];
    this.appointments = [...initialAppointments];
  }
}

export const memoryStore = new MemoryDataStore();
