import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { User } from '../models/User.js';
import { memoryStore } from '../config/dataStore.js';
import { getIsConnected } from '../config/db.js';

// Helper to populate appointment in memoryStore
const populateAppointment = (apt) => {
  const patient = memoryStore.users.find(
    (u) => u._id.toString() === (apt.patient?._id ? apt.patient._id.toString() : apt.patient.toString())
  );
  const doctor = memoryStore.doctors.find(
    (d) => d._id.toString() === (apt.doctor?._id ? apt.doctor._id.toString() : apt.doctor.toString())
  );

  return {
    ...apt,
    patient: patient
      ? { _id: patient._id, name: patient.name, email: patient.email, phone: patient.phone }
      : { _id: apt.patient, name: 'Patient' },
    doctor: doctor || { _id: apt.doctor, name: 'Doctor' },
  };
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const doctorId = req.body.doctorId || req.body.doctor;
    const { date, time, reason } = req.body;
    const patientId = req.user._id;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctor, appointment date, time slot, and reason for visit',
      });
    }

    // 1. Rule: Prevent appointment in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule an appointment in the past. Please select a future date.',
      });
    }

    if (getIsConnected()) {
      // 2. Rule: Prevent duplicate appointment for same doctor/date/time
      const existingSlot = await Appointment.findOne({
        doctor: doctorId,
        date,
        time,
        status: { $ne: 'Cancelled' },
      });

      if (existingSlot) {
        return res.status(409).json({
          success: false,
          message: 'This doctor is already booked for the selected date and time. Please choose another slot.',
        });
      }

      const doctorExists = await Doctor.findById(doctorId);
      if (!doctorExists) {
        return res.status(404).json({ success: false, message: 'Selected doctor not found' });
      }

      const appointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        date,
        time,
        reason,
        status: 'Pending',
      });

      const populated = await Appointment.findById(appointment._id)
        .populate('patient', 'name email phone')
        .populate('doctor');

      return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully with status: Pending',
        appointment: populated,
      });
    } else {
      // Memory Store logic
      const existingSlot = memoryStore.appointments.find(
        (apt) =>
          (apt.doctor === doctorId || apt.doctor?._id === doctorId) &&
          apt.date === date &&
          apt.time === time &&
          apt.status !== 'Cancelled'
      );

      if (existingSlot) {
        return res.status(409).json({
          success: false,
          message: 'This doctor is already booked for the selected date and time. Please choose another slot.',
        });
      }

      const doctorExists = memoryStore.doctors.find((d) => d._id === doctorId);
      if (!doctorExists) {
        return res.status(404).json({ success: false, message: 'Selected doctor not found' });
      }

      const newAppointment = {
        _id: 'apt_' + Date.now(),
        patient: patientId,
        doctor: doctorId,
        date,
        time,
        reason,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryStore.appointments.unshift(newAppointment);
      const populated = populateAppointment(newAppointment);

      return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully with status: Pending',
        appointment: populated,
      });
    }
  } catch (error) {
    console.error('Book appointment error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error booking appointment' });
  }
};

// @desc    Get current user's appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
export const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user._id.toString();

    if (getIsConnected()) {
      const appointments = await Appointment.find({ patient: patientId })
        .populate('doctor')
        .populate('patient', 'name email phone')
        .sort({ date: -1, createdAt: -1 });

      return res.json({ success: true, count: appointments.length, appointments });
    } else {
      const userApts = memoryStore.appointments
        .filter((a) => (a.patient?._id ? a.patient._id.toString() : a.patient.toString()) === patientId)
        .map(populateAppointment)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return res.json({ success: true, count: userApts.length, appointments: userApts });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve appointments' });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;

    if (getIsConnected()) {
      const filter = {};
      if (status && status !== 'All') {
        filter.status = status;
      }

      const appointments = await Appointment.find(filter)
        .populate('doctor')
        .populate('patient', 'name email phone')
        .sort({ date: -1, createdAt: -1 });

      return res.json({ success: true, count: appointments.length, appointments });
    } else {
      let apts = memoryStore.appointments.map(populateAppointment);

      if (status && status !== 'All') {
        apts = apts.filter((a) => a.status.toLowerCase() === status.toLowerCase());
      }

      apts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return res.json({ success: true, count: apts.length, appointments: apts });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve all appointments' });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const appointment = await Appointment.findById(id)
        .populate('doctor')
        .populate('patient', 'name email phone');

      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      // Ensure user owns appointment or is admin
      const isOwner = appointment.patient._id.toString() === req.user._id.toString();
      if (!isOwner && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to view this appointment' });
      }

      return res.json({ success: true, appointment });
    } else {
      const apt = memoryStore.appointments.find((a) => a._id.toString() === id);
      if (!apt) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const populated = populateAppointment(apt);
      const isOwner = populated.patient._id.toString() === req.user._id.toString();

      if (!isOwner && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to view this appointment' });
      }

      return res.json({ success: true, appointment: populated });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching appointment details' });
  }
};

// @desc    Update appointment status (Admin can confirm/cancel/complete; Patient can cancel their own)
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, time, reason } = req.body;

    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (getIsConnected()) {
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const isPatient = req.user.role === 'patient';
      const isOwner = appointment.patient.toString() === req.user._id.toString();

      if (isPatient) {
        if (!isOwner) {
          return res.status(403).json({ success: false, message: 'Not authorized to modify this appointment' });
        }
        // Patients can only cancel their pending or confirmed appointments
        if (status !== 'Cancelled') {
          return res.status(403).json({ success: false, message: 'Patients can only cancel appointments' });
        }
        if (appointment.status === 'Completed') {
          return res.status(400).json({ success: false, message: 'Cannot cancel an already completed appointment' });
        }
        appointment.status = 'Cancelled';
      } else if (req.user.role === 'admin') {
        if (status) appointment.status = status;
        if (date) appointment.date = date;
        if (time) appointment.time = time;
        if (reason) appointment.reason = reason;
      }

      await appointment.save();

      const updated = await Appointment.findById(id)
        .populate('doctor')
        .populate('patient', 'name email phone');

      return res.json({ success: true, message: `Appointment status updated to ${appointment.status}`, appointment: updated });
    } else {
      const index = memoryStore.appointments.findIndex((a) => a._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      const appointment = memoryStore.appointments[index];
      const isPatient = req.user.role === 'patient';
      const isOwner = (appointment.patient?._id || appointment.patient).toString() === req.user._id.toString();

      if (isPatient) {
        if (!isOwner) {
          return res.status(403).json({ success: false, message: 'Not authorized to modify this appointment' });
        }
        if (status !== 'Cancelled') {
          return res.status(403).json({ success: false, message: 'Patients can only cancel appointments' });
        }
        if (appointment.status === 'Completed') {
          return res.status(400).json({ success: false, message: 'Cannot cancel an already completed appointment' });
        }
        appointment.status = 'Cancelled';
      } else if (req.user.role === 'admin') {
        if (status) appointment.status = status;
        if (date) appointment.date = date;
        if (time) appointment.time = time;
        if (reason) appointment.reason = reason;
      }

      appointment.updatedAt = new Date().toISOString();
      memoryStore.appointments[index] = appointment;

      const populated = populateAppointment(appointment);
      return res.json({
        success: true,
        message: `Appointment status updated to ${appointment.status}`,
        appointment: populated,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error updating appointment' });
  }
};

// @desc    Delete appointment (Admin only)
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const appointment = await Appointment.findByIdAndDelete(id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
      return res.json({ success: true, message: 'Appointment removed successfully' });
    } else {
      const index = memoryStore.appointments.findIndex((a) => a._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
      memoryStore.appointments.splice(index, 1);
      return res.json({ success: true, message: 'Appointment removed successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting appointment' });
  }
};
