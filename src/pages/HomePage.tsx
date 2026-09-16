import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  ShieldCheck,
  Award,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Search,
  ChevronDown,
  Star,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import Button from '../components/Button';
import DoctorCard from '../components/DoctorCard';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { healthcareServices } from '../data/servicesData';
import { doctorService } from '../services/api';
import { Doctor } from '../types';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState<boolean>(true);
  const [doctorError, setDoctorError] = useState<string | null>(null);
  const [specializationFilter, setSpecializationFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, [specializationFilter]);

  const fetchDoctors = async () => {
    setIsLoadingDoctors(true);
    setDoctorError(null);
    try {
      const res = await doctorService.getDoctors({
        specialization: specializationFilter !== 'All' ? specializationFilter : undefined,
      });
      setDoctors(res.doctors);
    } catch (err: any) {
      setDoctorError('Unable to load doctors. Please verify connection and try again.');
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
  };

  const filteredFeaturedDoctors = doctors.slice(0, 3);

  const faqs = [
    {
      question: 'How do I book an appointment on HealthCare+?',
      answer:
        'Booking is effortless! Create a free patient account or log in, browse our directory of qualified doctors, select an available date and time slot that fits your schedule, and provide a brief visit reason. You will receive an immediate status confirmation.',
    },
    {
      question: 'Can I reschedule or cancel my appointment?',
      answer:
        'Yes! Patients can cancel any Pending or Confirmed appointments directly from their Patient Dashboard under "My Appointments" with a single click.',
    },
    {
      question: 'Are the doctors certified and background verified?',
      answer:
        'Every medical professional listed on HealthCare+ undergoes comprehensive credential verification, including state medical board licenses, academic certifications, and specialty fellowship credentials.',
    },
    {
      question: 'What happens after I submit an appointment request?',
      answer:
        'Your appointment starts in "Pending" status. Our clinic administration reviews and confirms your time slot. You can check the real-time status in your dashboard anytime.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-12 pb-18 sm:pt-18 sm:pb-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Generation Healthcare Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 tracking-tight leading-[1.15]">
                Your Health, <br className="hidden sm:inline" />
                <span className="text-blue-600">Our Priority</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Simple, accessible healthcare information and appointment management for everyone. Connect with certified doctors and manage your visits seamlessly.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link to={isAuthenticated ? '/dashboard/book' : '/login?redirect=/dashboard/book'}>
                  <Button
                    size="lg"
                    variant="primary"
                    leftIcon={<Calendar className="w-4 h-4" />}
                  >
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline">
                    Explore Services
                  </Button>
                </Link>
              </div>

              {/* Quick Doctor Search Box */}
              <div className="pt-4 max-w-xl mx-auto lg:mx-0">
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-white p-2 rounded-2xl border border-gray-200 shadow-md flex items-center gap-2"
                >
                  <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor, specialization, or condition..."
                    className="w-full text-sm text-gray-800 focus:outline-none placeholder:text-gray-400 py-2 px-2"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    Search
                  </Button>
                </form>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/70 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black text-blue-900">50+</p>
                  <p className="text-xs text-gray-500 font-medium">Certified Doctors</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-blue-900">15k+</p>
                  <p className="text-xs text-gray-500 font-medium">Happy Patients</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-blue-900">98%</p>
                  <p className="text-xs text-gray-500 font-medium">Positive Care Rating</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                    alt="Medical team caring for patient"
                    referrerPolicy="no-referrer"
                    className="w-full h-[440px] object-cover object-center"
                  />
                </div>

                {/* Floating badge 1: Available 24/7 */}
                <div className="absolute -bottom-5 -left-4 sm:left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Emergency & OPD</p>
                    <p className="text-[11px] text-green-600 font-semibold">24/7 Continuous Support</p>
                  </div>
                </div>

                {/* Floating badge 2: Top rated */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3.5 shadow-xl border border-gray-100 flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">4.9 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HEALTHCARE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Comprehensive Clinical Care
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Healthcare Services
          </h2>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            From routine checkups to specialized diagnostics, our state-of-the-art departments provide compassionate, patient-first care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthcareServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/services">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All 6 Clinical Services
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="bg-blue-50/50 py-16 border-y border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                Patient-Centered Excellence
              </span>
              <h2 className="text-3xl font-bold text-gray-900">
                Why Patients Choose HealthCare+
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We combine clinical rigor, cutting-edge appointment workflows, and genuine compassion to deliver an unparalleled care experience.
              </p>

              <div className="pt-4 space-y-3.5">
                {[
                  {
                    title: 'Verified Medical Specialists',
                    desc: 'Every physician is board-certified with extensive clinical background.',
                    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
                  },
                  {
                    title: 'Zero Waiting Queue Friction',
                    desc: 'Real-time appointment slot scheduling prevents long waiting room delays.',
                    icon: <Clock className="w-5 h-5 text-blue-600" />,
                  },
                  {
                    title: 'Compassionate Treatment Plans',
                    desc: 'Personalized wellness and disease management tailored to your life.',
                    icon: <HeartHandshake className="w-5 h-5 text-blue-600" />,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Top Accreditation</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Recognized by regional health boards for adherence to clinical quality protocols and patient safety benchmarks.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Dedicated Support</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Our patient advocacy team assists you with pre-visit inquiries, scheduling adjustments, and post-consultation follow-up.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Modern Digital Portal</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Access your upcoming visit reminders, booking history, and doctor profiles instantly on any phone, tablet, or desktop.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Flexible Time Slots</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Early morning, afternoon, and weekend hours allow you to receive care without disrupting your work and family routines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              Meet Our Specialists
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">Featured Doctors</h2>
            <p className="text-sm text-gray-600 mt-2">
              Browse top medical specialists ready to support your health journey.
            </p>
          </div>

          {/* Quick Specialization Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {['All', 'Cardiology', 'General Consultation', 'Dental Care', 'Pediatrics'].map((spec) => (
              <button
                key={spec}
                onClick={() => setSpecializationFilter(spec)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  specializationFilter === spec
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {isLoadingDoctors ? (
          <LoadingSpinner text="Loading doctors..." />
        ) : doctorError ? (
          <ErrorMessage message={doctorError} onRetry={fetchDoctors} />
        ) : filteredFeaturedDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-sm text-gray-500">No doctors found for the selected specialization.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeaturedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onBook={(doc) => navigate(`/dashboard/book?doctor=${doc._id}`)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/doctors">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Browse All Doctors & Specialties
            </Button>
          </Link>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              Step-by-Step Flow
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">How It Works</h2>
            <p className="text-sm text-gray-600 mt-2">
              Booking your consultation with HealthCare+ takes just four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Find Your Specialist',
                desc: 'Filter by clinical department, experience, and doctor availability to choose the right expert.',
              },
              {
                step: '02',
                title: 'Select Date & Time',
                desc: 'Pick your preferred consultation slot from available calendar days and hours.',
              },
              {
                step: '03',
                title: 'Confirm Booking',
                desc: 'Submit your visit reason and receive an instant booking confirmation with status tracking.',
              },
              {
                step: '04',
                title: 'Receive Quality Care',
                desc: 'Attend your consultation and receive attentive, personalized healthcare guidance.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 relative group hover:bg-white hover:shadow-md transition-all"
              >
                <span className="text-4xl font-extrabold text-blue-200 group-hover:text-blue-600 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-4">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Real Experiences
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">What Our Patients Say</h2>
          <p className="text-sm text-gray-600 mt-2">
            Read stories from individuals and families who trust HealthCare+ for their clinical needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'Booking an appointment with Dr. Jenkins was faster than any clinic I’ve ever visited. The online confirmation gave me complete peace of mind, and the follow-up was thorough.',
              name: 'Clara Henderson',
              role: 'Cardiology Patient',
              rating: 5,
            },
            {
              quote:
                'As a working mother of two, having transparent scheduling for pediatricians is a game-changer. The clinic staff is warm and the online portal is clean and reliable.',
              name: 'David Reynolds',
              role: 'Pediatric Care Parent',
              rating: 5,
            },
            {
              quote:
                'The dental team under Dr. Rostova took excellent care of my tooth emergency. I scheduled the slot online in the morning and was treated the same afternoon.',
              name: 'Maya Lin',
              role: 'Dental Care Patient',
              rating: 5,
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
                <p className="text-xs text-blue-600 font-medium">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Need Help?
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CONTACT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to schedule your appointment?
            </h2>
            <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
              Book online in under two minutes or contact our 24/7 care coordination desk for immediate scheduling assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to={isAuthenticated ? '/dashboard/book' : '/login?redirect=/dashboard/book'}>
              <Button
                variant="light"
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 border-0"
              >
                Book Appointment
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-blue-300 hover:bg-blue-800 hover:text-white"
                leftIcon={<PhoneCall className="w-4 h-4" />}
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
