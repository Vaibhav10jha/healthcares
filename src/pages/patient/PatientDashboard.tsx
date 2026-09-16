import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  PlusCircle,
  Stethoscope,
  User,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CalendarCheck2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/api';
import { Appointment } from '../../types';
import StatsCard from '../../components/StatsCard';
import AppointmentCard from '../../components/AppointmentCard';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import DashboardSidebar from '../../components/DashboardSidebar';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await appointmentService.getMyAppointments();
      setAppointments(res.appointments);
    } catch (err: any) {
      setError('Unable to load appointments. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCancelModal = (id: string) => {
    setSelectedAppointmentId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointmentId) return;
    setIsCancelling(true);
    try {
      await appointmentService.cancelAppointment(selectedAppointmentId);
      setCancelModalOpen(false);
      setSelectedAppointmentId(null);
      await fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Compute metrics
  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <DashboardSidebar isAdmin={false} />

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Patient Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed">
                Manage your consultations, view medical reminders, and book your next appointment with certified doctors.
              </p>
            </div>

            <Link to="/dashboard/book" className="shrink-0">
              <Button
                variant="light"
                size="md"
                className="bg-white text-blue-900 hover:bg-blue-50 border-0"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Booked"
              value={totalAppointments}
              icon={<Calendar className="w-5 h-5 text-blue-600" />}
              subtitle="All registered visits"
            />
            <StatsCard
              title="Upcoming Visits"
              value={upcomingAppointments.length}
              icon={<CalendarCheck2 className="w-5 h-5 text-amber-600" />}
              subtitle="Pending or confirmed"
            />
            <StatsCard
              title="Completed"
              value={completedAppointments.length}
              icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
              subtitle="Concluded consultations"
            />
            <StatsCard
              title="Specialists"
              value="50+"
              icon={<Stethoscope className="w-5 h-5 text-purple-600" />}
              subtitle="Available on HealthCare+"
            />
          </div>

          {/* Upcoming Appointment Spotlight */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Next Upcoming Appointment</h2>
              {appointments.length > 0 && (
                <Link
                  to="/dashboard/appointments"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <span>View All History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {isLoading ? (
              <LoadingSpinner text="Retrieving appointment records..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchAppointments} />
            ) : nextAppointment ? (
              <AppointmentCard
                appointment={nextAppointment}
                onCancel={handleOpenCancelModal}
              />
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  No Upcoming Appointments Scheduled
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You currently have no pending or confirmed medical appointments. Browse our specialists and reserve a time slot anytime.
                </p>
                <Link to="/dashboard/book">
                  <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                    Schedule an Appointment Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Quick Portal Shortcuts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/dashboard/book"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Book Consultation
                  </h4>
                  <p className="text-[11px] text-gray-500">Choose doctor & time slot</p>
                </div>
              </Link>

              <Link
                to="/doctors"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Doctor Directory
                  </h4>
                  <p className="text-[11px] text-gray-500">Explore physician bios</p>
                </div>
              </Link>

              <Link
                to="/dashboard/profile"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    Update Profile
                  </h4>
                  <p className="text-[11px] text-gray-500">Phone, email & settings</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Appointment Cancellation"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              disabled={isCancelling}
            >
              Keep Appointment
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmCancel}
              isLoading={isCancelling}
            >
              Yes, Cancel It
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-gray-600">
          <p>
            Are you sure you wish to cancel this appointment? Your reserved time slot will be released back to the clinic's open schedule.
          </p>
          <p className="text-gray-500 italic">
            You can always book a new slot later if your schedule changes.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDashboard;
