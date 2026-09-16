import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Heart,
  Target,
  Eye,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Button from '../components/Button';

export const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Happy Patients Served', value: '15,000+' },
    { label: 'Board-Certified Doctors', value: '50+' },
    { label: 'Clinical Satisfaction Rate', value: '98.4%' },
    { label: 'Specialized Medical Units', value: '12+' },
  ];

  const values = [
    {
      title: 'Clinical Integrity',
      desc: 'We adhere to the highest international safety, diagnostic, and ethical medical standards across all clinical operations.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Empathy & Dignity',
      desc: 'We treat each patient as an individual with distinct concerns, providing supportive, clear, and reassuring guidance.',
      icon: <Heart className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Accessible Innovation',
      desc: 'Leveraging smart digital scheduling and transparent health records to remove healthcare access friction.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Collaborative Care',
      desc: 'Our cross-disciplinary team of general practitioners and specialists consult seamlessly to design cohesive care pathways.',
      icon: <Users className="w-5 h-5 text-blue-600" />,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-blue-50/80 to-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            About Our Organization
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Compassionate, Accessible Healthcare for Everyone
          </h1>
          <p className="text-base text-gray-600 mt-4 leading-relaxed">
            HealthCare+ was founded with a straightforward mission: to unite top-tier medical specialists with a modern, hassle-free appointment experience.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To deliver exceptional, preventative, and restorative healthcare services by eliminating the complexities of clinic navigation, ensuring timely medical consultations, and empowering patients with clear information.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To become the standard for modern outpatient and community medical management, where technology and human warmth coalesce to ensure no individual experiences delays in receiving quality medical guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 text-white rounded-3xl p-8 sm:p-12 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-blue-100 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Guiding Principles
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            The Values That Define Us
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Every clinical decision, technological integration, and patient interaction is grounded in these core tenets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900">{v.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why patients choose us */}
      <section className="bg-gray-50/70 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                Proven Track Record
              </span>
              <h2 className="text-3xl font-bold text-gray-900">
                Why Patients Trust HealthCare+
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                From initial symptom inquiry to recovery follow-ups, our patient care pathways are designed to be smooth, empathetic, and transparent.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Direct booking with accredited medical doctors without intermediary brokers',
                  'Instant electronic booking confirmation with real-time status visibility',
                  'Comprehensive specialty departments under one coordinated digital roof',
                  'Strict patient data privacy and confidential consultation handling',
                  'Zero unexpected booking fees or opaque administration surcharges',
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/doctors">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Meet Our Medical Team
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                  alt="Modern Hospital Facility"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
