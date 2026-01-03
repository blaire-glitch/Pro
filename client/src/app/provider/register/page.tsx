'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiUser, 
  FiBriefcase, 
  FiCheck, 
  FiUpload, 
  FiCamera,
  FiCreditCard,
  FiShield,
  FiAlertCircle,
  FiX,
  FiFileText
} from 'react-icons/fi';

type ProviderType = 'individual' | 'business' | null;

interface FormData {
  providerType: ProviderType;
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // Business Info (only for business type)
  businessName: string;
  businessRegistration: string;
  // Services
  category: string;
  services: string[];
  experience: string;
  description: string;
  // Location
  county: string;
  town: string;
  address: string;
  // Documents (for individuals)
  idCardFront: File | null;
  idCardBack: File | null;
  selfieWithId: File | null;
  // Business documents
  businessLicense: File | null;
  taxCertificate: File | null;
  // Account
  mpesaNumber: string;
  bankName: string;
  bankAccount: string;
}

const serviceCategories = [
  { id: 'beauty', name: 'Beauty & Personal Care', services: ['Hair Styling', 'Makeup', 'Nails', 'Barbering', 'Skincare', 'Massage'] },
  { id: 'home', name: 'Home Services', services: ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Gardening'] },
  { id: 'wellness', name: 'Health & Wellness', services: ['Fitness Training', 'Yoga', 'Nutrition', 'Physiotherapy', 'Mental Health'] },
  { id: 'lifestyle', name: 'Lifestyle Services', services: ['Tutoring', 'Event Planning', 'Photography', 'Catering', 'DJ Services'] },
  { id: 'tech', name: 'Tech & Digital', services: ['Phone Repair', 'Computer Services', 'Web Design', 'Social Media Management'] },
  { id: 'automotive', name: 'Automotive', services: ['Car Wash', 'Mechanic', 'Towing', 'Auto Detailing'] },
];

const counties = [
  'Kakamega', 'Bungoma', 'Busia', 'Vihiga', 'Trans Nzoia', 'Kisumu', 'Siaya', 'Homabay', 'Migori', 'Kisii', 'Nyamira'
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const businessLicenseRef = useRef<HTMLInputElement>(null);
  const taxCertificateRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    providerType: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessRegistration: '',
    category: '',
    services: [],
    experience: '',
    description: '',
    county: '',
    town: '',
    address: '',
    idCardFront: null,
    idCardBack: null,
    selfieWithId: null,
    businessLicense: null,
    taxCertificate: null,
    mpesaNumber: '',
    bankName: '',
    bankAccount: '',
  });

  // Preview URLs for uploaded images
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const totalSteps = formData.providerType === 'individual' ? 5 : 4;

  const getStepTitle = (step: number) => {
    if (formData.providerType === 'individual') {
      const titles = ['Provider Type', 'Personal Information', 'Services', 'Document Verification', 'Payment Account'];
      return titles[step - 1];
    } else {
      const titles = ['Provider Type', 'Business Information', 'Services', 'Payment Account'];
      return titles[step - 1];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, [fieldName]: 'Please upload an image file' }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, [fieldName]: file }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [fieldName]: previewUrl }));
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const removeFile = (fieldName: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    if (previews[fieldName]) {
      URL.revokeObjectURL(previews[fieldName]);
      setPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fieldName];
        return newPreviews;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.providerType) {
        newErrors.providerType = 'Please select a provider type';
      }
    }

    if (currentStep === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^(07|01)\d{8}$/.test(formData.phone)) newErrors.phone = 'Invalid phone format (e.g., 0712345678)';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      if (formData.providerType === 'business') {
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      }
    }

    if (currentStep === 3) {
      if (!formData.category) newErrors.category = 'Please select a category';
      if (formData.services.length === 0) newErrors.services = 'Please select at least one service';
      if (!formData.experience) newErrors.experience = 'Please select your experience level';
      if (!formData.description.trim()) newErrors.description = 'Please provide a description';
      if (!formData.county) newErrors.county = 'Please select your county';
      if (!formData.town.trim()) newErrors.town = 'Town/Area is required';
    }

    // Document verification step (only for individuals)
    if (formData.providerType === 'individual' && currentStep === 4) {
      if (!formData.idCardFront) newErrors.idCardFront = 'ID card front is required';
      if (!formData.idCardBack) newErrors.idCardBack = 'ID card back is required';
      if (!formData.selfieWithId) newErrors.selfieWithId = 'Selfie with ID is required';
    }

    // Payment step
    const paymentStep = formData.providerType === 'individual' ? 5 : 4;
    if (currentStep === paymentStep) {
      if (!formData.mpesaNumber.trim()) newErrors.mpesaNumber = 'M-Pesa number is required';
      else if (!/^(07|01)\d{8}$/.test(formData.mpesaNumber)) newErrors.mpesaNumber = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitData.append(key, value);
        } else if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else if (value !== null) {
          submitData.append(key, String(value));
        }
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect based on provider type
      if (formData.providerType === 'individual') {
        router.push('/provider/verification-pending');
      } else {
        router.push('/provider/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Provider Type Selection
  const renderProviderTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How do you want to offer services?</h2>
        <p className="text-gray-600">Choose the type of provider account that best fits you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Individual Provider */}
        <button
          onClick={() => {
            setFormData(prev => ({ ...prev, providerType: 'individual' }));
            setErrors({});
          }}
          className={`p-6 rounded-2xl border-2 transition-all text-left ${
            formData.providerType === 'individual'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
          }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
            formData.providerType === 'individual' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            <FiUser className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Individual Provider</h3>
          <p className="text-gray-600 text-sm mb-4">
            Perfect for freelancers and independent service providers offering personal skills.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-gray-600">
              <FiCheck className="w-4 h-4 text-emerald-500 mr-2" />
              No business registration required
            </li>
            <li className="flex items-center text-gray-600">
              <FiCheck className="w-4 h-4 text-emerald-500 mr-2" />
              Quick verification with ID card
            </li>
            <li className="flex items-center text-gray-600">
              <FiCheck className="w-4 h-4 text-emerald-500 mr-2" />
              Start earning within 24-48 hours
            </li>
          </ul>

          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <FiShield className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-700">
                <span className="font-medium">Verification Required:</span> You'll need to submit your National ID card for identity verification.
              </div>
            </div>
          </div>
        </button>

        {/* Business Provider */}
        <button
          onClick={() => {
            setFormData(prev => ({ ...prev, providerType: 'business' }));
            setErrors({});
          }}
          className={`p-6 rounded-2xl border-2 transition-all text-left ${
            formData.providerType === 'business'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
          }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
            formData.providerType === 'business' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            <FiBriefcase className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Provider</h3>
          <p className="text-gray-600 text-sm mb-4">
            For registered businesses, shops, and companies offering professional services.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-gray-600">
              <FiCheck className="w-4 h-4 text-emerald-500 mr-2" />
              Business profile with branding
            </li>
            <li className="flex items-center text-gray-600">
              <FiCheck className="w-4 h-4 text-emerald-500 mr-2" />
              Multiple team members
            </li>
            <li className="flex items-center text-gray-600">
              <FiCheck className="w-4 h-4 text-emerald-500 mr-2" />
              Advanced analytics & reporting
            </li>
          </ul>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <FiFileText className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700">
                <span className="font-medium">Optional Documents:</span> Business registration and tax certificate can be added later.
              </div>
            </div>
          </div>
        </button>
      </div>

      {errors.providerType && (
        <p className="text-red-500 text-sm text-center">{errors.providerType}</p>
      )}
    </div>
  );

  // Step 2: Personal/Business Information
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.providerType === 'individual' ? 'Personal Information' : 'Business Information'}
        </h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      {formData.providerType === 'business' && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-xl mb-6">
          <h3 className="font-semibold text-gray-900">Business Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="Your Business Name"
            />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Number (Optional)</label>
            <input
              type="text"
              name="businessRegistration"
              value={formData.businessRegistration}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., PVT-XXXXX"
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            placeholder="John"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
          placeholder="john@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
          placeholder="0712345678"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            placeholder="Min. 6 characters"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );

  // Step 3: Services
  const renderServicesStep = () => {
    const selectedCategory = serviceCategories.find(c => c.id === formData.category);

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Services</h2>
          <p className="text-gray-600">What services do you offer?</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => {
              handleInputChange(e);
              setFormData(prev => ({ ...prev, services: [] }));
            }}
            className={`w-full px-4 py-3 rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
          >
            <option value="">Select a category</option>
            {serviceCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Services *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedCategory.services.map(service => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.services.includes(service)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                  }`}
                >
                  {formData.services.includes(service) && <FiCheck className="inline w-4 h-4 mr-1" />}
                  {service}
                </button>
              ))}
            </div>
            {errors.services && <p className="text-red-500 text-xs mt-1">{errors.services}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${errors.experience ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
          >
            <option value="">Select experience</option>
            <option value="beginner">Less than 1 year</option>
            <option value="intermediate">1-3 years</option>
            <option value="experienced">3-5 years</option>
            <option value="expert">5+ years</option>
          </select>
          {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About Your Services *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            placeholder="Describe your services, skills, and what makes you stand out..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">County *</label>
            <select
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.county ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            >
              <option value="">Select county</option>
              {counties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
            {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Town/Area *</label>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.town ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="e.g., Kakamega Town"
            />
            {errors.town && <p className="text-red-500 text-xs mt-1">{errors.town}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Address (Optional)</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Street, Building, etc."
          />
        </div>
      </div>
    );
  };

  // Step 4: Document Verification (Individual Only)
  const renderDocumentVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Verification</h2>
        <p className="text-gray-600">We need to verify your identity to protect our community</p>
      </div>

      {/* Warning Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <FiShield className="w-6 h-6 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">Why we verify</h3>
            <p className="text-sm text-amber-700 mt-1">
              Identity verification helps us maintain a safe and trustworthy platform for both providers and customers. Your documents are encrypted and stored securely.
            </p>
          </div>
        </div>
      </div>

      {/* ID Card Front */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiCreditCard className="inline w-4 h-4 mr-1" />
          National ID Card - Front Side *
        </label>
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            errors.idCardFront ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-400 bg-gray-50'
          }`}
        >
          {previews.idCardFront ? (
            <div className="relative">
              <img 
                src={previews.idCardFront} 
                alt="ID Front" 
                className="max-h-40 mx-auto rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile('idCardFront')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <FiUpload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input
            ref={idFrontRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'idCardFront')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {errors.idCardFront && <p className="text-red-500 text-xs mt-1">{errors.idCardFront}</p>}
      </div>

      {/* ID Card Back */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiCreditCard className="inline w-4 h-4 mr-1" />
          National ID Card - Back Side *
        </label>
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            errors.idCardBack ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-400 bg-gray-50'
          }`}
        >
          {previews.idCardBack ? (
            <div className="relative">
              <img 
                src={previews.idCardBack} 
                alt="ID Back" 
                className="max-h-40 mx-auto rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile('idCardBack')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <FiUpload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input
            ref={idBackRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'idCardBack')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {errors.idCardBack && <p className="text-red-500 text-xs mt-1">{errors.idCardBack}</p>}
      </div>

      {/* Selfie with ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiCamera className="inline w-4 h-4 mr-1" />
          Selfie Holding Your ID Card *
        </label>
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            errors.selfieWithId ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-400 bg-gray-50'
          }`}
        >
          {previews.selfieWithId ? (
            <div className="relative">
              <img 
                src={previews.selfieWithId} 
                alt="Selfie with ID" 
                className="max-h-40 mx-auto rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile('selfieWithId')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <FiCamera className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Take a clear selfie holding your ID</p>
              <p className="text-xs text-gray-500 mt-1">Make sure your face and ID are clearly visible</p>
            </div>
          )}
          <input
            ref={selfieRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={(e) => handleFileChange(e, 'selfieWithId')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {errors.selfieWithId && <p className="text-red-500 text-xs mt-1">{errors.selfieWithId}</p>}
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-medium text-blue-800 mb-2">Tips for quick approval:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ensure all text on your ID is clearly readable</li>
          <li>• Take photos in good lighting</li>
          <li>• For selfie, hold the ID next to your face</li>
          <li>• Avoid blurry or cropped images</li>
        </ul>
      </div>
    </div>
  );

  // Step 5 (or 4 for business): Payment Account
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Account</h2>
        <p className="text-gray-600">How would you like to receive payments?</p>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h3 className="font-semibold text-green-800">M-Pesa (Primary)</h3>
            <p className="text-sm text-green-700">Instant payments directly to your M-Pesa</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number *</label>
        <input
          type="tel"
          name="mpesaNumber"
          value={formData.mpesaNumber}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl border ${errors.mpesaNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
          placeholder="0712345678"
        />
        {errors.mpesaNumber && <p className="text-red-500 text-xs mt-1">{errors.mpesaNumber}</p>}
        <p className="text-xs text-gray-500 mt-1">This is where you'll receive payments from customers</p>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">Bank Account (Optional)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <select
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select bank (optional)</option>
              <option value="equity">Equity Bank</option>
              <option value="kcb">KCB Bank</option>
              <option value="cooperative">Co-operative Bank</option>
              <option value="absa">ABSA Bank</option>
              <option value="stanbic">Stanbic Bank</option>
              <option value="ncba">NCBA Bank</option>
              <option value="dtb">DTB Bank</option>
              <option value="family">Family Bank</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter account number"
            />
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 w-4 h-4 text-emerald-500 rounded" required />
          <span className="text-sm text-gray-600">
            I agree to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>. I understand that my account will be reviewed {formData.providerType === 'individual' ? 'and documents verified ' : ''}before I can start offering services.
          </span>
        </label>
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-700">
            <FiAlertCircle className="w-5 h-5" />
            <span>{errors.submit}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderProviderTypeStep();
      case 2:
        return renderPersonalInfoStep();
      case 3:
        return renderServicesStep();
      case 4:
        if (formData.providerType === 'individual') {
          return renderDocumentVerificationStep();
        } else {
          return renderPaymentStep();
        }
      case 5:
        return renderPaymentStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="font-bold text-lg text-emerald-600">Become a Provider</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {formData.providerType && (
        <div className="bg-white border-b">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">{getStepTitle(currentStep)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-medium"
              >
                Continue
                <FiArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
