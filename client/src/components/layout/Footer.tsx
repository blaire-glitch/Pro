import Link from 'next/link';
import { HiMail, HiPhone, HiLocationMarker, HiHeart } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              The next-generation super app for Africa. One platform, one wallet, one seamless experience.
            </p>
            <p className="text-xs text-primary-400 mb-4">
              Now live in Kisumu, Kakamega, Bungoma and Busia
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="TikTok" className="text-gray-400 hover:text-white transition-colors">
                <FaTiktok className="w-5 h-5" />
              </a>
              <a href="#" aria-label="WhatsApp" className="text-gray-400 hover:text-white transition-colors">
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search?category=beauty" className="hover:text-white transition-colors">Beauty Services</Link></li>
              <li><Link href="/search?category=home" className="hover:text-white transition-colors">Home Services</Link></li>
              <li><Link href="/search?category=wellness" className="hover:text-white transition-colors">Wellness</Link></li>
              <li><Link href="/search?category=delivery" className="hover:text-white transition-colors">Delivery</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">All Services</Link></li>
            </ul>
          </div>

          {/* Super App */}
          <div>
            <h4 className="font-semibold text-white mb-4">Super App</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/afripass" className="hover:text-white transition-colors">AfriPass Subscription</Link></li>
              <li><Link href="/dashboard/rewards" className="hover:text-white transition-colors">Rewards and Points</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Browse Services</Link></li>
              <li><Link href="/vendor/register" className="hover:text-white transition-colors">Sell on Afrionex</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/provider/register" className="hover:text-white transition-colors">Become a Provider</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-8 py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="mailto:support@afrionex.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <HiMail className="w-4 h-4 text-primary-400" />
                support@afrionex.com
              </a>
              <a href="tel:+254700000000" className="flex items-center gap-2 hover:text-white transition-colors">
                <HiPhone className="w-4 h-4 text-primary-400" />
                +254 700 000 000
              </a>
              <span className="flex items-center gap-2">
                <HiLocationMarker className="w-4 h-4 text-primary-400" />
                Kisumu, Kenya
              </span>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} Afrionex. All rights reserved. Made with 
            <HiHeart className="w-4 h-4 text-red-500" /> 
            in Kenya
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
