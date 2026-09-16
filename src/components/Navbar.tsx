import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Calendar,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg whitespace-nowrap ${
      isActive
        ? 'text-blue-600 bg-blue-50/70 font-semibold'
        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block text-base font-medium px-4 py-2.5 rounded-xl transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 font-semibold'
        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus:outline-none group"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-blue-900 font-display flex items-center">
                HealthCare<span className="text-blue-600">+</span>
              </span>
              <span className="block text-[10px] text-gray-400 font-medium -mt-1 tracking-wider uppercase">
                Modern Clinic Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>
            <NavLink to="/doctors" className={navLinkClass}>
              Doctors
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {isAuthenticated && !isAdmin && (
              <>
                <div className="h-4 w-px bg-gray-200 mx-2" />
                <NavLink to="/dashboard" end className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/dashboard/appointments" className={navLinkClass}>
                  Appointments
                </NavLink>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <div className="h-4 w-px bg-gray-200 mx-2" />
                <NavLink to="/admin" end className={navLinkClass}>
                  Admin Dashboard
                </NavLink>
                <NavLink to="/admin/doctors" className={navLinkClass}>
                  Manage Doctors
                </NavLink>
                <NavLink to="/admin/appointments" className={navLinkClass}>
                  All Appointments
                </NavLink>
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 bg-white transition-all text-left focus:outline-none cursor-pointer"
                  id="user-menu-button"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="max-w-[130px]">
                    <p className="text-xs font-bold text-gray-800 truncate leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-blue-600 font-semibold capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {isAdmin ? (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                          <span>Admin Console</span>
                        </Link>
                        <Link
                          to="/admin/doctors"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                          <span>Manage Doctors</span>
                        </Link>
                        <Link
                          to="/admin/patients"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>Manage Patients</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                          <span>Patient Dashboard</span>
                        </Link>
                        <Link
                          to="/dashboard/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>My Appointments</span>
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <UserIcon className="w-4 h-4 text-blue-600" />
                          <span>Profile Settings</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {!isAdmin && (
              <Link to={isAuthenticated ? '/dashboard/book' : '/login?redirect=/dashboard/book'}>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Calendar className="w-3.5 h-3.5" />}
                >
                  Book Appointment
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Services
          </NavLink>
          <NavLink
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Doctors
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Contact
          </NavLink>

          <div className="border-t border-gray-100 my-2 pt-2" />

          {isAuthenticated ? (
            <div className="space-y-1">
              <div className="px-4 py-2 bg-blue-50/60 rounded-xl mb-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                  <p className="text-[11px] text-gray-500">{user?.email}</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                  {user?.role}
                </span>
              </div>

              {isAdmin ? (
                <>
                  <NavLink
                    to="/admin"
                    end
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    Admin Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/doctors"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    Manage Doctors
                  </NavLink>
                  <NavLink
                    to="/admin/patients"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    Manage Patients
                  </NavLink>
                  <NavLink
                    to="/admin/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    Manage Appointments
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/dashboard"
                    end
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    Dashboard Home
                  </NavLink>
                  <NavLink
                    to="/dashboard/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    My Appointments
                  </NavLink>
                  <NavLink
                    to="/dashboard/book"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    Book New Appointment
                  </NavLink>
                  <NavLink
                    to="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavLinkClass}
                  >
                    Profile Settings
                  </NavLink>
                </>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-base mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button variant="outline" className="w-full justify-center">
                  Log in
                </Button>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button variant="primary" className="w-full justify-center">
                  Register as Patient
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
