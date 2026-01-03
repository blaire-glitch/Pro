import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Western Kenya Coverage Areas with coordinates
const COVERAGE_AREAS = {
  kisumu: {
    name: 'Kisumu',
    latitude: -0.1022,
    longitude: 34.7617,
    areas: ['Milimani', 'Kondele', 'Nyalenda', 'Mamboleo', 'Obunga', 'CBD'],
  },
  kakamega: {
    name: 'Kakamega',
    latitude: 0.2827,
    longitude: 34.7519,
    areas: ['Lurambi', 'Shinyalu', 'Mumias', 'Malava', 'CBD'],
  },
  bungoma: {
    name: 'Bungoma',
    latitude: 0.5635,
    longitude: 34.5606,
    areas: ['Kanduyi', 'Webuye', 'Kimilili', 'Sirisia', 'CBD'],
  },
  busia: {
    name: 'Busia',
    latitude: 0.4608,
    longitude: 34.1108,
    areas: ['Matayos', 'Nambale', 'Budalangi', 'Funyula', 'CBD'],
  },
};

async function main() {
  console.log('Seeding Afrionex database for Western Kenya...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@afrionex.com' },
    update: {},
    create: {
      email: 'admin@afrionex.com',
      phone: '+254700000001',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      city: 'Kisumu',
      country: 'Kenya',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create sample customer in Kisumu
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      phone: '+254700000002',
      password: customerPassword,
      firstName: 'Jane',
      lastName: 'Achieng',
      role: 'CUSTOMER',
      isVerified: true,
      isEmailVerified: true,
      city: 'Kisumu',
      country: 'Kenya',
      latitude: COVERAGE_AREAS.kisumu.latitude,
      longitude: COVERAGE_AREAS.kisumu.longitude,
      loyaltyPoints: {
        create: {
          points: 150,
          lifetimePoints: 150,
          tier: 'BRONZE',
        },
      },
    },
  });
  console.log('Created customer:', customer.email);

  // Create sample providers across Western Kenya coverage areas
  const providerPassword = await bcrypt.hash('provider123', 10);

  // ===== KISUMU PROVIDERS =====
  
  // Beauty Provider - Kisumu
  const beautyUser = await prisma.user.upsert({
    where: { email: 'beautypro@test.com' },
    update: {},
    create: {
      email: 'beautypro@test.com',
      phone: '+254700000003',
      password: providerPassword,
      firstName: 'Mary',
      lastName: 'Wanjiku',
      role: 'PROVIDER',
      isVerified: true,
      city: 'Kisumu',
      country: 'Kenya',
      latitude: -0.0917,
      longitude: 34.7680,
    },
  });

  const beautyProvider = await prisma.provider.upsert({
    where: { userId: beautyUser.id },
    update: {},
    create: {
      userId: beautyUser.id,
      businessName: 'Wanjiku Beauty Studio',
      description: 'Professional hair styling, braiding, and makeup services. Specializing in African hairstyles including dreadlocks, braids, and natural hair care.',
      category: 'BEAUTY',
      subcategories: ['hair', 'makeup', 'nails'],
      isVerified: true,
      verificationStatus: 'VERIFIED',
      rating: 4.8,
      reviewCount: 127,
      shareLink: 'wanjiku-beauty-studio',
      latitude: -0.0917,
      longitude: 34.7680,
      address: 'Milimani, Kisumu',
      city: 'Kisumu',
      country: 'Kenya',
      instantBooking: true,
      gallery: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
      ],
      workingHours: {
        create: [
          { day: 1, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 2, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 3, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 4, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 5, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 6, isOpen: true, openTime: '09:00', closeTime: '18:00' },
          { day: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' },
        ],
      },
      badges: {
        create: [
          { badgeType: 'verified' },
          { badgeType: 'top_rated' },
          { badgeType: 'experienced' },
        ],
      },
    },
  });

  // Create beauty services
  await prisma.service.createMany({
    data: [
      {
        providerId: beautyProvider.id,
        name: 'Box Braids',
        description: 'Beautiful box braids with high-quality extensions. Includes washing and conditioning.',
        category: 'BEAUTY',
        subcategory: 'hair',
        price: 3500,
        currency: 'KES',
        duration: 180,
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e'],
      },
      {
        providerId: beautyProvider.id,
        name: 'Dreadlock Installation',
        description: 'Professional dreadlock installation using the crochet or twist method.',
        category: 'BEAUTY',
        subcategory: 'hair',
        price: 5000,
        currency: 'KES',
        duration: 240,
        images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035'],
      },
      {
        providerId: beautyProvider.id,
        name: 'Bridal Makeup',
        description: 'Complete bridal makeup package including trial session.',
        category: 'BEAUTY',
        subcategory: 'makeup',
        price: 8000,
        currency: 'KES',
        duration: 120,
        images: ['https://images.unsplash.com/photo-1487412912498-0447578fcca8'],
      },
      {
        providerId: beautyProvider.id,
        name: 'Gel Manicure',
        description: 'Long-lasting gel manicure with nail art options.',
        category: 'BEAUTY',
        subcategory: 'nails',
        price: 1500,
        currency: 'KES',
        duration: 60,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371'],
      },
    ],
  });
  console.log('Created beauty provider with services (Kisumu)');

  // Home Services Provider - Kakamega
  const homeUser = await prisma.user.upsert({
    where: { email: 'homepro@test.com' },
    update: {},
    create: {
      email: 'homepro@test.com',
      phone: '+254700000004',
      password: providerPassword,
      firstName: 'John',
      lastName: 'Ochieng',
      role: 'PROVIDER',
      isVerified: true,
      city: 'Kakamega',
      country: 'Kenya',
      latitude: 0.2827,
      longitude: 34.7519,
    },
  });

  const homeProvider = await prisma.provider.upsert({
    where: { userId: homeUser.id },
    update: {},
    create: {
      userId: homeUser.id,
      businessName: 'Ochieng Home Services',
      description: 'Reliable home cleaning and maintenance services. We take care of your home like it\'s ours.',
      category: 'HOME',
      subcategories: ['cleaning', 'plumbing'],
      isVerified: true,
      verificationStatus: 'VERIFIED',
      rating: 4.6,
      reviewCount: 89,
      shareLink: 'ochieng-home-services',
      latitude: 0.2827,
      longitude: 34.7519,
      address: 'Lurambi, Kakamega',
      city: 'Kakamega',
      country: 'Kenya',
      instantBooking: true,
      serviceRadius: 15,
      workingHours: {
        create: [
          { day: 1, isOpen: true, openTime: '07:00', closeTime: '19:00' },
          { day: 2, isOpen: true, openTime: '07:00', closeTime: '19:00' },
          { day: 3, isOpen: true, openTime: '07:00', closeTime: '19:00' },
          { day: 4, isOpen: true, openTime: '07:00', closeTime: '19:00' },
          { day: 5, isOpen: true, openTime: '07:00', closeTime: '19:00' },
          { day: 6, isOpen: true, openTime: '08:00', closeTime: '16:00' },
          { day: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' },
        ],
      },
      badges: {
        create: [
          { badgeType: 'verified' },
          { badgeType: 'fast_responder' },
        ],
      },
    },
  });

  await prisma.service.createMany({
    data: [
      {
        providerId: homeProvider.id,
        name: 'Deep House Cleaning',
        description: 'Thorough cleaning of your entire home including kitchen, bathrooms, and living areas.',
        category: 'HOME',
        subcategory: 'cleaning',
        price: 4500,
        currency: 'KES',
        duration: 240,
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952'],
      },
      {
        providerId: homeProvider.id,
        name: 'Regular Cleaning',
        description: 'Standard cleaning service for maintaining a clean home.',
        category: 'HOME',
        subcategory: 'cleaning',
        price: 2500,
        currency: 'KES',
        duration: 120,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64'],
      },
      {
        providerId: homeProvider.id,
        name: 'Plumbing Repair',
        description: 'Fix leaks, blocked drains, and general plumbing issues.',
        category: 'HOME',
        subcategory: 'plumbing',
        price: 3000,
        currency: 'KES',
        duration: 90,
        images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7'],
      },
    ],
  });
  console.log('Created home services provider (Kakamega)');

  // Wellness Provider - Bungoma
  const wellnessUser = await prisma.user.upsert({
    where: { email: 'wellness@test.com' },
    update: {},
    create: {
      email: 'wellness@test.com',
      phone: '+254700000005',
      password: providerPassword,
      firstName: 'Amina',
      lastName: 'Hassan',
      role: 'PROVIDER',
      isVerified: true,
      city: 'Bungoma',
      country: 'Kenya',
      latitude: 0.5635,
      longitude: 34.5606,
    },
  });

  const wellnessProvider = await prisma.provider.upsert({
    where: { userId: wellnessUser.id },
    update: {},
    create: {
      userId: wellnessUser.id,
      businessName: 'Serenity Wellness Spa',
      description: 'Relaxation and rejuvenation through massage therapy and spa treatments. Certified therapists.',
      category: 'WELLNESS',
      subcategories: ['massage', 'spa'],
      isVerified: true,
      verificationStatus: 'VERIFIED',
      rating: 4.9,
      reviewCount: 203,
      shareLink: 'serenity-wellness-spa',
      latitude: 0.5635,
      longitude: 34.5606,
      address: 'Kanduyi, Bungoma',
      city: 'Bungoma',
      country: 'Kenya',
      instantBooking: false,
      minimumNotice: 120,
      workingHours: {
        create: [
          { day: 1, isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 2, isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 3, isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 4, isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 5, isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 6, isOpen: true, openTime: '10:00', closeTime: '20:00' },
          { day: 0, isOpen: true, openTime: '10:00', closeTime: '18:00' },
        ],
      },
      badges: {
        create: [
          { badgeType: 'verified' },
          { badgeType: 'top_rated' },
        ],
      },
    },
  });

  await prisma.service.createMany({
    data: [
      {
        providerId: wellnessProvider.id,
        name: 'Swedish Massage',
        description: 'Full body relaxation massage using essential oils.',
        category: 'WELLNESS',
        subcategory: 'massage',
        price: 4000,
        currency: 'KES',
        duration: 60,
        images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874'],
      },
      {
        providerId: wellnessProvider.id,
        name: 'Deep Tissue Massage',
        description: 'Therapeutic massage targeting deep muscle layers.',
        category: 'WELLNESS',
        subcategory: 'massage',
        price: 5000,
        currency: 'KES',
        duration: 90,
        images: ['https://images.unsplash.com/photo-1519823551278-64ac92734fb1'],
      },
      {
        providerId: wellnessProvider.id,
        name: 'Spa Day Package',
        description: 'Complete spa experience: massage, facial, manicure, pedicure.',
        category: 'WELLNESS',
        subcategory: 'spa',
        price: 12000,
        currency: 'KES',
        duration: 240,
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef'],
      },
    ],
  });
  console.log('Created wellness provider (Bungoma)');

  // ===== ADDITIONAL PROVIDERS FOR BETTER COVERAGE =====

  // Beauty Provider 2 - Busia
  const beautyUser2 = await prisma.user.upsert({
    where: { email: 'nailspro@test.com' },
    update: {},
    create: {
      email: 'nailspro@test.com',
      phone: '+254700000006',
      password: providerPassword,
      firstName: 'Grace',
      lastName: 'Makena',
      role: 'PROVIDER',
      isVerified: true,
      city: 'Busia',
      country: 'Kenya',
      latitude: 0.4608,
      longitude: 34.1108,
    },
  });

  const beautyProvider2 = await prisma.provider.upsert({
    where: { userId: beautyUser2.id },
    update: {},
    create: {
      userId: beautyUser2.id,
      businessName: 'Makena Nails & Spa',
      description: 'Expert nail care and spa services. Specializing in gel nails, acrylics, and nail art.',
      category: 'BEAUTY',
      subcategories: ['nails', 'spa'],
      isVerified: true,
      verificationStatus: 'VERIFIED',
      rating: 4.7,
      reviewCount: 156,
      shareLink: 'makena-nails-spa',
      latitude: 0.4608,
      longitude: 34.1108,
      address: 'Busia Town, Busia',
      city: 'Busia',
      country: 'Kenya',
      instantBooking: true,
      workingHours: {
        create: [
          { day: 1, isOpen: true, openTime: '09:00', closeTime: '19:00' },
          { day: 2, isOpen: true, openTime: '09:00', closeTime: '19:00' },
          { day: 3, isOpen: true, openTime: '09:00', closeTime: '19:00' },
          { day: 4, isOpen: true, openTime: '09:00', closeTime: '19:00' },
          { day: 5, isOpen: true, openTime: '09:00', closeTime: '19:00' },
          { day: 6, isOpen: true, openTime: '10:00', closeTime: '18:00' },
          { day: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' },
        ],
      },
      badges: {
        create: [
          { badgeType: 'verified' },
          { badgeType: 'fast_responder' },
        ],
      },
    },
  });

  await prisma.service.createMany({
    data: [
      {
        providerId: beautyProvider2.id,
        name: 'Gel Manicure',
        description: 'Long-lasting gel manicure with nail art options.',
        category: 'BEAUTY',
        subcategory: 'nails',
        price: 1500,
        currency: 'KES',
        duration: 60,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371'],
      },
      {
        providerId: beautyProvider2.id,
        name: 'Acrylic Nails',
        description: 'Full set of acrylic nail extensions with design.',
        category: 'BEAUTY',
        subcategory: 'nails',
        price: 3500,
        currency: 'KES',
        duration: 120,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371'],
      },
      {
        providerId: beautyProvider2.id,
        name: 'Luxury Pedicure',
        description: 'Relaxing pedicure with foot massage and scrub.',
        category: 'BEAUTY',
        subcategory: 'nails',
        price: 2000,
        currency: 'KES',
        duration: 90,
        images: ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b'],
      },
    ],
  });
  console.log('Created beauty provider 2 (Busia)');

  // Lifestyle Provider - Kisumu
  const lifestyleUser = await prisma.user.upsert({
    where: { email: 'photography@test.com' },
    update: {},
    create: {
      email: 'photography@test.com',
      phone: '+254700000007',
      password: providerPassword,
      firstName: 'Peter',
      lastName: 'Kimani',
      role: 'PROVIDER',
      isVerified: true,
      city: 'Kisumu',
      country: 'Kenya',
      latitude: -0.1022,
      longitude: 34.7617,
    },
  });

  const lifestyleProvider = await prisma.provider.upsert({
    where: { userId: lifestyleUser.id },
    update: {},
    create: {
      userId: lifestyleUser.id,
      businessName: 'Kimani Photography',
      description: 'Capturing your precious moments. Wedding, event, portrait, and commercial photography.',
      category: 'LIFESTYLE',
      subcategories: ['photography', 'events'],
      isVerified: true,
      verificationStatus: 'VERIFIED',
      rating: 4.9,
      reviewCount: 78,
      shareLink: 'kimani-photography',
      latitude: -0.1022,
      longitude: 34.7617,
      address: 'CBD, Kisumu',
      city: 'Kisumu',
      country: 'Kenya',
      instantBooking: false,
      minimumNotice: 1440, // 24 hours advance booking
      workingHours: {
        create: [
          { day: 1, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 2, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 3, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 4, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 5, isOpen: true, openTime: '08:00', closeTime: '20:00' },
          { day: 6, isOpen: true, openTime: '08:00', closeTime: '22:00' },
          { day: 0, isOpen: true, openTime: '10:00', closeTime: '18:00' },
        ],
      },
      badges: {
        create: [
          { badgeType: 'verified' },
          { badgeType: 'top_rated' },
          { badgeType: 'experienced' },
        ],
      },
    },
  });

  await prisma.service.createMany({
    data: [
      {
        providerId: lifestyleProvider.id,
        name: 'Wedding Photography',
        description: 'Full day wedding coverage with edited photos and album.',
        category: 'LIFESTYLE',
        subcategory: 'photography',
        price: 35000,
        currency: 'KES',
        duration: 480,
        images: ['https://images.unsplash.com/photo-1519741497674-611481863552'],
      },
      {
        providerId: lifestyleProvider.id,
        name: 'Portrait Session',
        description: 'Professional portrait session with 10 edited photos.',
        category: 'LIFESTYLE',
        subcategory: 'photography',
        price: 5000,
        currency: 'KES',
        duration: 60,
        images: ['https://images.unsplash.com/photo-1452587925148-ce544e77e70d'],
      },
      {
        providerId: lifestyleProvider.id,
        name: 'Event Coverage',
        description: 'Corporate events, parties, and special occasions.',
        category: 'LIFESTYLE',
        subcategory: 'events',
        price: 15000,
        currency: 'KES',
        duration: 240,
        images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87'],
      },
    ],
  });
  console.log('Created lifestyle provider (Kisumu)');

  // Fitness Provider - Kakamega
  const fitnessUser = await prisma.user.upsert({
    where: { email: 'fitness@test.com' },
    update: {},
    create: {
      email: 'fitness@test.com',
      phone: '+254700000008',
      password: providerPassword,
      firstName: 'Mike',
      lastName: 'Mwangi',
      role: 'PROVIDER',
      isVerified: true,
      city: 'Kakamega',
      country: 'Kenya',
      latitude: 0.2900,
      longitude: 34.7600,
    },
  });

  const fitnessProvider = await prisma.provider.upsert({
    where: { userId: fitnessUser.id },
    update: {},
    create: {
      userId: fitnessUser.id,
      businessName: 'FitPro Personal Training',
      description: 'Transform your body and mind with certified personal training. Home visits available.',
      category: 'WELLNESS',
      subcategories: ['fitness'],
      isVerified: true,
      verificationStatus: 'VERIFIED',
      rating: 4.8,
      reviewCount: 92,
      shareLink: 'fitpro-personal-training',
      latitude: 0.2900,
      longitude: 34.7600,
      address: 'Shinyalu, Kakamega',
      city: 'Kakamega',
      country: 'Kenya',
      instantBooking: true,
      serviceRadius: 20,
      workingHours: {
        create: [
          { day: 1, isOpen: true, openTime: '05:00', closeTime: '21:00' },
          { day: 2, isOpen: true, openTime: '05:00', closeTime: '21:00' },
          { day: 3, isOpen: true, openTime: '05:00', closeTime: '21:00' },
          { day: 4, isOpen: true, openTime: '05:00', closeTime: '21:00' },
          { day: 5, isOpen: true, openTime: '05:00', closeTime: '21:00' },
          { day: 6, isOpen: true, openTime: '06:00', closeTime: '18:00' },
          { day: 0, isOpen: true, openTime: '07:00', closeTime: '12:00' },
        ],
      },
      badges: {
        create: [
          { badgeType: 'verified' },
          { badgeType: 'fast_responder' },
        ],
      },
    },
  });

  await prisma.service.createMany({
    data: [
      {
        providerId: fitnessProvider.id,
        name: 'Personal Training Session',
        description: 'One-on-one training session tailored to your fitness goals.',
        category: 'WELLNESS',
        subcategory: 'fitness',
        price: 2500,
        currency: 'KES',
        duration: 60,
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'],
      },
      {
        providerId: fitnessProvider.id,
        name: 'Group Fitness Class',
        description: 'High-energy group workout session (4-8 people).',
        category: 'WELLNESS',
        subcategory: 'fitness',
        price: 800,
        currency: 'KES',
        duration: 60,
        images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a'],
      },
      {
        providerId: fitnessProvider.id,
        name: 'Monthly Training Package',
        description: '12 personal training sessions + custom diet plan.',
        category: 'WELLNESS',
        subcategory: 'fitness',
        price: 25000,
        currency: 'KES',
        duration: 60,
        images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48'],
      },
    ],
  });
  console.log('Created fitness provider (Kakamega)');

  // Electrical Services Provider - Bungoma
  const electricalUser = await prisma.user.upsert({
    where: { email: 'electrical@test.com' },
    update: {},
    create: {
      email: 'electrical@test.com',
      phone: '+254700000009',
      password: providerPassword,
      firstName: 'Samuel',
      lastName: 'Wekesa',
      role: 'PROVIDER',
      isVerified: true,
      city: 'Bungoma',
      country: 'Kenya',
      latitude: 0.5700,
      longitude: 34.5650,
    },
  });

  const electricalProvider = await prisma.provider.upsert({
    where: { userId: electricalUser.id },
    update: {},
    create: {
      userId: electricalUser.id,
      businessName: 'Wekesa Electrical Services',
      description: 'Licensed electrician for all your electrical needs. Wiring, repairs, and installations.',
      category: 'HOME',
      subcategories: ['electrical'],
      isVerified: true,
      verificationStatus: 'VERIFIED',
      rating: 4.7,
      reviewCount: 65,
      shareLink: 'wekesa-electrical',
      latitude: 0.5700,
      longitude: 34.5650,
      address: 'Webuye, Bungoma',
      city: 'Bungoma',
      country: 'Kenya',
      instantBooking: true,
      serviceRadius: 25,
      workingHours: {
        create: [
          { day: 1, isOpen: true, openTime: '07:00', closeTime: '18:00' },
          { day: 2, isOpen: true, openTime: '07:00', closeTime: '18:00' },
          { day: 3, isOpen: true, openTime: '07:00', closeTime: '18:00' },
          { day: 4, isOpen: true, openTime: '07:00', closeTime: '18:00' },
          { day: 5, isOpen: true, openTime: '07:00', closeTime: '18:00' },
          { day: 6, isOpen: true, openTime: '08:00', closeTime: '15:00' },
          { day: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' },
        ],
      },
      badges: {
        create: [
          { badgeType: 'verified' },
          { badgeType: 'experienced' },
        ],
      },
    },
  });

  await prisma.service.createMany({
    data: [
      {
        providerId: electricalProvider.id,
        name: 'Electrical Repair',
        description: 'Diagnose and fix electrical issues in your home or office.',
        category: 'HOME',
        subcategory: 'electrical',
        price: 2000,
        currency: 'KES',
        duration: 60,
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e'],
      },
      {
        providerId: electricalProvider.id,
        name: 'House Wiring',
        description: 'Complete electrical wiring for new constructions or renovations.',
        category: 'HOME',
        subcategory: 'electrical',
        price: 15000,
        currency: 'KES',
        duration: 480,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64'],
      },
      {
        providerId: electricalProvider.id,
        name: 'Solar Installation',
        description: 'Solar panel installation and setup for homes and businesses.',
        category: 'HOME',
        subcategory: 'electrical',
        price: 25000,
        currency: 'KES',
        duration: 300,
        images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276'],
      },
    ],
  });
  console.log('Created electrical provider (Bungoma)');

  // Create subscription packages
  await prisma.subscriptionPackage.createMany({
    data: [
      {
        name: 'Weekly Home Cleaning',
        description: 'Get your home cleaned every week at a discounted rate.',
        category: 'HOME',
        frequency: 'WEEKLY',
        price: 8000,
        currency: 'KES',
        discountPercent: 20,
      },
      {
        name: 'Monthly Grooming Package',
        description: 'Monthly haircut, manicure, and pedicure package.',
        category: 'BEAUTY',
        frequency: 'MONTHLY',
        price: 5000,
        currency: 'KES',
        discountPercent: 15,
      },
      {
        name: 'Bi-Weekly Massage',
        description: 'Relaxing massage twice a month to keep stress at bay.',
        category: 'WELLNESS',
        frequency: 'BIWEEKLY',
        price: 7000,
        currency: 'KES',
        discountPercent: 10,
      },
    ],
  });
  console.log('Created subscription packages');

  // Create rewards
  await prisma.reward.createMany({
    data: [
      {
        name: '10% Off Next Booking',
        description: 'Get 10% discount on your next service booking.',
        pointsCost: 100,
        type: 'DISCOUNT',
        value: 10,
      },
      {
        name: 'Free Manicure',
        description: 'Redeem for a free gel manicure at any beauty provider.',
        pointsCost: 500,
        type: 'FREE_SERVICE',
        value: 1500,
      },
      {
        name: 'KSh 500 Cashback',
        description: 'Get KSh 500 credited to your wallet.',
        pointsCost: 300,
        type: 'CASHBACK',
        value: 500,
      },
    ],
  });
  console.log('Created rewards');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

