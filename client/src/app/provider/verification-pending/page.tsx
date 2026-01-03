'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HiClock, 
  HiCheckCircle, 
  HiDocumentText, 
  HiPhone, 
  HiMail,
  HiRefresh,
  HiHome,
  HiQuestionMarkCircle,
  HiExclamationCircle,
  HiArrowRight
} from 'react-icons/hi';

// Mock verification status - in production, this would come from the API
const mockVerificationData = {
  applicationId: 'PRV-2026-001234',
  submittedAt: '2026-01-03T10:30:00',
  providerType: 'individual',
  name: 'John Ochieng',
  email: 'john@example.com',
  status: 'pending', // 'pending' | 'reviewing' | 'approved' | 'rejected' | 'more_info_needed'
  estimatedTime: '24-48 hours',
  documents: [
    { name: 'National ID (Front)', status: 'verified' },
    { name: 'National ID (Back)', status: 'verified' },
    { name: 'Selfie with ID', status: 'pending' },
  ],
  timeline: [
    { event: 'Application Submitted', time: '2026-01-03 10:30 AM', completed: true },
    { event: 'Documents Received', time: '2026-01-03 10:30 AM', completed: true },
    { event: 'Under Review', time: 'In Progress', completed: false, current: true },
    { event: 'Verification Complete', time: 'Pending', completed: false },
    { event: 'Account Activated', time: 'Pending', completed: false },
  ],
};

export default function VerificationPendingPage() {
  const [verificationData, setVerificationData] = useState(mockVerificationData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallStatusInfo = () => {
    switch (verificationData.status) {
      case 'pending':
        return {
          icon: HiClock,
          title: 'Verification In Progress',
          description: 'Your application is being reviewed by our team. This typically takes 24-48 hours.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
        };
      case 'reviewing':
        return {
          icon: HiDocumentText,
          title: 'Documents Under Review',
          description: 'Our team is currently reviewing your submitted documents.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        };
      case 'approved':
        return {
          icon: HiCheckCircle,
          title: 'Verification Approved',
          description: 'Congratulations! Your account has been verified. You can now start offering services.',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'rejected':
        return {
          icon: HiExclamationCircle,
          title: 'Verification Unsuccessful',
          description: 'Unfortunately, we could not verify your documents. Please review the feedback below.',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        };
      case 'more_info_needed':
        return {
          icon: HiQuestionMarkCircle,
          title: 'Additional Information Required',
          description: 'We need more information to complete your verification. Please check below for details.',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
        };
      default:
        return {
          icon: HiClock,
          title: 'Processing',
          description: 'Your application is being processed.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        };
    }
  };

  const statusInfo = getOverallStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Afrionex</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <HiHome className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className={`${statusInfo.bgColor} p-6 text-center`}>
            <div className={`w-20 h-20 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg`}>
              <StatusIcon className={`w-10 h-10 ${statusInfo.color}`} />
            </div>
            <h1 className={`text-2xl font-bold ${statusInfo.color} mb-2`}>
              {statusInfo.title}
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              {statusInfo.description}
            </p>
          </div>

          <div className="p-6">
            {/* Application Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-500">Application ID</p>
                <p className="font-semibold text-gray-900">{verificationData.applicationId}</p>
              </div>
              <div>
                <p className="text-gray-500">Submitted</p>
                <p className="font-semibold text-gray-900">
                  {new Date(verificationData.submittedAt).toLocaleDateString('en-KE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Provider Type</p>
                <p className="font-semibold text-gray-900 capitalize">{verificationData.providerType}</p>
              </div>
              <div>
                <p className="text-gray-500">Estimated Time</p>
                <p className="font-semibold text-gray-900">{verificationData.estimatedTime}</p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshStatus}
              disabled={isRefreshing}
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <HiRefresh className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Checking Status...' : 'Refresh Status'}
            </button>
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiDocumentText className="w-5 h-5 text-primary-500" />
            Document Verification Status
          </h2>
          <div className="space-y-3">
            {verificationData.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">{doc.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status === 'verified' ? 'Verified' : doc.status === 'pending' ? 'Pending' : 'Review Needed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Timeline</h2>
          <div className="relative">
            {verificationData.timeline.map((item, index) => (
              <div key={index} className="flex gap-4 pb-6 last:pb-0">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.completed 
                      ? 'bg-green-500 text-white' 
                      : item.current 
                        ? 'bg-primary-500 text-white animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {item.completed ? (
                      <HiCheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  {index < verificationData.timeline.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-2 ${
                      item.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className={`font-medium ${item.completed || item.current ? 'text-gray-900' : 'text-gray-400'}`}>
                    {item.event}
                  </p>
                  <p className={`text-sm ${item.completed || item.current ? 'text-gray-500' : 'text-gray-400'}`}>
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
              <p>Our verification team will review your submitted documents within 24-48 hours.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
              <p>You will receive an email and SMS notification once your verification is complete.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
              <p>Once approved, you can log in to your provider dashboard and start accepting bookings.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about your verification or need to update your documents, our support team is here to help.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <a 
              href="tel:+254700000000" 
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <HiPhone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Call Support</p>
                <p className="text-sm text-gray-500">+254 700 000 000</p>
              </div>
            </a>
            <a 
              href="mailto:support@afrionex.com" 
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <HiMail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-sm text-gray-500">support@afrionex.com</p>
              </div>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        {verificationData.status === 'approved' && (
          <div className="mt-6">
            <Link
              href="/provider/dashboard"
              className="block w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl text-center hover:shadow-lg transition-all"
            >
              Go to Provider Dashboard
              <HiArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
          </div>
        )}

        {verificationData.status === 'more_info_needed' && (
          <div className="mt-6">
            <Link
              href="/provider/register?step=documents"
              className="block w-full py-4 bg-orange-500 text-white font-semibold rounded-xl text-center hover:bg-orange-600 transition-all"
            >
              Update Documents
              <HiArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
          </div>
        )}

        {verificationData.status === 'rejected' && (
          <div className="mt-6 space-y-3">
            <Link
              href="/provider/register"
              className="block w-full py-4 bg-primary-500 text-white font-semibold rounded-xl text-center hover:bg-primary-600 transition-all"
            >
              Submit New Application
            </Link>
            <Link
              href="/help/verification"
              className="block w-full py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-center hover:border-primary-500 hover:text-primary-500 transition-all"
            >
              Learn About Requirements
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
