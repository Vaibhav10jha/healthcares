import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { adminService, appointmentService, doctorService } from '../../services/api';
import { AdminStats, Appointment, Doctor } from '../../types';
import StatsCard from '../../components/StatsCard';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import DashboardSidebar from '../../components/DashboardSidebar';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, appointmentsRes, doctorsRes] = await Promise.all([
        adminService.getStats(),
        appointmentService.getAllAppointments(),
        doctorService.getDoctors(),
      ]);

      setStats(statsRes.stats);
      setRecentAppointments(appointmentsRes.appointments.slice(0, 5));
      setDoctors(doctorsRes.doctors);
    } catch (err: any) {
      setError('Unable to load admin dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: any) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <DashboardSidebar isAdmin={true} />

        <div className="flex-1 space-y-8">
          {/* Header */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-blue-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administration Central Control</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Healthcare Operations Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                Review clinic statistics, approve pending consultations, and manage medical staff profiles.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link to="/admin/doctors">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Manage Doctors
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <LoadingSpinner text="Compiling clinic metrics..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchDashboardData} />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Doctors"
                  value={stats?.totalDoctors || doctors.length}
                  icon={<Stethoscope className="w-5 h-5 text-blue-600" />}
                  subtitle="Active specialists"
                />
                <StatsCard
                  title="Total Patients"
                  value={stats?.totalPatients || 0}
                  icon={<Users className="w-5 h-5 text-purple-600" />}
                  subtitle="Registered profiles"
                />
                <StatsCard
                  title="All Appointments"
                  value={stats?.totalAppointments || 0}
                  icon={<Calendar className="w-5 h-5 text-indigo-600" />}
                  subtitle="Historical volume"
                />
                <StatsCard
                  title="Pending Approval"
                  value={stats?.pendingAppointments || 0}
                  icon={<Clock className="w-5 h-5 text-amber-600" />}
                  subtitle="Awaiting action"
                />
              </div>

              {/* Status Breakdown Bar */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-around gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Pending</p>
                  <p className="text-lg font-bold text-amber-600">
                    {stats?.pendingAppointments || 0}
                  </p>
                </div>
                <div className="h-8 w-px bg-gray-100" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Confirmed</p>
                  <p className="text-lg font-bold text-blue-600">
                    {stats?.confirmedAppointments || 0}
                  </p>
                </div>
                <div className="h-8 w-px bg-gray-100" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Completed</p>
                  <p className="text-lg font-bold text-green-600">
                    {stats?.completedAppointments || 0}
                  </p>
                </div>
                <div className="h-8 w-px bg-gray-100" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Cancelled</p>
                  <p className="text-lg font-bold text-red-600">
                    {stats?.cancelledAppointments || 0}
                  </p>
                </div>
              </div>

              {/* Recent Appointments Table */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Recent Appointment Activity
                    </h3>
                    <p className="text-xs text-gray-500">
                      Latest appointment submissions from patients
                    </p>
                  </div>
                  <Link
                    to="/admin/appointments"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View All Appointments</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {recentAppointments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500">
                    No appointments recorded in system yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-6 py-3">Patient</th>
                          <th className="px-6 py-3">Doctor</th>
                          <th className="px-6 py-3">Date & Time</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recentAppointments.map((app) => (
                          <tr key={app._id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">
                                {app.patient?.name || 'Patient'}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                {app.patient?.email}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">
                                {app.doctor?.name || 'Doctor'}
                              </p>
                              <p className="text-[11px] text-blue-600">
                                {app.doctor?.specialization}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-800">{app.date}</p>
                              <p className="text-[11px] text-gray-500">{app.time}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                  app.status === 'Confirmed'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : app.status === 'Completed'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : app.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {app.status === 'Pending' && (
                                  <button
                                    onClick={() => handleStatusChange(app._id, 'Confirmed')}
                                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[11px] font-semibold cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {app.status === 'Confirmed' && (
                                  <button
                                    onClick={() => handleStatusChange(app._id, 'Completed')}
                                    className="px-2.5 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-[11px] font-semibold cursor-pointer"
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
