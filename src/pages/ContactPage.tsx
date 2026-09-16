import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
  Building,
} from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email format';
    }
    if (!formData.phone.trim()) errs.phone = 'Please provide a contact phone number';
    if (!formData.subject.trim()) errs.subject = 'Please enter an inquiry subject';
    if (!formData.message.trim()) errs.message = 'Please provide message details';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 800);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50/70 to-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Get In Touch
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
            Contact HealthCare+
          </h1>
          <p className="text-base text-gray-600 mt-3 leading-relaxed">
            Have questions about clinical scheduling, insurance partnerships, or clinic directions? Our support team is here to assist you.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-gray-900">
                Clinic Coordination Desk
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Reach out to our patient concierge team for immediate appointments or non-emergency inquiries.
              </p>

              <div className="space-y-4 text-xs text-gray-700">
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-gray-50">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Main Facility Address</p>
                    <p className="mt-0.5 text-gray-600">
                      100 Medical Center Parkway, Suite 400, New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-gray-50">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Telephone Lines</p>
                    <p className="mt-0.5 text-gray-600">
                      Toll-Free: +1 (800) 555-CARE (2273)
                    </p>
                    <p className="text-gray-500">Direct OPD: +1 (555) 019-2834</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-gray-50">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Electronic Mail</p>
                    <p className="mt-0.5 text-gray-600">support@healthcareplus.com</p>
                    <p className="text-gray-500">appointments@healthcareplus.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-gray-50">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Operating Hours</p>
                    <p className="mt-0.5 text-gray-600">
                      Monday - Friday: 08:00 AM - 08:00 PM
                    </p>
                    <p className="text-gray-600">Saturday: 09:00 AM - 05:00 PM</p>
                    <p className="text-green-600 font-semibold mt-1">
                      Emergency Ward: Open 24 Hours / 7 Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Send Us a Message
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill in the form below and a clinic coordinator will respond within 24 business hours.
              </p>

              {submitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-green-900">Message Dispatched!</h3>
                  <p className="text-xs text-green-700 max-w-sm mx-auto">
                    Thank you for contacting HealthCare+. Your inquiry has been logged, and our team will get back to you shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-2"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      required
                    />
                    <Input
                      label="Subject"
                      name="subject"
                      placeholder="Appointment inquiry, general question..."
                      value={formData.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Please describe how we can assist you..."
                      value={formData.message}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        errors.message
                          ? 'border-red-300 text-red-900 focus:ring-red-200 bg-red-50/30'
                          : 'border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Submit Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Hospital Campus Location
              </h3>
              <p className="text-xs text-gray-500">
                Convenient transit access and complimentary 2-hour patient parking.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions Available</span>
              </span>
            </div>
          </div>

          {/* Interactive Graphic Map Placeholder */}
          <div className="relative h-80 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(#2563eb 1.5px, transparent 1.5px), radial-gradient(#2563eb 1.5px, #f1f5f9 1.5px)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px',
              }}
            />

            {/* Roads visualization */}
            <div className="absolute w-full h-12 bg-gray-200 rotate-12 top-1/3" />
            <div className="absolute h-full w-14 bg-gray-200 -rotate-6 left-1/2" />

            {/* Central Pin */}
            <div className="relative z-10 bg-white rounded-2xl p-4 shadow-xl border border-gray-200 text-center max-w-xs animate-bounce">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900">HealthCare+ Center</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                100 Medical Center Parkway
              </p>
              <p className="text-[10px] text-blue-600 font-semibold mt-1">
                Entrance B • OPD Wing
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
