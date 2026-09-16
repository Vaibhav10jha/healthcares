import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Stethoscope,
  Mail,
  Phone,
  Clock,
  Calendar,
  Award,
  Search,
} from 'lucide-react';
import { doctorService } from '../../services/api';
import { Doctor } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import DashboardSidebar from '../../components/DashboardSidebar';

interface DoctorFormData {
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  availableDays: string;
  availableTime: string;
  phone: string;
  email: string;
  image: string;
  bio: string;
}

const defaultFormData: DoctorFormData = {
  name: '',
  specialization: 'General Consultation',
  qualification: '',
  experience: '5 years',
  availableDays: 'Monday, Wednesday, Friday',
  availableTime: '09:00 AM - 05:00 PM',
  phone: '',
  email: '',
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
  bio: '',
};

export const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>(defaultFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await doctorService.getDoctors();
      setDoctors(res.doctors);
    } catch (err: any) {
      setError('Unable to load doctors catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    setFormData(defaultFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      availableDays: Array.isArray(doctor.availableDays)
        ? doctor.availableDays.join(', ')
        : doctor.availableDays,
      availableTime: doctor.availableTime,
      phone: doctor.phone,
      email: doctor.email,
      image: doctor.image,
      bio: doctor.bio,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Doctor name is required';
    if (!formData.qualification.trim()) errs.qualification = 'Qualification is required (e.g., MD, MBBS)';
    if (!formData.phone.trim()) errs.phone = 'Contact phone is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.bio.trim()) errs.bio = 'Brief professional bio is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        availableDays: formData.availableDays.split(',').map((d) => d.trim()),
      };

      if (editingDoctor) {
        await doctorService.updateDoctor(editingDoctor._id, payload);
      } else {
        await doctorService.createDoctor(payload);
      }

      setIsModalOpen(false);
      await fetchDoctors();
    } catch (err: any) {
      alert(err.message || 'Failed to save doctor details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;
    setIsDeleting(true);
    try {
      await doctorService.deleteDoctor(doctorToDelete._id);
      setDeleteModalOpen(false);
      setDoctorToDelete(null);
      await fetchDoctors();
    } catch (err: any) {
      alert(err.message || 'Failed to delete doctor.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <DashboardSidebar isAdmin={true} />

        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
              <p className="text-xs text-gray-500 mt-1">
                Add new specialists, edit consultation schedules, and manage medical staff.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Doctor
            </Button>
          </div>

          {/* Search Filter */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-2 max-w-md">
            <Search className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-gray-800 focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Doctors Table / Cards */}
          {isLoading ? (
            <LoadingSpinner text="Retrieving medical staff..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchDoctors} />
          ) : filteredDoctors.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-xs text-gray-500 text-xs">
              No doctors found matching "{searchQuery}".
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-3.5">Doctor</th>
                      <th className="px-6 py-3.5">Specialization</th>
                      <th className="px-6 py-3.5">Available Days</th>
                      <th className="px-6 py-3.5">Time Hours</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDoctors.map((doc) => (
                      <tr key={doc._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={doc.image}
                              alt={doc.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-bold text-gray-900">{doc.name}</p>
                              <p className="text-[11px] text-gray-500">{doc.qualification}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                            {doc.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {Array.isArray(doc.availableDays)
                            ? doc.availableDays.join(', ')
                            : doc.availableDays}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">
                          {doc.availableTime}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(doc)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Doctor"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(doc)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Doctor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor Profile' : 'Add New Medical Specialist'}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveDoctor}
              isLoading={isSaving}
            >
              {editingDoctor ? 'Save Changes' : 'Add Doctor'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveDoctor} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Doctor Full Name"
              placeholder="Dr. Eleanor Vance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Specialization <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="General Consultation">General Consultation</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dental Care">Dental Care</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Laboratory Tests">Laboratory Tests</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Qualification / Degrees"
              placeholder="MD, FACC, MBBS"
              value={formData.qualification}
              onChange={(e) =>
                setFormData({ ...formData, qualification: e.target.value })
              }
              error={formErrors.qualification}
              required
            />
            <Input
              label="Years of Experience"
              placeholder="10 years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Available Days (comma separated)"
              placeholder="Monday, Wednesday, Friday"
              value={formData.availableDays}
              onChange={(e) =>
                setFormData({ ...formData, availableDays: e.target.value })
              }
              required
            />
            <Input
              label="Consultation Hours"
              placeholder="09:00 AM - 05:00 PM"
              value={formData.availableTime}
              onChange={(e) =>
                setFormData({ ...formData, availableTime: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone"
              placeholder="+1 (555) 019-2834"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={formErrors.phone}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="doctor@healthcareplus.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
              required
            />
          </div>

          <Input
            label="Profile Image URL"
            placeholder="https://images.unsplash.com/photo-..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Professional Biography <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Detailed background, clinical interests, education..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {formErrors.bio && (
              <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.bio}</p>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Doctor Record"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
            >
              Delete Permanently
            </Button>
          </div>
        }
      >
        <p className="text-xs text-gray-600 leading-relaxed">
          Are you sure you want to remove{' '}
          <strong className="text-gray-900">{doctorToDelete?.name}</strong> from the clinic's doctor roster?
        </p>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
