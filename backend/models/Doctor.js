import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide doctor email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide doctor phone number'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please specify medical specialization'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please provide medical qualifications'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Please specify years of experience'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Please provide a professional biography'],
      trim: true,
    },
    availableDays: {
      type: [String],
      required: [true, 'Please provide at least one available day'],
      default: ['Monday', 'Wednesday', 'Friday'],
    },
    availableTime: {
      type: String,
      required: [true, 'Please provide available consultation hours'],
      default: '09:00 AM - 05:00 PM',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    },
  },
  {
    timestamps: true,
  }
);

export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;
