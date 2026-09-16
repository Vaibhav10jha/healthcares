import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PlusCircle, Filter } from 'lucide-react';
import { appointmentService } from '../../services/api';
import { Appointment, AppointmentStatus } from '../../types';
import AppointmentCard from '../../components/AppointmentCard';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import DashboardSidebar from '../../components/DashboardSidebar';

export const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Cancel modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

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
      setError('Unable to load appointments.');
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

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <DashboardSidebar isAdmin={false} />

        <div className="flex-1 space-y-6">
          {/* Header & Book Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-xs text-gray-500 mt-1">
                View your scheduled visits, track approval status, and manage consultation history.
              </p>
            </div>
            <Link to="/dashboard/book">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Book New Appointment
              </Button>
            </Link>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-100">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-xs px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* List or Empty State */}
          {isLoading ? (
            <LoadingSpinner text="Loading your appointments..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchAppointments} />
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-xs text-center space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                No appointments found
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {statusFilter === 'All'
                  ? "You haven't scheduled any medical consultations yet."
                  : `You don't have any appointments with status "${statusFilter}".`}
              </p>
              <Link to="/dashboard/book">
                <Button variant="primary" size="sm">
                  Schedule an Appointment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  onCancel={handleOpenCancelModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              disabled={isCancelling}
            >
              Keep
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmCancel}
              isLoading={isCancelling}
            >
              Confirm Cancel
            </Button>
          </div>
        }
      >
        <p className="text-xs text-gray-600 leading-relaxed">
          Are you sure you want to cancel this appointment? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default MyAppointments;
