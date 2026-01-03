'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiLightningBolt, HiGlobe, HiUserGroup, HiShieldCheck,
  HiHeart, HiLocationMarker
} from 'react-icons/hi';

const team = [
  {
    name: 'James Ochieng',
    role: 'CEO & Founder',
    image: 'https://ui-avatars.com/api/?name=James+Ochieng&background=FF6B9D&color=fff&size=200',
    bio: 'Visionary leader with 10+ years in fintech',
  },
  {
    name: 'Grace Wanjiku',
    role: 'CTO',
    image: 'https://ui-avatars.com/api/?name=Grace+Wanjiku&background=4ECDC4&color=fff&size=200',
    bio: 'Tech innovator passionate about African solutions',
  },
  {
    name: 'David Kimani',
    role: 'Head of Operations',
    image: 'https://ui-avatars.com/api/?name=David+Kimani&background=F7B32B&color=fff&size=200',
    bio: 'Operations expert ensuring seamless service delivery',
  },
  {
    name: 'Amina Hassan',
    role: 'Head of Marketing',
    image: 'https://ui-avatars.com/api/?name=Amina+Hassan&background=95E1D3&color=fff&size=200',
    bio: 'Brand strategist connecting communities',
  },
];

const values = [
  {
    icon: HiLightningBolt,
    title: 'Innovation',
    description: 'We build cutting-edge solutions tailored for African markets.',
  },
  {
    icon: HiUserGroup,
    title: 'Community',
    description: 'Empowering local providers and connecting communities.',
  },
  {
    icon: HiShieldCheck,
    title: 'Trust',
    description: 'Every provider is verified. Every transaction is secure.',
  },
  {
    icon: HiHeart,
    title: 'Impact',
    description: 'Creating opportunities and transforming lives across Africa.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-500 to-secondary-500 py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Afrionex
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We're building Africa's most trusted super app — connecting people with 
              services, products, and opportunities in one seamless platform.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Afrionex was born from a simple idea: make everyday life easier for Africans. 
                From booking a haircut to ordering groceries, from finding a plumber to catching 
                a ride — we believe you deserve a platform that just works. Starting in Western 
                Kenya, we're building the infrastructure for Africa's digital future.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Where We Operate</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Currently serving Western Kenya with plans to expand across East Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Kisumu', 'Kakamega', 'Bungoma', 'Busia'].map((city) => (
                <div key={city} className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full">
                  <HiLocationMarker className="w-5 h-5" />
                  <span className="font-medium">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-secondary-500 to-primary-500">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Join the Afrionex Movement</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Whether you're looking for services or want to offer your skills, 
              Afrionex is your platform for growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/search" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
                Find Services
              </Link>
              <Link href="/provider/register" className="btn btn-lg border-2 border-white text-white hover:bg-white/10">
                Become a Provider
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
