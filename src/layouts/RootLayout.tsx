import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 text-gray-800 font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-blue-900 text-white text-[11px] py-1.5 px-4 text-center font-medium">
        <span className="opacity-90">
          🏥 HealthCare+ Demonstration Clinic Portal — Fully functional demo with live booking & admin controls
        </span>
      </div>

      {/* Main Navbar */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default RootLayout;
