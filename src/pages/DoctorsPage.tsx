import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Stethoscope, RefreshCw, X } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { doctorService } from '../services/api';
import { Doctor } from '../types';

export const DoctorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initialSearch = searchParams.get('search') || '';
  const initialSpec = searchParams.get('specialization') || 'All';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>(initialSpec);

  const navigate = useNavigate();

  const specializations = [
    'All',
    'General Consultation',
    'Cardiology',
    'Dental Care',
    'Pediatrics',
    'Dermatology',
  ];

  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const search = searchParams.get('search') || undefined;
      const spec = searchParams.get('specialization') || undefined;

      const res = await doctorService.getDoctors({
        search,
        specialization: spec && spec !== 'All' ? spec : undefined,
      });
      setDoctors(res.doctors);
    } catch (err: any) {
      setError('Unable to load doctors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleSpecializationChange = (spec: string) => {
    setSelectedSpecialization(spec);
    const newParams = new URLSearchParams(searchParams);
    if (spec !== 'All') {
      newParams.set('specialization', spec);
    } else {
      newParams.delete('specialization');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('All');
    setSearchParams(new URLSearchParams());
  };

  const isFiltered = !!searchParams.get('search') || (!!searchParams.get('specialization') && searchParams.get('specialization') !== 'All');

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50/70 to-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Accredited Clinical Faculty</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Find Your Doctor
          </h1>
          <p className="text-base text-gray-600 mt-3 leading-relaxed">
            Search through our board-certified medical doctors, review qualifications and consultation hours, and schedule your appointment.
          </p>

          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-xl mx-auto bg-white p-2 rounded-2xl border border-gray-200 shadow-md flex items-center gap-2"
          >
            <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by doctor name, qualification, or keywords..."
              className="w-full text-sm text-gray-800 focus:outline-none placeholder:text-gray-400 py-2 px-2"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Button type="submit" size="sm" variant="primary">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Filter and Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Specialization Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 max-w-full">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => handleSpecializationChange(spec)}
                className={`text-xs px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedSpecialization === spec
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Doctor Results Display */}
        <div className="mt-8">
          {isLoading ? (
            <LoadingSpinner text="Loading medical specialists..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchDoctors} />
          ) : doctors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Doctors Found</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We couldn't find any medical specialists matching your search criteria. Try modifying your search keywords or clearing your filters.
              </p>
              <Button size="sm" variant="outline" onClick={clearFilters}>
                View All Doctors
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-500">
                Showing {doctors.length} qualified specialist{doctors.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    onBook={(doc) => navigate(`/dashboard/book?doctor=${doc._id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;
