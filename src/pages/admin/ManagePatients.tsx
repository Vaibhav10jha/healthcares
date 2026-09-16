import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar, UserCheck } from 'lucide-react';
import { adminService } from '../../services/api';
import { User } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import DashboardSidebar from '../../components/DashboardSidebar';

export const ManagePatients: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getPatients();
      setPatients(res.patients);
    } catch (err: any) {
      setError('Unable to load patient records.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.phone && p.phone.includes(searchQuery))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <DashboardSidebar isAdmin={true} />

        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Patients</h1>
              <p className="text-xs text-gray-500 mt-1">
                Directory of registered patient profiles, contact phone numbers, and activity.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 text-xs font-semibold text-blue-800">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>{patients.length} Registered Patients</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-2 max-w-md">
            <Search className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by patient name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-gray-800 focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Patient Table */}
          {isLoading ? (
            <LoadingSpinner text="Loading patient records..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchPatients} />
          ) : filteredPatients.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-xs text-gray-500 text-xs">
              No patients found matching "{searchQuery}".
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-3.5">Patient Name</th>
                      <th className="px-6 py-3.5">Email Address</th>
                      <th className="px-6 py-3.5">Phone Number</th>
                      <th className="px-6 py-3.5">Account Role</th>
                      <th className="px-6 py-3.5">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPatients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              {patient.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-gray-900">{patient.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{patient.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{patient.phone || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              patient.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {patient.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-[11px]">
                          {patient.createdAt
                            ? new Date(patient.createdAt).toLocaleDateString()
                            : 'Active'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePatients;
