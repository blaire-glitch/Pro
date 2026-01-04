// AI Recommendation Engine for Afrionex
// Uses collaborative filtering and content-based recommendations

export interface ServiceData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  rating: number;
  location: string;
  tags: string[];
}

export interface AdData {
  id: string;
  title: string;
  description: string;
  image: string;
  targetCategories: string[];
  targetPriceRange: { min: number; max: number };
  targetLocations: string[];
  cta: string;
  link: string;
  priority: number;
  sponsor: string;
}

export interface UserProfile {
  viewedCategories: Record<string, number>;
  searchHistory: string[];
  bookingHistory: string[];
  location: string;
  priceRange: { min: number; max: number };
  topCategories: string[];
  interestScore: Record<string, number>;
  pricePreference: 'budget' | 'mid-range' | 'premium';
}

// Mock services database (in production, this comes from backend)
export const servicesDatabase: ServiceData[] = [
  // Beauty
  { id: 's1', name: 'Professional Hair Braiding', category: 'beauty', subcategory: 'hair', price: 1500, rating: 4.8, location: 'Kisumu', tags: ['braids', 'hair', 'styling', 'women'] },
  { id: 's2', name: 'Men\'s Premium Haircut', category: 'beauty', subcategory: 'barbering', price: 500, rating: 4.9, location: 'Kisumu', tags: ['haircut', 'barber', 'men', 'grooming'] },
  { id: 's3', name: 'Full Makeup Session', category: 'beauty', subcategory: 'makeup', price: 3000, rating: 4.7, location: 'Kisumu', tags: ['makeup', 'bridal', 'events', 'women'] },
  { id: 's4', name: 'Gel Manicure & Pedicure', category: 'beauty', subcategory: 'nails', price: 2000, rating: 4.6, location: 'Kisumu', tags: ['nails', 'manicure', 'pedicure', 'beauty'] },
  { id: 's5', name: 'Relaxer Treatment', category: 'beauty', subcategory: 'hair', price: 2500, rating: 4.5, location: 'Busia', tags: ['relaxer', 'hair', 'treatment', 'women'] },
  
  // Home Services
  { id: 's6', name: 'Deep House Cleaning', category: 'home', subcategory: 'cleaning', price: 3500, rating: 4.8, location: 'Kisumu', tags: ['cleaning', 'house', 'deep clean', 'home'] },
  { id: 's7', name: 'Plumbing Repair', category: 'home', subcategory: 'plumbing', price: 1500, rating: 4.6, location: 'Kisumu', tags: ['plumbing', 'repair', 'pipes', 'home'] },
  { id: 's8', name: 'Electrical Installation', category: 'home', subcategory: 'electrical', price: 2500, rating: 4.7, location: 'Kisumu', tags: ['electrical', 'wiring', 'installation', 'home'] },
  { id: 's9', name: 'Furniture Assembly', category: 'home', subcategory: 'carpentry', price: 1000, rating: 4.5, location: 'Kakamega', tags: ['furniture', 'assembly', 'carpentry', 'home'] },
  { id: 's10', name: 'House Painting', category: 'home', subcategory: 'painting', price: 5000, rating: 4.8, location: 'Kisumu', tags: ['painting', 'house', 'interior', 'home'] },
  
  // Wellness
  { id: 's11', name: 'Full Body Massage', category: 'wellness', subcategory: 'massage', price: 2500, rating: 4.9, location: 'Kisumu', tags: ['massage', 'relaxation', 'spa', 'wellness'] },
  { id: 's12', name: 'Personal Training Session', category: 'wellness', subcategory: 'fitness', price: 1500, rating: 4.7, location: 'Kisumu', tags: ['fitness', 'gym', 'training', 'health'] },
  { id: 's13', name: 'Yoga Class', category: 'wellness', subcategory: 'yoga', price: 800, rating: 4.6, location: 'Kisumu', tags: ['yoga', 'meditation', 'wellness', 'fitness'] },
  { id: 's14', name: 'Nutrition Consultation', category: 'wellness', subcategory: 'nutrition', price: 2000, rating: 4.5, location: 'Kisumu', tags: ['nutrition', 'diet', 'health', 'consultation'] },
  
  // Lifestyle
  { id: 's15', name: 'Private Tutoring', category: 'lifestyle', subcategory: 'tutors', price: 1000, rating: 4.8, location: 'Kisumu', tags: ['tutoring', 'education', 'learning', 'academic'] },
  { id: 's16', name: 'Event Planning', category: 'lifestyle', subcategory: 'events', price: 15000, rating: 4.9, location: 'Kisumu', tags: ['events', 'planning', 'party', 'wedding'] },
  { id: 's17', name: 'Professional Photography', category: 'lifestyle', subcategory: 'photography', price: 5000, rating: 4.8, location: 'Kisumu', tags: ['photography', 'photos', 'events', 'portrait'] },
  { id: 's18', name: 'DJ Services', category: 'lifestyle', subcategory: 'dj', price: 8000, rating: 4.7, location: 'Kisumu', tags: ['dj', 'music', 'events', 'party'] },
  
  // Food
  { id: 's19', name: 'Catering Service', category: 'food', subcategory: 'catering', price: 10000, rating: 4.8, location: 'Kisumu', tags: ['catering', 'food', 'events', 'cooking'] },
  { id: 's20', name: 'Private Chef', category: 'food', subcategory: 'chef', price: 5000, rating: 4.9, location: 'Kisumu', tags: ['chef', 'cooking', 'food', 'home'] },
];

// Mock ads database
export const adsDatabase: AdData[] = [
  {
    id: 'ad1',
    title: 'Get 20% Off Hair Services',
    description: 'First-time customers enjoy exclusive discounts on all hair services',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    targetCategories: ['beauty', 'hair'],
    targetPriceRange: { min: 0, max: 5000 },
    targetLocations: ['Kisumu', 'Kakamega'],
    cta: 'Book Now',
    link: '/search?category=beauty&subcategory=hair',
    priority: 10,
    sponsor: 'Glamour Salon Kisumu',
  },
  {
    id: 'ad2',
    title: 'Home Deep Cleaning Special',
    description: 'Professional cleaning services starting from KES 2,500. Book today!',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    targetCategories: ['home', 'cleaning'],
    targetPriceRange: { min: 0, max: 10000 },
    targetLocations: ['Kisumu', 'Busia', 'Kakamega'],
    cta: 'Get Quote',
    link: '/search?category=home&subcategory=cleaning',
    priority: 8,
    sponsor: 'CleanPro Kenya',
  },
  {
    id: 'ad3',
    title: 'Relax with a Massage',
    description: 'Treat yourself to a relaxing full body massage. Special weekend rates!',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    targetCategories: ['wellness', 'massage', 'spa'],
    targetPriceRange: { min: 1000, max: 5000 },
    targetLocations: ['Kisumu'],
    cta: 'Book Session',
    link: '/search?category=wellness&subcategory=massage',
    priority: 9,
    sponsor: 'Zen Spa Kisumu',
  },
  {
    id: 'ad4',
    title: 'Event Photography Packages',
    description: 'Capture your special moments. Wedding & event packages available.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
    targetCategories: ['lifestyle', 'photography', 'events'],
    targetPriceRange: { min: 3000, max: 20000 },
    targetLocations: ['Kisumu', 'Kakamega', 'Busia'],
    cta: 'View Packages',
    link: '/search?category=lifestyle&subcategory=photography',
    priority: 7,
    sponsor: 'Lens Master Studios',
  },
  {
    id: 'ad5',
    title: 'Personal Training Offer',
    description: 'Get fit with certified trainers. First session FREE!',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    targetCategories: ['wellness', 'fitness'],
    targetPriceRange: { min: 500, max: 3000 },
    targetLocations: ['Kisumu'],
    cta: 'Start Free',
    link: '/search?category=wellness&subcategory=fitness',
    priority: 8,
    sponsor: 'FitZone Gym',
  },
  {
    id: 'ad6',
    title: 'Catering for All Events',
    description: 'From weddings to corporate events. Quality food, great prices.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400',
    targetCategories: ['food', 'catering', 'events'],
    targetPriceRange: { min: 5000, max: 50000 },
    targetLocations: ['Kisumu', 'Kakamega', 'Busia'],
    cta: 'Get Menu',
    link: '/search?category=food&subcategory=catering',
    priority: 7,
    sponsor: 'Taste of Nyanza Catering',
  },
  {
    id: 'ad7',
    title: 'Men\'s Grooming Special',
    description: 'Premium haircuts, beard trims & hot towel shaves. Look your best!',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    targetCategories: ['beauty', 'barbering'],
    targetPriceRange: { min: 200, max: 2000 },
    targetLocations: ['Kisumu'],
    cta: 'Book Appointment',
    link: '/search?category=beauty&subcategory=barbering',
    priority: 8,
    sponsor: 'Classic Cuts Barbershop',
  },
  {
    id: 'ad8',
    title: 'Electrical Services 24/7',
    description: 'Licensed electricians. Installations, repairs & emergencies.',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400',
    targetCategories: ['home', 'electrical'],
    targetPriceRange: { min: 1000, max: 15000 },
    targetLocations: ['Kisumu', 'Kakamega'],
    cta: 'Call Now',
    link: '/search?category=home&subcategory=electrical',
    priority: 6,
    sponsor: 'PowerFix Electricals',
  },
];

// AI Recommendation Engine Class
export class AIRecommendationEngine {
  private userProfile: UserProfile;

  constructor(userProfile: UserProfile) {
    this.userProfile = userProfile;
  }

  // Calculate similarity score between user interests and item
  private calculateSimilarity(item: ServiceData | AdData, weights: Record<string, number>): number {
    let score = 0;
    
    // Category match
    if ('category' in item) {
      const categoryScore = weights[item.category] || 0;
      score += categoryScore * 2;
      
      // Subcategory match (more specific = higher score)
      if ('subcategory' in item && weights[item.subcategory]) {
        score += weights[item.subcategory] * 3;
      }
    }
    
    // Target categories match for ads
    if ('targetCategories' in item) {
      item.targetCategories.forEach((cat) => {
        if (weights[cat]) {
          score += weights[cat] * 1.5;
        }
      });
    }
    
    return score;
  }

  // Collaborative filtering simulation (based on similar users' behavior)
  private collaborativeScore(item: ServiceData): number {
    // In production, this would query similar users from backend
    // Simulating based on rating and popularity
    return item.rating * 2;
  }

  // Content-based filtering
  private contentBasedScore(item: ServiceData): number {
    let score = 0;
    
    // Tag matching with search history
    item.tags.forEach((tag) => {
      this.userProfile.searchHistory.forEach((query) => {
        if (query.toLowerCase().includes(tag.toLowerCase())) {
          score += 5;
        }
      });
    });
    
    // Location preference
    if (item.location === this.userProfile.location) {
      score += 10;
    }
    
    // Price range preference
    const { min, max } = this.userProfile.priceRange;
    if (item.price >= min && item.price <= max) {
      score += 8;
    }
    
    // Price preference alignment
    if (this.userProfile.pricePreference === 'budget' && item.price < 1500) {
      score += 5;
    } else if (this.userProfile.pricePreference === 'premium' && item.price > 3000) {
      score += 5;
    } else if (this.userProfile.pricePreference === 'mid-range' && item.price >= 1500 && item.price <= 3000) {
      score += 5;
    }
    
    return score;
  }

  // Get personalized service recommendations
  getRecommendedServices(limit: number = 6): ServiceData[] {
    const scoredServices = servicesDatabase.map((service) => {
      const similarityScore = this.calculateSimilarity(service, this.userProfile.interestScore);
      const collaborativeScore = this.collaborativeScore(service);
      const contentScore = this.contentBasedScore(service);
      
      // Weighted combination
      const totalScore = (similarityScore * 0.4) + (collaborativeScore * 0.3) + (contentScore * 0.3);
      
      return { service, score: totalScore };
    });

    // Sort by score and return top recommendations
    return scoredServices
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.service);
  }

  // Get personalized ads
  getPersonalizedAds(limit: number = 3): AdData[] {
    const scoredAds = adsDatabase.map((ad) => {
      let score = ad.priority;
      
      // Category relevance
      ad.targetCategories.forEach((cat) => {
        if (this.userProfile.topCategories.includes(cat)) {
          score += 15;
        }
        if (this.userProfile.interestScore[cat]) {
          score += this.userProfile.interestScore[cat] * 0.5;
        }
      });
      
      // Location match
      if (ad.targetLocations.includes(this.userProfile.location)) {
        score += 10;
      }
      
      // Price range alignment
      const userMaxPrice = this.userProfile.priceRange.max;
      if (userMaxPrice >= ad.targetPriceRange.min && userMaxPrice <= ad.targetPriceRange.max * 1.5) {
        score += 8;
      }
      
      return { ad, score };
    });

    return scoredAds
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.ad);
  }

  // Get related services based on a specific service
  getRelatedServices(serviceId: string, limit: number = 4): ServiceData[] {
    const currentService = servicesDatabase.find((s) => s.id === serviceId);
    if (!currentService) return [];

    const scoredServices = servicesDatabase
      .filter((s) => s.id !== serviceId)
      .map((service) => {
        let score = 0;
        
        // Same category
        if (service.category === currentService.category) {
          score += 20;
        }
        
        // Same subcategory
        if (service.subcategory === currentService.subcategory) {
          score += 30;
        }
        
        // Similar price range (within 50%)
        const priceDiff = Math.abs(service.price - currentService.price) / currentService.price;
        if (priceDiff < 0.5) {
          score += 10 * (1 - priceDiff);
        }
        
        // Same location
        if (service.location === currentService.location) {
          score += 15;
        }
        
        // Tag overlap
        const commonTags = service.tags.filter((tag) => currentService.tags.includes(tag));
        score += commonTags.length * 5;
        
        return { service, score };
      });

    return scoredServices
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.service);
  }

  // Get trending services (simulated with ratings and bookings)
  getTrendingServices(limit: number = 4): ServiceData[] {
    return [...servicesDatabase]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Generate personalized message
  getPersonalizedMessage(): string {
    const { topCategories, pricePreference } = this.userProfile;
    
    if (topCategories.length === 0) {
      return 'Discover amazing services in your area!';
    }
    
    const topCategory = topCategories[0];
    const messages: Record<string, string> = {
      beauty: 'Looking fabulous? Check out our top beauty services!',
      home: 'Keep your home in perfect shape with our trusted providers.',
      wellness: 'Time for self-care? Explore our wellness services.',
      lifestyle: 'Make life easier with our lifestyle services.',
      food: 'Hungry? Explore delicious catering and chef services.',
      transport: 'Going somewhere? Book your ride now!',
    };
    
    return messages[topCategory] || `Explore top ${topCategory} services near you!`;
  }
}

// Utility function to create engine from store state
export function createRecommendationEngine(
  behavior: UserProfile['viewedCategories'] extends Record<string, number> ? {
    viewedCategories: Record<string, number>;
    searchHistory: string[];
    bookingHistory: string[];
    location: string;
    priceRange: { min: number; max: number };
  } : never,
  preferences: {
    topCategories: string[];
    interestScore: Record<string, number>;
    pricePreference: 'budget' | 'mid-range' | 'premium';
  }
): AIRecommendationEngine {
  return new AIRecommendationEngine({
    viewedCategories: behavior.viewedCategories,
    searchHistory: behavior.searchHistory,
    bookingHistory: behavior.bookingHistory,
    location: behavior.location,
    priceRange: behavior.priceRange,
    topCategories: preferences.topCategories,
    interestScore: preferences.interestScore,
    pricePreference: preferences.pricePreference,
  });
}
