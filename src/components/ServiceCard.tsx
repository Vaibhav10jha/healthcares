import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  color?: string;
  features?: string[];
}

interface ServiceCardProps {
  service: ServiceItem;
  onSelect?: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div
      id={`service-card-${service.id}`}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center p-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            {service.icon}
          </div>
          {service.popular && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              Popular
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {service.name}
        </h3>

        <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
          {service.description}
        </p>

        {service.features && (
          <ul className="mt-4 space-y-1.5 text-xs text-gray-500">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <Link
          to={`/doctors?specialization=${encodeURIComponent(service.name)}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors group/link"
          onClick={() => onSelect && onSelect(service)}
        >
          <span>Find Specialists</span>
          <ChevronRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
        </Link>
        <span className="text-[11px] text-gray-400 font-medium">Verified Care</span>
      </div>
    </div>
  );
};

export default ServiceCard;
