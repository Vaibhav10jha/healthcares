import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import { memoryStore } from '../config/dataStore.js';
import { getIsConnected } from '../config/db.js';

// @desc    Get all registered patients (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    if (getIsConnected()) {
      const query = { role: 'patient' };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      const patients = await User.find(query).select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: patients.length, users: patients });
    } else {
      let patients = memoryStore.users
        .filter((u) => u.role === 'patient')
        .map(({ password, ...rest }) => rest);

      if (search) {
        const queryTerm = search.toLowerCase();
        patients = patients.filter(
          (u) =>
            u.name.toLowerCase().includes(queryTerm) ||
            u.email.toLowerCase().includes(queryTerm) ||
            u.phone.toLowerCase().includes(queryTerm)
        );
      }

      return res.json({ success: true, count: patients.length, users: patients });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve patients' });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check authorization: must be admin or requesting own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (getIsConnected()) {
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, user });
    } else {
      const user = memoryStore.users.find((u) => u._id.toString() === id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.json({ success: true, user: userWithoutPassword });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving user' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email } = req.body;

    // Must be admin or owner
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ success: false, message: 'Access denied to update this profile' });
    }

    if (getIsConnected()) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name.trim();
      if (phone) user.phone = phone.trim();
      if (email) user.email = email.toLowerCase().trim();

      const updated = await user.save();

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: updated._id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
        },
      });
    } else {
      const index = memoryStore.users.findIndex((u) => u._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const existing = memoryStore.users[index];
      const updated = {
        ...existing,
        name: name ? name.trim() : existing.name,
        phone: phone ? phone.trim() : existing.phone,
        email: email ? email.toLowerCase().trim() : existing.email,
        updatedAt: new Date().toISOString(),
      };

      memoryStore.users[index] = updated;

      const { password, ...userWithoutPassword } = updated;
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: userWithoutPassword,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
  }
};

// @desc    Get dashboard statistics for Admin
// @route   GET /api/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    if (getIsConnected()) {
      const totalPatients = await User.countDocuments({ role: 'patient' });
      const totalDoctors = await Doctor.countDocuments();
      const totalAppointments = await Appointment.countDocuments();
      const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
      const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
      const confirmedAppointments = await Appointment.countDocuments({ status: 'Confirmed' });
      const cancelledAppointments = await Appointment.countDocuments({ status: 'Cancelled' });

      return res.json({
        success: true,
        stats: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          pendingAppointments,
          completedAppointments,
          confirmedAppointments,
          cancelledAppointments,
        },
      });
    } else {
      const totalPatients = memoryStore.users.filter((u) => u.role === 'patient').length;
      const totalDoctors = memoryStore.doctors.length;
      const totalAppointments = memoryStore.appointments.length;
      const pendingAppointments = memoryStore.appointments.filter((a) => a.status === 'Pending').length;
      const completedAppointments = memoryStore.appointments.filter((a) => a.status === 'Completed').length;
      const confirmedAppointments = memoryStore.appointments.filter((a) => a.status === 'Confirmed').length;
      const cancelledAppointments = memoryStore.appointments.filter((a) => a.status === 'Cancelled').length;

      return res.json({
        success: true,
        stats: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          pendingAppointments,
          completedAppointments,
          confirmedAppointments,
          cancelledAppointments,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
};
