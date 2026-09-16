import React from 'react';
import {
  Stethoscope,
  HeartPulse,
  Smile,
  Baby,
  Sparkles,
  FlaskConical,
} from 'lucide-react';
import { ServiceItem } from '../components/ServiceCard';

export const healthcareServices: ServiceItem[] = [
  {
    id: 'general-consultation',
    name: 'General Consultation',
    description:
      'Comprehensive health screenings, preventive medical checkups, chronic disease management, and general wellness guidance.',
    icon: <Stethoscope className="w-6 h-6" />,
    popular: true,
    features: ['Routine physical exams', 'Prescription renewals', 'Lifestyle counseling'],
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description:
      'Expert diagnosis and treatment for cardiovascular conditions, hypertension, rhythm disorders, and proactive heart health.',
    icon: <HeartPulse className="w-6 h-6" />,
    popular: true,
    features: ['ECG & Echocardiography', 'Blood pressure management', 'Heart failure care'],
  },
  {
    id: 'dental-care',
    name: 'Dental Care',
    description:
      'Gentle preventive dentistry, restorative fillings, professional cleanings, cosmetic enhancements, and periodontal treatments.',
    icon: <Smile className="w-6 h-6" />,
    popular: false,
    features: ['Teeth whitening & hygiene', 'Root canal therapy', 'Cavity fillings'],
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description:
      'Dedicated pediatric care supporting childhood development, standard immunizations, newborn evaluations, and adolescent wellness.',
    icon: <Baby className="w-6 h-6" />,
    popular: true,
    features: ['Well-child visits', 'Vaccination programs', 'Growth milestones'],
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description:
      'Specialized care for complex skin conditions, acne management, eczema, mole mapping, and preventive dermatological screenings.',
    icon: <Sparkles className="w-6 h-6" />,
    popular: false,
    features: ['Acne & rosacea care', 'Skin cancer checks', 'Eczema & psoriasis'],
  },
  {
    id: 'laboratory-tests',
    name: 'Laboratory Tests',
    description:
      'Fast and accurate on-site diagnostic testing, complete blood counts, lipid panels, pathology, and prompt digital reporting.',
    icon: <FlaskConical className="w-6 h-6" />,
    popular: false,
    features: ['Comprehensive blood work', 'Urinalysis & Cultures', 'Rapid metabolic panels'],
  },
];
