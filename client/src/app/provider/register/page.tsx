'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  HiUser, HiMail, HiPhone, HiLockClosed, HiEye, HiEyeOff,
  HiBriefcase, HiLocationMarker, HiCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Logo from '@/components/ui/Logo';

const categories = [
  { id: 'beauty', name: 'Beauty', icon: 'beauty', description: 'Hair, makeup, nails, barbering' },
  { id: 'home', name: 'Home Services', icon: 'home', description: 'Cleaning, plumbing, electrical' },
  { id: 'wellness', name: 'Wellness', icon: 'wellness', description: 'Massage, spa, fitness' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'lifestyle', description: 'Tutoring, events, photography' },
];

const providerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().min(2, 'Please enter your location'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProviderFormData = z.infer<typeof providerSchema>;

export default function ProviderRegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: ProviderFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Registration successful! Welcome to Afrionex.');
      router.push('/provider/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-500 via-secondary-400 to-primary-500 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center justify-center mb-8">
          <Logo size="xl" />
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Steps */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    s < step ? 'bg-green-500 text-white' :
                    s === step ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s < step ? <HiCheck className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-20 md:w-32 h-1 mx-2 ${
                      s < step ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Personal Info</span>
              <span>Business Info</span>
              <span>Security</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Become a Provider</h2>
                  <p className="text-gray-600 mt-1">Join thousands of professionals earning on Afrionex</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input {...register('firstName')} className="input pl-10" placeholder="John" />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input {...register('lastName')} className="input" placeholder="Doe" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input {...register('email')} type="email" className="input pl-10" placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input {...register('phone')} type="tel" className="input pl-10" placeholder="+254 7XX XXX XXX" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <button type="button" onClick={() => setStep(2)} className="w-full btn-primary btn-lg">
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Business Details</h2>
                  <p className="text-gray-600 mt-1">Tell us about your services</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <div className="relative">
                    <HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input {...register('businessName')} className="input pl-10" placeholder="Your Business Name" />
                  </div>
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Service Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedCategory === cat.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('category')}
                          value={cat.id}
                          className="sr-only"
                        />
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{cat.name}</p>
                          <p className="text-xs text-gray-500">{cat.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input {...register('location')} className="input pl-10" placeholder="e.g., Westlands, Nairobi" />
                  </div>
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 btn-outline btn-lg">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 btn-primary btn-lg">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Secure Your Account</h2>
                  <p className="text-gray-600 mt-1">Create a strong password</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="input pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <HiEyeOff className="w-5 h-5 text-gray-400" /> : <HiEye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className="input pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    {...register('acceptTerms')}
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                  </label>
                </div>
                {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 btn-outline btn-lg">
                    Back
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 btn-primary btn-lg disabled:opacity-50">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
