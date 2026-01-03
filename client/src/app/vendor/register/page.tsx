'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HiShoppingBag, HiCurrencyDollar, HiChartBar, HiGlobeAlt, 
  HiCheck, HiArrowRight, HiPhotograph, HiLocationMarker 
} from 'react-icons/hi';

const benefits = [
  {
    icon: HiGlobeAlt,
    title: 'Reach More Customers',
    description: 'Access thousands of buyers across Western Kenya'
  },
  {
    icon: HiCurrencyDollar,
    title: 'Easy Payments',
    description: 'Get paid via M-Pesa, Airtel Money, or bank transfer'
  },
  {
    icon: HiChartBar,
    title: 'Analytics Dashboard',
    description: 'Track your sales, orders, and customer insights'
  },
  {
    icon: HiShoppingBag,
    title: 'Easy Management',
    description: 'Manage your products and orders from one dashboard'
  },
];

const categories = [
  'Electronics', 'Fashion', 'Home & Garden', 'Health & Beauty',
  'Food & Beverages', 'Sports & Outdoors', 'Automotive', 'Other'
];

const cities = ['Kisumu', 'Kakamega', 'Bungoma', 'Busia'];

export default function VendorRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Business Info
    shopName: '',
    description: '',
    category: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    // Documents
    businessLicense: null as File | null,
    idDocument: null as File | null,
    // Terms
    acceptTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to vendor dashboard
    router.push('/vendor/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Selling on Afrionex</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of vendors reaching customers across Western Kenya. 
              Set up your shop in minutes and start selling today.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center p-6">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > s ? <HiCheck className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`w-20 h-1 mx-2 ${
                        step > s ? 'bg-primary-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Business Info */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Business Information</h2>
                        <p className="text-gray-500">Tell us about your business</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shop Name *
                        </label>
                        <input
                          type="text"
                          name="shopName"
                          value={formData.shopName}
                          onChange={handleInputChange}
                          placeholder="e.g., Tech Hub Kisumu"
                          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe what your shop sells..."
                          rows={3}
                          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                            required
                          >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                            required
                          >
                            <option value="">Select city</option>
                            {cities.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <HiLocationMarker className="inline w-4 h-4 mr-1" />
                          Business Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="e.g., Oginga Odinga Street, Kisumu"
                          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 flex items-center justify-center gap-2"
                      >
                        Continue
                        <HiArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Step 2: Contact & Documents */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Contact & Documents</h2>
                        <p className="text-gray-500">How can customers reach you?</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+254 7XX XXX XXX"
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="shop@example.com"
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <HiPhotograph className="inline w-4 h-4 mr-1" />
                          Business License (Optional)
                        </label>
                        <div className="border-2 border-dashed rounded-xl p-6 text-center">
                          <input
                            type="file"
                            name="businessLicense"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="businessLicense"
                          />
                          <label
                            htmlFor="businessLicense"
                            className="cursor-pointer text-gray-600 hover:text-primary-500"
                          >
                            {formData.businessLicense ? (
                              <span className="text-green-600 flex items-center justify-center gap-2">
                                <HiCheck className="w-5 h-5" />
                                {formData.businessLicense.name}
                              </span>
                            ) : (
                              <>
                                <HiPhotograph className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Click to upload business license</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <HiPhotograph className="inline w-4 h-4 mr-1" />
                          ID Document *
                        </label>
                        <div className="border-2 border-dashed rounded-xl p-6 text-center">
                          <input
                            type="file"
                            name="idDocument"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="idDocument"
                            required
                          />
                          <label
                            htmlFor="idDocument"
                            className="cursor-pointer text-gray-600 hover:text-primary-500"
                          >
                            {formData.idDocument ? (
                              <span className="text-green-600 flex items-center justify-center gap-2">
                                <HiCheck className="w-5 h-5" />
                                {formData.idDocument.name}
                              </span>
                            ) : (
                              <>
                                <HiPhotograph className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Click to upload National ID or Passport</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 flex items-center justify-center gap-2"
                        >
                          Continue
                          <HiArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Review & Submit</h2>
                        <p className="text-gray-500">Confirm your details</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shop Name</span>
                          <span className="font-medium">{formData.shopName || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category</span>
                          <span className="font-medium">{formData.category || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Location</span>
                          <span className="font-medium">{formData.city || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone</span>
                          <span className="font-medium">{formData.phone || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email</span>
                          <span className="font-medium">{formData.email || '-'}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          required
                        />
                        <label className="text-sm text-gray-600">
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary-600 hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-primary-600 hover:underline">
                            Seller Agreement
                          </Link>
                          . I confirm that all information provided is accurate.
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={!formData.acceptTerms || isLoading}
                          className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Creating Shop...
                            </>
                          ) : (
                            <>
                              <HiShoppingBag className="w-5 h-5" />
                              Create My Shop
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Login Link */}
              <p className="text-center mt-6 text-gray-600">
                Already have a shop?{' '}
                <Link href="/vendor/dashboard" className="text-primary-600 hover:underline font-medium">
                  Go to Dashboard
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
