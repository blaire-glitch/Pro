'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  HiUser, HiMail, HiPhone, HiLockClosed, HiEye, HiEyeOff,
  HiBriefcase, HiLocationMarker, HiCheck, HiUpload, HiDocumentText,
  HiIdentification, HiPhotograph, HiShieldCheck, HiInformationCircle,
  HiX, HiCheckCircle, HiClock
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Logo from '@/components/ui/Logo';

const categories = [
  { id: 'beauty', name: 'Beauty', icon: '💇', description: 'Hair, makeup, nails, barbering' },
  { id: 'home', name: 'Home Services', icon: '🏠', description: 'Cleaning, plumbing, electrical' },
  { id: 'wellness', name: 'Wellness', icon: '💆', description: 'Massage, spa, fitness' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '📸', description: 'Tutoring, events, photography' },
  { id: 'transport', name: 'Transport', icon: '🚗', description: 'Boda, taxi, delivery' },
  { id: 'food', name: 'Food & Catering', icon: '🍳', description: 'Cooking, catering, baking' },
];

const locations = ['Kisumu', 'Kakamega', 'Bungoma', 'Busia'];

const providerSchema = z.object({
  providerType: z.enum(['individual', 'business']),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  businessName: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().min(1, 'Please select your location'),
  bio: z.string().min(20, 'Please describe your services (min 20 characters)').max(500, 'Bio too long'),
  experience: z.string().min(1, 'Please select your experience'),
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

interface UploadedDocument {
  id: string;
  name: string;
  type: 'id_front' | 'id_back' | 'selfie' | 'certificate';
  file: File;
  preview: string;
  status: 'pending' | 'uploaded';
}

export default function ProviderRegisterPage() {
  const [step, setStep] = useState(1);
  const [providerType, setProviderType] = useState<'individual' | 'business' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      providerType: 'individual',
    }
  });

  const selectedCategory = watch('category');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: UploadedDocument['type']) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newDoc: UploadedDocument = {
        id: `${docType}-${Date.now()}`,
        name: file.name,
        type: docType,
        file,
        preview: reader.result as string,
        status: 'uploaded',
      };

      setDocuments(prev => {
        const filtered = prev.filter(d => d.type !== docType);
        return [...filtered, newDoc];
      });
      toast.success(`${getDocumentLabel(docType)} uploaded successfully`);
    };
    reader.readAsDataURL(file);
  };

  const getDocumentLabel = (type: UploadedDocument['type']) => {
    switch (type) {
      case 'id_front': return 'ID Card (Front)';
      case 'id_back': return 'ID Card (Back)';
      case 'selfie': return 'Selfie with ID';
      case 'certificate': return 'Certificate/License';
      default: return 'Document';
    }
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const requiredDocs: UploadedDocument['type'][] = providerType === 'individual' 
    ? ['id_front', 'id_back', 'selfie'] 
    : ['id_front', 'certificate'];

  const hasAllRequiredDocs = requiredDocs.every(type => 
    documents.some(d => d.type === type)
  );

  const onSubmit = async (data: ProviderFormData) => {
    if (step === 4 && providerType === 'individual' && !hasAllRequiredDocs) {
      toast.error('Please upload all required documents');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(
        providerType === 'individual'
          ? 'Application submitted! We will verify your documents within 24-48 hours.'
          : 'Registration successful! Welcome to Afrionex.'
      );
      router.push('/provider/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = providerType === 'individual' ? 5 : 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-500 via-secondary-400 to-primary-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center justify-center mb-6">
          <Logo size="xl" />
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Steps */}
          {step > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-center">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      s < step ? 'bg-green-500 text-white' :
                      s === step ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {s < step ? <HiCheck className="w-5 h-5" /> : s}
                    </div>
                    {s < totalSteps && (
                      <div className={`w-8 md:w-16 h-1 mx-1 ${
                        s < step ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            {/* Step 1: Choose Provider Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Become a Service Provider</h2>
                  <p className="text-gray-600 mt-2">Join thousands of professionals earning on Afrionex</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Individual Provider */}
                  <button
                    type="button"
                    onClick={() => {
                      setProviderType('individual');
                      setValue('providerType', 'individual');
                      setStep(2);
                    }}
                    className={`p-6 border-2 rounded-2xl text-left transition-all hover:border-primary-500 hover:shadow-lg ${
                      providerType === 'individual' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                      <HiUser className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Individual Provider</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Offer your personal skills and services. Perfect for freelancers, artisans, and skilled individuals.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheckCircle className="w-4 h-4 text-green-500" />
                        <span>No business registration needed</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheckCircle className="w-4 h-4 text-green-500" />
                        <span>Just need valid ID for verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheckCircle className="w-4 h-4 text-green-500" />
                        <span>Start earning within 24-48 hours</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-primary-600 font-medium">
                      <span>Get Started</span>
                      <HiCheck className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Business Provider */}
                  <button
                    type="button"
                    onClick={() => {
                      setProviderType('business');
                      setValue('providerType', 'business');
                      setStep(2);
                    }}
                    className={`p-6 border-2 rounded-2xl text-left transition-all hover:border-primary-500 hover:shadow-lg ${
                      providerType === 'business' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                      <HiBriefcase className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Business Provider</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Register your established business. Ideal for salons, agencies, and service companies.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheckCircle className="w-4 h-4 text-green-500" />
                        <span>Business profile with branding</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheckCircle className="w-4 h-4 text-green-500" />
                        <span>Add multiple team members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheckCircle className="w-4 h-4 text-green-500" />
                        <span>Advanced business analytics</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-primary-600 font-medium">
                      <span>Register Business</span>
                      <HiCheck className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary-600 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600 mt-1">Tell us about yourself</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input {...register('firstName')} className="input pl-10" placeholder="John" />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input {...register('lastName')} className="input" placeholder="Ochieng" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input {...register('email')} type="email" className="input pl-10" placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input {...register('phone')} type="tel" className="input pl-10" placeholder="0712 345 678" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {providerType === 'business' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                    <div className="relative">
                      <HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input {...register('businessName')} className="input pl-10" placeholder="Your Business Name" />
                    </div>
                    {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                  </div>
                )}

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

            {/* Step 3: Service Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Service Details</h2>
                  <p className="text-gray-600 mt-1">Tell us about your services</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Service Category *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
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
                        <span className="text-3xl">{cat.icon}</span>
                        <div className="text-center">
                          <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                          <p className="text-xs text-gray-500">{cat.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <div className="relative">
                    <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select {...register('location')} className="input pl-10">
                      <option value="">Select your city</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                  <select {...register('experience')} className="input">
                    <option value="">Select experience level</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About Your Services *</label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="input"
                    placeholder="Describe your services, skills, and what makes you stand out..."
                  />
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 btn-outline btn-lg">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(4)} className="flex-1 btn-primary btn-lg">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Document Verification (Individual) */}
            {step === 4 && providerType === 'individual' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiIdentification className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-gray-900">Identity Verification</h2>
                  <p className="text-gray-600 mt-1">Upload your documents for verification</p>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <HiInformationCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Why we need this</p>
                    <p className="text-blue-700 mt-1">
                      To ensure the safety of our users, we verify all service providers. 
                      Your documents are encrypted and stored securely. Verification typically takes 24-48 hours.
                    </p>
                  </div>
                </div>

                {/* Document Upload Areas */}
                <div className="space-y-4">
                  {/* ID Front */}
                  <div className="border-2 border-dashed rounded-xl p-4 hover:border-primary-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <HiIdentification className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">National ID Card (Front) *</p>
                          <p className="text-sm text-gray-500">Clear photo of front side</p>
                        </div>
                      </div>
                      {documents.find(d => d.type === 'id_front') ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <HiCheckCircle className="w-4 h-4" /> Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(documents.find(d => d.type === 'id_front')!.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <HiX className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'id_front')}
                          />
                          <span className="btn-outline btn-sm flex items-center gap-2">
                            <HiUpload className="w-4 h-4" /> Upload
                          </span>
                        </label>
                      )}
                    </div>
                    {documents.find(d => d.type === 'id_front') && (
                      <div className="mt-3">
                        <img
                          src={documents.find(d => d.type === 'id_front')!.preview}
                          alt="ID Front"
                          className="w-full max-w-xs h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* ID Back */}
                  <div className="border-2 border-dashed rounded-xl p-4 hover:border-primary-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <HiIdentification className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">National ID Card (Back) *</p>
                          <p className="text-sm text-gray-500">Clear photo of back side</p>
                        </div>
                      </div>
                      {documents.find(d => d.type === 'id_back') ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <HiCheckCircle className="w-4 h-4" /> Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(documents.find(d => d.type === 'id_back')!.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <HiX className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'id_back')}
                          />
                          <span className="btn-outline btn-sm flex items-center gap-2">
                            <HiUpload className="w-4 h-4" /> Upload
                          </span>
                        </label>
                      )}
                    </div>
                    {documents.find(d => d.type === 'id_back') && (
                      <div className="mt-3">
                        <img
                          src={documents.find(d => d.type === 'id_back')!.preview}
                          alt="ID Back"
                          className="w-full max-w-xs h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Selfie with ID */}
                  <div className="border-2 border-dashed rounded-xl p-4 hover:border-primary-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <HiPhotograph className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Selfie Holding ID *</p>
                          <p className="text-sm text-gray-500">Photo of you holding your ID</p>
                        </div>
                      </div>
                      {documents.find(d => d.type === 'selfie') ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <HiCheckCircle className="w-4 h-4" /> Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(documents.find(d => d.type === 'selfie')!.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <HiX className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'selfie')}
                          />
                          <span className="btn-outline btn-sm flex items-center gap-2">
                            <HiUpload className="w-4 h-4" /> Upload
                          </span>
                        </label>
                      )}
                    </div>
                    {documents.find(d => d.type === 'selfie') && (
                      <div className="mt-3">
                        <img
                          src={documents.find(d => d.type === 'selfie')!.preview}
                          alt="Selfie"
                          className="w-full max-w-xs h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Optional Certificate */}
                  <div className="border-2 border-dashed rounded-xl p-4 hover:border-primary-400 transition-colors bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <HiDocumentText className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Certificate/License (Optional)</p>
                          <p className="text-sm text-gray-500">Professional certification if available</p>
                        </div>
                      </div>
                      {documents.find(d => d.type === 'certificate') ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <HiCheckCircle className="w-4 h-4" /> Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(documents.find(d => d.type === 'certificate')!.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <HiX className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'certificate')}
                          />
                          <span className="btn-ghost btn-sm flex items-center gap-2">
                            <HiUpload className="w-4 h-4" /> Upload
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                    <span className="text-sm text-gray-500">
                      {documents.filter(d => requiredDocs.includes(d.type)).length}/{requiredDocs.length} required
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${(documents.filter(d => requiredDocs.includes(d.type)).length / requiredDocs.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(3)} className="flex-1 btn-outline btn-lg">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    disabled={!hasAllRequiredDocs}
                    className="flex-1 btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 for Business: Security */}
            {step === 4 && providerType === 'business' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Secure Your Account</h2>
                  <p className="text-gray-600 mt-1">Create a strong password</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="input pl-10 pr-10"
                      placeholder="Min. 8 characters"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className="input pl-10"
                      placeholder="Repeat password"
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
                    I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>,{' '}
                    <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>, and{' '}
                    <Link href="/provider-terms" className="text-primary-600 hover:underline">Provider Agreement</Link>
                  </label>
                </div>
                {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(3)} className="flex-1 btn-outline btn-lg">
                    Back
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 btn-primary btn-lg disabled:opacity-50">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Security for Individual */}
            {step === 5 && providerType === 'individual' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-gray-900">Almost Done!</h2>
                  <p className="text-gray-600 mt-1">Create your account password</p>
                </div>

                {/* Verification Status */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <HiClock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-900">Verification Pending</p>
                    <p className="text-amber-700 mt-1">
                      After registration, your documents will be reviewed within 24-48 hours. 
                      You will receive a notification once verified.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="input pl-10 pr-10"
                      placeholder="Min. 8 characters"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className="input pl-10"
                      placeholder="Repeat password"
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
                    I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>,{' '}
                    <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>, and{' '}
                    <Link href="/provider-terms" className="text-primary-600 hover:underline">Provider Agreement</Link>
                  </label>
                </div>
                {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(4)} className="flex-1 btn-outline btn-lg">
                    Back
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 btn-primary btn-lg disabled:opacity-50">
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </div>
            )}

            {step > 1 && (
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </form>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-white/80">
          <div className="flex items-center gap-2 text-sm">
            <HiShieldCheck className="w-5 h-5" />
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <HiCheckCircle className="w-5 h-5" />
            <span>Verified Providers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
