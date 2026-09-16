import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Award,
  Stethoscope,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Building,
} from 'lucide-react';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { doctorService } from '../services/api';
import { Doctor } from '../types';
import { useAuth } from '../context/AuthContext';

export const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      fetchDoctor(id);
    }
  }, [id]);

  const fetchDoctor = async (doctorId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await doctorService.getDoctorById(doctorId);
      setDoctor(res.doctor);
    } catch (err: any) {
      setError('Unable to load doctor profile. The specialist may no longer be active.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!doctor) return;
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/dashboard/book?doctor=${doctor._id}`)}`);
    } else {
      navigate(`/dashboard/book?doctor=${doctor._id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingSpinner size="lg" text="Loading doctor credentials and schedule..." />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <ErrorMessage message={error || 'Doctor profile not found'} onRetry={() => id && fetchDoctor(id)} />
        <div className="mt-6 text-center">
          <Link to="/doctors">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Doctors Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/doctors"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Doctors</span>
      </Link>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Avatar / Photo */}
          <div className="md:col-span-4">
            <div className="w-full h-72 rounded-2xl overflow-hidden shadow-md bg-gray-100 relative">
              <img
                src={doctor.image}
                alt={doctor.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{doctor.specialization}</span>
              </div>
            </div>
          </div>

          {/* Details & CTA */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {doctor.name}
                </h1>
                <p className="text-sm text-blue-600 font-semibold mt-1">
                  {doctor.qualification}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>Accepting Patients</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-1">
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-gray-800">{doctor.experience}</span>
                <span>clinical experience</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl">
                <Building className="w-4 h-4 text-blue-600" />
                <span>HealthCare+ Main Campus</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>{doctor.phone}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleBookNow}
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Book Appointment with {doctor.name.split(' ')[1] || 'Doctor'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Bio & Qualifications */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">About the Physician</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {doctor.bio}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Clinical Focus & Specialization</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60">
                <p className="font-bold text-blue-900">Primary Specialization</p>
                <p className="text-gray-700 mt-1">{doctor.specialization}</p>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60">
                <p className="font-bold text-blue-900">Academic Credential</p>
                <p className="text-gray-700 mt-1">{doctor.qualification}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Availability & Scheduling Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Consultation Schedule</h2>

            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Available Consultation Days</span>
                </div>
                <p className="text-gray-600 pl-6">
                  {Array.isArray(doctor.availableDays)
                    ? doctor.availableDays.join(', ')
                    : doctor.availableDays}
                </p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Daily Consultation Hours</span>
                </div>
                <p className="text-gray-600 pl-6">{doctor.availableTime}</p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={handleBookNow}
              >
                Schedule Visit Now
              </Button>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-5 space-y-2 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Verified Health Practitioner</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              Appointments are held at HealthCare+ Clinical Suites with direct patient-to-physician confidentiality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
