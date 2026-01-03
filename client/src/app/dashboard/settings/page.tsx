'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { 
  HiArrowLeft, HiUser, HiBell, HiShieldCheck, HiCreditCard,
  HiLocationMarker, HiTrash, HiLogout, HiCamera, HiPencil, HiPhone
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'payments'>('profile');
  
  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deletion request submitted');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <HiArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-2xl shadow-sm p-4 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <HiUser className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'notifications' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <HiBell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'privacy' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <HiShieldCheck className="w-5 h-5" />
                  <span>Privacy & Security</span>
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'payments' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <HiCreditCard className="w-5 h-5" />
                  <span>Payment Methods</span>
                </button>
              </nav>

              <div className="mt-4 bg-white rounded-2xl shadow-sm p-4">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <HiLogout className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-display font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <Image
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=FF6B9D&color=fff&size=100`}
                        alt=""
                        width={100}
                        height={100}
                        className="rounded-full"
                      />
                      <button aria-label="Change profile photo" className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600">
                        <HiCamera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{firstName} {lastName}</h3>
                      <p className="text-gray-500 text-sm">{email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        id="first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        id="last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        id="email-address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        id="phone-number"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input"
                        placeholder="+254 7XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button onClick={handleSaveProfile} className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-display font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive booking updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive booking updates via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={smsNotifications}
                          onChange={(e) => setSmsNotifications(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>

                    <hr />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                        <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={marketingEmails}
                          onChange={(e) => setMarketingEmails(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-display font-bold text-gray-900 mb-6">Change Password</h2>
                    
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" className="input" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" className="input" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" className="input" placeholder="••••••••" />
                      </div>
                      <button className="btn-primary">Update Password</button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-display font-bold text-gray-900 mb-2">Delete Account</h2>
                    <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button 
                      onClick={handleDeleteAccount}
                      className="btn border-2 border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <HiTrash className="w-5 h-5 mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-display font-bold text-gray-900 mb-6">Payment Methods</h2>
                  
                  <div className="space-y-4">
                    {/* M-Pesa */}
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <HiPhone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">M-Pesa</h3>
                          <p className="text-sm text-gray-500">+254 7XX XXX XXX</p>
                        </div>
                      </div>
                      <span className="badge badge-success">Default</span>
                    </div>

                    {/* Add new */}
                    <button className="w-full p-4 border-2 border-dashed rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-500 transition-colors">
                      + Add Payment Method
                    </button>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium text-gray-900 mb-4">Saved Addresses</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 border rounded-xl">
                        <HiLocationMarker className="w-6 h-6 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Home</h4>
                          <p className="text-sm text-gray-500">123 Westlands Road, Nairobi, Kenya</p>
                        </div>
                        <button aria-label="Edit address" className="text-gray-400 hover:text-primary-600">
                          <HiPencil className="w-5 h-5" />
                        </button>
                      </div>
                      <button className="w-full p-4 border-2 border-dashed rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-500 transition-colors">
                        + Add Address
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
