'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiBriefcase, HiLocationMarker, HiClock, HiChevronRight,
  HiHeart, HiLightningBolt, HiGlobe, HiUserGroup
} from 'react-icons/hi';

const openPositions = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Kisumu / Remote',
    type: 'Full-time',
    description: 'Build and scale our platform using Next.js, Node.js, and PostgreSQL.',
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'Kisumu / Remote',
    type: 'Full-time',
    description: 'Create intuitive experiences for millions of African users.',
  },
  {
    id: 3,
    title: 'Operations Manager',
    department: 'Operations',
    location: 'Kakamega',
    type: 'Full-time',
    description: 'Lead our expansion efforts in the Kakamega region.',
  },
  {
    id: 4,
    title: 'Customer Success Lead',
    department: 'Customer Support',
    location: 'Kisumu',
    type: 'Full-time',
    description: 'Ensure our customers and providers have amazing experiences.',
  },
  {
    id: 5,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Kisumu / Remote',
    type: 'Full-time',
    description: 'Drive growth through creative campaigns and partnerships.',
  },
];

const benefits = [
  {
    icon: HiHeart,
    title: 'Health Coverage',
    description: 'Comprehensive medical insurance for you and your family',
  },
  {
    icon: HiLightningBolt,
    title: 'Growth Opportunities',
    description: 'Learning budget and career development programs',
  },
  {
    icon: HiGlobe,
    title: 'Flexible Work',
    description: 'Remote-friendly with flexible working hours',
  },
  {
    icon: HiUserGroup,
    title: 'Team Culture',
    description: 'Collaborative environment with regular team events',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary-500 to-primary-500 py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Help us build Africa's most loved super app. We're looking for 
              passionate people who want to make a real impact.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Work at Afrionex?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {openPositions.map((position) => (
                <div 
                  key={position.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                      <p className="text-gray-600 mt-1">{position.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <HiBriefcase className="w-4 h-4" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <HiLocationMarker className="w-4 h-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <HiClock className="w-4 h-4" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
                      Apply Now
                      <HiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Don't see a perfect fit?</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              We're always looking for talented people. Send us your resume and 
              we'll reach out when there's a match.
            </p>
            <a 
              href="mailto:careers@afrionex.com"
              className="btn-outline"
            >
              Send Your Resume
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
