import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Clock3,
} from 'lucide-react';
import { appointmentService } from '../../services/api';
import { Appointment, AppointmentStatus } from '../../types';
import AppointmentCard from '../../components/AppointmentCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import DashboardSidebar from '../../components/DashboardSidebar';

export const ManageAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await appointmentService.getAllAppointments();
      setAppointments(res.appointments);
    } catch (err: any) {
      setError('Unable to load appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      await fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus =
      statusFilter === 'All' ||
      app.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      (app.patient?.name &&
        app.patient.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.doctor?.name &&
        app.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.reason &&
        app.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <DashboardSidebar isAdmin={true} />

        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                All Clinic Appointments
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Review incoming patient bookings, confirm time slots, and update visit progress.
              </p>
            </div>

            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Total Recorded: {appointments.length}
            </span>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-2 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 ml-1 shrink-0" />
              <input
                type="text"
                placeholder="Search patient, doctor, reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-gray-800 focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Appointment Cards */}
          {isLoading ? (
            <LoadingSpinner text="Retrieving all appointments..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchAppointments} />
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-xs text-gray-500 text-xs">
              No appointments found matching your current filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  isAdmin={true}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
