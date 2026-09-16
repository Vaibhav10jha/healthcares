import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
          <Activity className="w-8 h-8" />
        </div>
        <span className="text-4xl font-extrabold text-blue-900">404</span>
        <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          The healthcare page or resource you are looking for might have been moved or is temporarily unavailable.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
