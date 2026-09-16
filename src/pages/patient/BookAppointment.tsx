import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  CalendarCheck,
  Send,
} from 'lucide-react';
import { doctorService, appointmentService } from '../../services/api';
import { Doctor } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardSidebar from '../../components/DashboardSidebar';

export const BookAppointment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor') || '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  // Minimum date is today (no past appointments allowed)
  const today = new Date().toISOString().split('T')[0];

  const standardTimeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ];

  useEffect(() => {
    fetchDoctorsList();
  }, []);

  const fetchDoctorsList = async () => {
    setIsLoadingDoctors(true);
    try {
      const res = await doctorService.getDoctors();
      setDoctors(res.doctors);
      if (preselectedDoctorId && res.doctors.some((d) => d._id === preselectedDoctorId)) {
        setSelectedDoctorId(preselectedDoctorId);
      } else if (res.doctors.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(res.doctors[0]._id);
      }
    } catch (err: any) {
      setApiError('Unable to load doctors list. Please try again.');
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d._id === selectedDoctorId);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!selectedDoctorId) {
      errs.doctor = 'Please select a doctor';
    }

    if (!date) {
      errs.date = 'Please select an appointment date';
    } else {
      const selected = new Date(date);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selected < now) {
        errs.date = 'Appointments cannot be booked for past dates';
      }
    }

    if (!time) {
      errs.time = 'Please select a preferred time slot';
    }

    if (!reason.trim()) {
      errs.reason = 'Please provide a brief reason for your consultation';
    } else if (reason.trim().length < 5) {
      errs.reason = 'Please explain in a little more detail (min 5 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await appointmentService.createAppointment({
        doctor: selectedDoctorId,
        date,
        time,
        reason: reason.trim(),
      });

      setBookingSuccess(true);
    } catch (err: any) {
      setApiError(err.message || 'Failed to book appointment. Please try another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <DashboardSidebar isAdmin={false} />

        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
              <p className="text-xs text-gray-500">
                Choose your specialist, preferred date, and available time slot.
              </p>
            </div>
          </div>

          {bookingSuccess ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center max-w-xl mx-auto space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Appointment Requested Successfully!
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                Your consultation request with{' '}
                <strong className="text-gray-900">{selectedDoctor?.name}</strong> has been received
                for <span className="font-semibold text-blue-600">{date}</span> at{' '}
                <span className="font-semibold text-blue-600">{time}</span>.
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800 text-left space-y-1">
                <p className="font-bold">Next Steps:</p>
                <p>• Your appointment status is currently <strong>Pending Confirmation</strong>.</p>
                <p>• You can track status or cancel anytime from your dashboard.</p>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Link to="/dashboard/appointments">
                  <Button variant="primary" size="md">
                    View My Appointments
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setBookingSuccess(false);
                    setDate('');
                    setTime('');
                    setReason('');
                  }}
                >
                  Book Another Visit
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                {apiError && <ErrorMessage message={apiError} />}

                {isLoadingDoctors ? (
                  <LoadingSpinner text="Retrieving available doctors..." />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Select Doctor */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        1. Select Doctor <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 ${
                          errors.doctor
                            ? 'border-red-300 text-red-900 bg-red-50/20'
                            : 'border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      >
                        <option value="" disabled>
                          -- Choose a Medical Specialist --
                        </option>
                        {doctors.map((doc) => (
                          <option key={doc._id} value={doc._id}>
                            {doc.name} — {doc.specialization} ({doc.qualification})
                          </option>
                        ))}
                      </select>
                      {errors.doctor && (
                        <p className="text-xs text-red-600 font-medium">{errors.doctor}</p>
                      )}
                    </div>

                    {/* 2. Select Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        2. Select Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          if (errors.date) setErrors({ ...errors, date: '' });
                        }}
                        className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 ${
                          errors.date
                            ? 'border-red-300 text-red-900 bg-red-50/20'
                            : 'border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {errors.date && (
                        <p className="text-xs text-red-600 font-medium">{errors.date}</p>
                      )}
                      <p className="text-[11px] text-gray-400">
                        Consultation days for this doctor:{' '}
                        <strong className="text-gray-700">
                          {selectedDoctor
                            ? Array.isArray(selectedDoctor.availableDays)
                              ? selectedDoctor.availableDays.join(', ')
                              : selectedDoctor.availableDays
                            : 'Please select doctor'}
                        </strong>
                      </p>
                    </div>

                    {/* 3. Select Time Slot */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        3. Select Time Slot <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {standardTimeSlots.map((slot) => {
                          const isSelected = time === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setTime(slot);
                                if (errors.time) setErrors({ ...errors, time: '' });
                              }}
                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      {errors.time && (
                        <p className="text-xs text-red-600 font-medium">{errors.time}</p>
                      )}
                    </div>

                    {/* 4. Reason */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        4. Reason for Consultation <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Briefly state your symptoms, concerns, or reason for this medical visit..."
                        value={reason}
                        onChange={(e) => {
                          setReason(e.target.value);
                          if (errors.reason) setErrors({ ...errors, reason: '' });
                        }}
                        className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 ${
                          errors.reason
                            ? 'border-red-300 text-red-900 bg-red-50/20'
                            : 'border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {errors.reason && (
                        <p className="text-xs text-red-600 font-medium">{errors.reason}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      className="w-full justify-center"
                      rightIcon={<CalendarCheck className="w-4 h-4" />}
                    >
                      Confirm and Book Appointment
                    </Button>
                  </form>
                )}
              </div>

              {/* Right Column: Selected Doctor Card summary */}
              <div className="lg:col-span-4 space-y-4">
                {selectedDoctor && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Doctor Overview
                    </h3>

                    <div className="flex items-center gap-3">
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover shadow-xs"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {selectedDoctor.name}
                        </h4>
                        <p className="text-xs text-blue-600 font-semibold">
                          {selectedDoctor.specialization}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {selectedDoctor.qualification}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Experience:</span>
                        <span className="font-semibold text-gray-800">
                          {selectedDoctor.experience}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Consultation Hours:</span>
                        <span className="font-semibold text-gray-800">
                          {selectedDoctor.availableTime}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/60 rounded-xl text-[11px] text-blue-900 space-y-1">
                      <p className="font-bold">Summary of selection:</p>
                      <p>Date: {date || 'Not chosen yet'}</p>
                      <p>Slot: {time || 'Not chosen yet'}</p>
                    </div>
                  </div>
                )}

                <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-5 text-xs text-amber-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Appointment Policy</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Duplicate bookings with the same physician for identical time slots will be rejected by our scheduling system to ensure fair access for all patients.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
