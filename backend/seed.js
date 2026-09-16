import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Doctor } from './models/Doctor.js';
import { Appointment } from './models/Appointment.js';
import { initialDoctors, initialUsers } from './config/dataStore.js';

dotenv.config();

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_plus';

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB. Purging existing collections...');

    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();

    console.log('Creating Admin & Demo Users...');
    // Initial users with plain passwords for hashing by pre-save or bulk insert
    const adminPassword = await bcrypt.hash('admin123', 10);
    const patientPassword = await bcrypt.hash('patient123', 10);

    const createdUsers = await User.insertMany([
      {
        name: 'Dr. Arthur Mitchell (Admin)',
        email: 'admin@healthcareplus.com',
        phone: '+1 (555) 019-2834',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'Emily Watson',
        email: 'patient@healthcareplus.com',
        phone: '+1 (555) 912-3847',
        password: patientPassword,
        role: 'patient',
      },
      {
        name: 'Robert Miller',
        email: 'robert.m@example.com',
        phone: '+1 (555) 438-1928',
        password: patientPassword,
        role: 'patient',
      },
    ]);

    console.log('Seeding 5 Sample Doctors with specialized medical profiles...');
    const doctorsToInsert = initialDoctors.map(({ _id, createdAt, updatedAt, ...rest }) => rest);
    const createdDoctors = await Doctor.insertMany(doctorsToInsert);

    console.log('Seeding Sample Appointments...');
    await Appointment.insertMany([
      {
        patient: createdUsers[1]._id,
        doctor: createdDoctors[0]._id,
        date: '2026-09-18',
        time: '10:00 AM',
        reason: 'Annual routine cardiovascular follow-up and blood pressure check.',
        status: 'Confirmed',
      },
      {
        patient: createdUsers[1]._id,
        doctor: createdDoctors[2]._id,
        date: '2026-09-22',
        time: '11:30 AM',
        reason: 'Routine 6-month dental cleaning and enamel checkup.',
        status: 'Pending',
      },
      {
        patient: createdUsers[2]._id,
        doctor: createdDoctors[1]._id,
        date: '2026-08-10',
        time: '02:00 PM',
        reason: 'Seasonal allergy consultation and prescription renewal.',
        status: 'Completed',
      },
    ]);

    console.log('\n==========================================');
    console.log('🎉 Database seeding complete!');
    console.log('Demo Admin: email: admin@healthcareplus.com | password: admin123');
    console.log('Demo Patient: email: patient@healthcareplus.com | password: patient123');
    console.log('5 Sample Doctors created successfully.');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
