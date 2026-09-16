import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, Activity, ShieldCheck, UserCheck } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const isExpired = searchParams.get('expired') === 'true';

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
      // Determine where to redirect
      const savedUser = localStorage.getItem('healthcare_user');
      const parsed = savedUser ? JSON.parse(savedUser) : null;

      if (redirect) {
        navigate(redirect);
      } else if (parsed?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for teachers, evaluators, and students
  const handleQuickFill = (role: 'admin' | 'patient') => {
    if (role === 'admin') {
      setEmail('admin@healthcareplus.com');
      setPassword('admin123');
    } else {
      setEmail('patient@healthcareplus.com');
      setPassword('patient123');
    }
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12 bg-gray-50/60">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Welcome to HealthCare+
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to access your appointments, medical history, or admin console.
          </p>
        </div>

        {/* Expired Session Alert */}
        {isExpired && (
          <div className="text-xs bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200">
            Your previous session has concluded. Please sign in again.
          </div>
        )}

        {/* Error Alert */}
        {error && <ErrorMessage message={error} />}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="patient@healthcareplus.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full justify-center"
            isLoading={isLoading}
            rightIcon={<LogIn className="w-4 h-4" />}
          >
            Sign In to Portal
          </Button>
        </form>

        {/* Quick Demo Credentials Panel for College Evaluator / Grader */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider text-center mb-2.5">
            1-Click Demo Evaluation Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Fill Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('patient')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold bg-green-50 text-green-800 hover:bg-green-100 border border-green-200 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-green-600" />
              <span>Fill Demo Patient</span>
            </button>
          </div>
        </div>

        {/* Register footer link */}
        <div className="text-center text-xs text-gray-600 pt-1">
          Don't have a patient account yet?{' '}
          <Link
            to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
