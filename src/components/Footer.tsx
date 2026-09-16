import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, MapPin, Clock, ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                HealthCare<span className="text-blue-500">+</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Simple, accessible healthcare information and appointment management for everyone. Connecting compassionate doctors with patients.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium pt-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Emergency Services Available 24/7</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About HealthCare+
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Clinical Services
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-white transition-colors">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Directions
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Patient & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Specialized Care
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>General Consultation</li>
              <li>Cardiology & Heart Health</li>
              <li>Comprehensive Dental Care</li>
              <li>Pediatrics & Newborn Care</li>
              <li>Clinical Dermatology</li>
              <li>Advanced Laboratory Diagnostics</li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Center
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-gray-400">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>100 Medical Center Parkway, Suite 400, New York, NY 10001</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>+1 (800) 555-CARE (2273)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>support@healthcareplus.com</span>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="bg-gray-800/70 border border-gray-700/60 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-200">Important Healthcare Notice: </strong>
              HealthCare+ is a demonstration project for educational purposes and does not provide medical diagnosis or treatment. In case of a medical emergency, please call your local emergency services (e.g., 911) immediately.
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} HealthCare+ Management System. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for academic excellence & healthcare accessibility</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
