import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Stethoscope, Sparkles } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/Button';
import { healthcareServices } from '../data/servicesData';

export const ServicesPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50/70 to-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Disciplinary Medical Care</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Our Healthcare Services
          </h1>
          <p className="text-base text-gray-600 mt-4 leading-relaxed">
            We provide specialized diagnostic, preventive, and clinical treatments tailored to your health requirements, delivered by experienced practitioners.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthcareServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Booking Prompt Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900">
              Not sure which service you need?
            </h3>
            <p className="text-sm text-gray-600 max-w-xl">
              Schedule a General Consultation with our family physicians. They will evaluate your symptoms and refer you to the appropriate specialist department.
            </p>
          </div>
          <Link to="/doctors?specialization=General+Consultation">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Consult General Physician
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
