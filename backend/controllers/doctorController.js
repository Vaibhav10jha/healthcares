import { Doctor } from '../models/Doctor.js';
import { memoryStore } from '../config/dataStore.js';
import { getIsConnected } from '../config/db.js';

// @desc    Fetch all doctors (with optional search and specialization filter)
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const { search, specialization } = req.query;

    if (getIsConnected()) {
      const query = {};

      if (specialization && specialization !== 'All') {
        query.specialization = specialization;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { specialization: { $regex: search, $options: 'i' } },
          { qualification: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
        ];
      }

      const doctors = await Doctor.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: doctors.length, doctors });
    } else {
      let filtered = [...memoryStore.doctors];

      if (specialization && specialization !== 'All') {
        filtered = filtered.filter(
          (doc) => doc.specialization.toLowerCase() === specialization.toLowerCase()
        );
      }

      if (search) {
        const queryTerm = search.toLowerCase();
        filtered = filtered.filter(
          (doc) =>
            doc.name.toLowerCase().includes(queryTerm) ||
            doc.specialization.toLowerCase().includes(queryTerm) ||
            doc.qualification.toLowerCase().includes(queryTerm) ||
            doc.bio.toLowerCase().includes(queryTerm)
        );
      }

      return res.json({ success: true, count: filtered.length, doctors: filtered });
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching doctors' });
  }
};

// @desc    Fetch single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      return res.json({ success: true, doctor });
    } else {
      const doctor = memoryStore.doctors.find((d) => d._id.toString() === id);
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      return res.json({ success: true, doctor });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving doctor details' });
  }
};

// @desc    Create a new doctor profile
// @route   POST /api/doctors
// @access  Private/Admin
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      bio,
      availableDays,
      availableTime,
      image,
    } = req.body;

    if (!name || !email || !phone || !specialization || !qualification || !experience || !bio) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required doctor profile fields',
      });
    }

    const defaultImage =
      image && image.trim() !== ''
        ? image
        : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600';

    const parsedDays = Array.isArray(availableDays)
      ? availableDays
      : typeof availableDays === 'string'
      ? availableDays.split(',').map((d) => d.trim())
      : ['Monday', 'Wednesday', 'Friday'];

    if (getIsConnected()) {
      const newDoctor = await Doctor.create({
        name,
        email,
        phone,
        specialization,
        qualification,
        experience,
        bio,
        availableDays: parsedDays,
        availableTime: availableTime || '09:00 AM - 05:00 PM',
        image: defaultImage,
      });

      return res.status(201).json({ success: true, doctor: newDoctor });
    } else {
      const newDoctor = {
        _id: 'doc_' + Date.now(),
        name,
        email,
        phone,
        specialization,
        qualification,
        experience,
        bio,
        availableDays: parsedDays,
        availableTime: availableTime || '09:00 AM - 05:00 PM',
        image: defaultImage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryStore.doctors.unshift(newDoctor);
      return res.status(201).json({ success: true, doctor: newDoctor });
    }
  } catch (error) {
    console.error('Create doctor error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating doctor' });
  }
};

// @desc    Update a doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Admin
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    if (updateData.availableDays && typeof updateData.availableDays === 'string') {
      updateData.availableDays = updateData.availableDays.split(',').map((d) => d.trim());
    }

    if (getIsConnected()) {
      const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      return res.json({ success: true, doctor });
    } else {
      const index = memoryStore.doctors.findIndex((d) => d._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      memoryStore.doctors[index] = {
        ...memoryStore.doctors[index],
        ...updateData,
      };

      return res.json({ success: true, doctor: memoryStore.doctors[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error updating doctor' });
  }
};

// @desc    Delete a doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const doctor = await Doctor.findByIdAndDelete(id);
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      return res.json({ success: true, message: 'Doctor successfully deleted' });
    } else {
      const index = memoryStore.doctors.findIndex((d) => d._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      memoryStore.doctors.splice(index, 1);
      return res.json({ success: true, message: 'Doctor successfully deleted' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting doctor' });
  }
};
