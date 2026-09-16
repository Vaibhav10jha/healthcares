import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, Calendar, ChevronRight, Stethoscope } from 'lucide-react';
import { Doctor } from '../types';
import Button from './Button';

interface DoctorCardProps {
  doctor: Doctor;
  onBook?: (doctor: Doctor) => void;
  showBookButton?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBook,
  showBookButton = true,
}) => {
  return (
    <div
      id={`doctor-card-${doctor._id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
    >
      {/* Top Media / Avatar */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={doctor.image}
          alt={doctor.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>{doctor.specialization}</span>
        </div>
        <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
          <Award className="w-3 h-3 text-amber-400" />
          <span>{doctor.experience}</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-1">
            {doctor.qualification}
          </p>

          <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">
                {Array.isArray(doctor.availableDays)
                  ? doctor.availableDays.join(', ')
                  : doctor.availableDays}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{doctor.availableTime}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 flex items-center gap-2">
          <Link
            to={`/doctors/${doctor._id}`}
            className="flex-1 inline-flex items-center justify-center text-xs font-semibold py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            View Profile
          </Link>
          {showBookButton && (
            <Button
              size="sm"
              variant="primary"
              className="flex-1 text-xs py-2.5"
              onClick={() => (onBook ? onBook(doctor) : null)}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Book
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
