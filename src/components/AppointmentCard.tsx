import React from 'react';
import { Calendar, Clock, User as UserIcon, AlertCircle, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';
import Button from './Button';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: AppointmentStatus) => void;
  isAdmin?: boolean;
  isCancelling?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onStatusChange,
  isAdmin = false,
  isCancelling = false,
}) => {
  const statusConfig: Record<
    AppointmentStatus,
    { badgeBg: string; text: string; icon: React.ReactNode }
  > = {
    Pending: {
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      text: 'Pending Confirmation',
      icon: <Clock3 className="w-3.5 h-3.5 text-amber-600" />,
    },
    Confirmed: {
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      text: 'Confirmed',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
    },
    Completed: {
      badgeBg: 'bg-green-50 text-green-700 border-green-200',
      text: 'Completed',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />,
    },
    Cancelled: {
      badgeBg: 'bg-red-50 text-red-700 border-red-200',
      text: 'Cancelled',
      icon: <XCircle className="w-3.5 h-3.5 text-red-600" />,
    },
  };

  const currentStatus = statusConfig[appointment.status] || statusConfig.Pending;
  const canCancel = appointment.status === 'Pending' || appointment.status === 'Confirmed';

  return (
    <div
      id={`appointment-card-${appointment._id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 hover:shadow-md transition-all duration-200"
    >
      {/* Header with Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            {appointment.doctor?.name ? appointment.doctor.name.charAt(4) || 'D' : 'D'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              {appointment.doctor?.name || 'Healthcare Specialist'}
            </h4>
            <p className="text-xs text-blue-600 font-medium">
              {appointment.doctor?.specialization || 'General Consultation'}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStatus.badgeBg}`}
        >
          {currentStatus.icon}
          <span>{currentStatus.text}</span>
        </span>
      </div>

      {/* Appointment Timings & Patient */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Date</p>
            <p className="font-semibold text-gray-800">{appointment.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Time Slot</p>
            <p className="font-semibold text-gray-800">{appointment.time}</p>
          </div>
        </div>
      </div>

      {/* Patient info for admin */}
      {isAdmin && appointment.patient && (
        <div className="mt-3 text-xs bg-blue-50/60 rounded-xl p-2.5 text-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">Patient: {appointment.patient.name}</span>
          </div>
          <span className="text-gray-500">{appointment.patient.phone || appointment.patient.email}</span>
        </div>
      )}

      {/* Reason */}
      <div className="mt-3">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Reason for visit</p>
        <p className="mt-1 text-xs text-gray-700 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
          {appointment.reason}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-gray-400">
          Ref: #{appointment._id.slice(-6).toUpperCase()}
        </span>

        {/* Patient Cancel Action */}
        {!isAdmin && canCancel && onCancel && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={() => onCancel(appointment._id)}
            isLoading={isCancelling}
          >
            Cancel Appointment
          </Button>
        )}

        {/* Admin status toggles */}
        {isAdmin && onStatusChange && (
          <div className="flex items-center gap-1.5">
            {appointment.status !== 'Confirmed' && (
              <Button
                size="sm"
                variant="light"
                className="text-xs py-1.5 px-3"
                onClick={() => onStatusChange(appointment._id, 'Confirmed')}
              >
                Confirm
              </Button>
            )}
            {appointment.status !== 'Completed' && (
              <Button
                size="sm"
                variant="primary"
                className="text-xs py-1.5 px-3 bg-green-600 hover:bg-green-700"
                onClick={() => onStatusChange(appointment._id, 'Completed')}
              >
                Complete
              </Button>
            )}
            {appointment.status !== 'Cancelled' && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs py-1.5 px-3 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onStatusChange(appointment._id, 'Cancelled')}
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
