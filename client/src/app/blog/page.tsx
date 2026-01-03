'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HiCalendar, HiUser, HiArrowRight } from 'react-icons/hi';

const blogPosts = [
  {
    id: 1,
    title: 'Afrionex Launches in Busia: Bringing Services to the Border',
    excerpt: 'We\'re excited to announce our expansion to Busia, connecting thousands of residents with local service providers.',
    image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800',
    author: 'James Ochieng',
    date: 'Dec 28, 2025',
    category: 'Company News',
  },
  {
    id: 2,
    title: 'How M-Pesa Integration is Transforming Local Businesses',
    excerpt: 'Discover how seamless mobile money payments are helping service providers grow their businesses on Afrionex.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    author: 'Grace Wanjiku',
    date: 'Dec 20, 2025',
    category: 'Technology',
  },
  {
    id: 3,
    title: 'Top 10 Beauty Services in Kisumu This Holiday Season',
    excerpt: 'From braids to makeup, here are the most booked beauty services as we head into the festive season.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    author: 'Amina Hassan',
    date: 'Dec 15, 2025',
    category: 'Lifestyle',
  },
  {
    id: 4,
    title: 'Provider Spotlight: Wanjiku Beauty Studio\'s Success Story',
    excerpt: 'Meet Mary Wanjiku, whose salon business grew 300% after joining Afrionex. Here\'s her inspiring journey.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    author: 'David Kimani',
    date: 'Dec 10, 2025',
    category: 'Success Stories',
  },
  {
    id: 5,
    title: 'The Future of Delivery Services in Western Kenya',
    excerpt: 'How Afrionex is revolutionizing last-mile delivery from packages to food across the region.',
    image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800',
    author: 'James Ochieng',
    date: 'Dec 5, 2025',
    category: 'Industry',
  },
  {
    id: 6,
    title: 'Safety First: How We Verify Every Service Provider',
    excerpt: 'Learn about our rigorous verification process that ensures every provider on our platform is trustworthy.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    author: 'Grace Wanjiku',
    date: 'Nov 28, 2025',
    category: 'Trust & Safety',
  },
];

const categories = ['All', 'Company News', 'Technology', 'Lifestyle', 'Success Stories', 'Industry', 'Trust & Safety'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-500 to-secondary-500 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Afrionex Blog
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Stories, updates, and insights from Africa's next-generation super app.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    category === 'All' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-4 left-4 bg-primary-500 text-white text-xs px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <HiUser className="w-4 h-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiCalendar className="w-4 h-4" />
                          {post.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="btn-outline flex items-center gap-2 mx-auto">
                Load More Articles
                <HiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mb-6">
                Get the latest updates, tips, and stories delivered to your inbox.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input flex-1"
                />
                <button type="submit" className="btn-primary">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
