import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  User,
  Stethoscope,
  Users,
  LogOut,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardSidebarProps {
  isAdmin?: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isAdmin = false }) => {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
    }`;

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User Mini Profile */}
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-gray-900 truncate">{user?.name}</h4>
            <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider">
              {user?.role} Portal
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>

          {isAdmin ? (
            <>
              <NavLink to="/admin" end className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Overview</span>
              </NavLink>
              <NavLink to="/admin/doctors" className={linkClass}>
                <Stethoscope className="w-4 h-4" />
                <span>Manage Doctors</span>
              </NavLink>
              <NavLink to="/admin/patients" className={linkClass}>
                <Users className="w-4 h-4" />
                <span>Manage Patients</span>
              </NavLink>
              <NavLink to="/admin/appointments" className={linkClass}>
                <CalendarCheck className="w-4 h-4" />
                <span>All Appointments</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" end className={linkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Home</span>
              </NavLink>
              <NavLink to="/dashboard/appointments" className={linkClass}>
                <Calendar className="w-4 h-4" />
                <span>My Appointments</span>
              </NavLink>
              <NavLink to="/dashboard/book" className={linkClass}>
                <PlusCircle className="w-4 h-4" />
                <span>Book Appointment</span>
              </NavLink>
              <NavLink to="/dashboard/profile" className={linkClass}>
                <User className="w-4 h-4" />
                <span>Profile Details</span>
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Logout button at bottom */}
      <div className="pt-6 border-t border-gray-100 mt-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
