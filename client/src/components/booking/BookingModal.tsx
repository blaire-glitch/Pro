'use client';

import { useState } from 'react';
import { HiX, HiCalendar, HiClock, HiLocationMarker, HiCash, HiCheck, HiHome, HiOfficeBuilding } from 'react-icons/hi';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import { bookingsApi, paymentsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  provider: {
    id: string;
    businessName: string;
    avatar: string;
    location: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
    description: string;
  };
  onClose: () => void;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'mpesa', description: 'Pay via M-Pesa' },
  { id: 'airtel', name: 'Airtel Money', icon: 'airtel', description: 'Pay via Airtel Money' },
  { id: 'card', name: 'Card', icon: 'card', description: 'Pay via Debit/Credit Card' },
  { id: 'cash', name: 'Cash', icon: 'cash', description: 'Pay in cash after service' },
];

export function BookingModal({ provider, service, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'datetime' | 'location' | 'payment' | 'confirm'>('datetime');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<'home' | 'provider'>('home');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Generate next 14 days for date selection
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const handleNext = () => {
    if (step === 'datetime') setStep('location');
    else if (step === 'location') setStep('payment');
    else if (step === 'payment') setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'location') setStep('datetime');
    else if (step === 'payment') setStep('location');
    else if (step === 'confirm') setStep('payment');
  };

  const handleConfirmBooking = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please log in to book a service');
      router.push(`/login?redirect=/provider/${provider.id}`);
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the booking
      const bookingResponse = await bookingsApi.create({
        serviceId: service.id,
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
        scheduledTime: selectedTime,
        notes: notes || undefined,
        address: locationType === 'home' ? address : provider.location,
      });

      const booking = bookingResponse.data.data;

      // If payment method is not cash, initiate payment
      if (paymentMethod && paymentMethod !== 'cash') {
        try {
          await paymentsApi.initiate({
            bookingId: booking.id,
            method: paymentMethod as 'mpesa' | 'airtel_money' | 'card',
            phone: phone || undefined,
          });
          toast.success('Booking created! Check your phone for payment prompt.');
        } catch (paymentError) {
          console.error('Payment initiation failed:', paymentError);
          toast.success('Booking created! Please complete payment later.');
        }
      } else {
        toast.success('Booking created successfully! Pay in cash on arrival.');
      }

      onClose();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Booking failed:', error);
      const message = error.response?.data?.error || 'Failed to create booking. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 'datetime') return selectedDate && selectedTime;
    if (step === 'location') return locationType === 'provider' || address.length > 0;
    if (step === 'payment') return paymentMethod && (paymentMethod === 'cash' || phone.length >= 10);
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">Book Service</h2>
              <p className="text-sm text-gray-500">{service.name} - KSh {service.price.toLocaleString()}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close booking modal"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              {['Date & Time', 'Location', 'Payment', 'Confirm'].map((label, i) => {
                const stepIndex = ['datetime', 'location', 'payment', 'confirm'].indexOf(step);
                const isActive = i === stepIndex;
                const isComplete = i < stepIndex;
                return (
                  <div key={label} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isComplete ? <HiCheck className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className={`ml-2 text-xs hidden sm:inline ${isActive ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
                      {label}
                    </span>
                    {i < 3 && <div className="w-8 sm:w-12 h-0.5 bg-gray-200 mx-2"></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {/* Date & Time Step */}
            {step === 'datetime' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <HiCalendar className="inline w-5 h-5 mr-1" />
                    Select Date
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 p-3 rounded-xl text-center transition-colors ${
                          selectedDate?.toDateString() === date.toDateString()
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="text-xs uppercase">{format(date, 'EEE')}</div>
                        <div className="text-lg font-semibold">{format(date, 'd')}</div>
                        <div className="text-xs">{format(date, 'MMM')}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <HiClock className="inline w-5 h-5 mr-1" />
                    Select Time
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === time
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Location Step */}
            {step === 'location' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <HiLocationMarker className="inline w-5 h-5 mr-1" />
                    Where do you want the service?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setLocationType('home')}
                      className={`p-4 rounded-xl border-2 text-center transition-colors ${
                        locationType === 'home'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <HiHome className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                      <span className="font-medium">At My Location</span>
                      <span className="text-xs text-gray-500 block mt-1">Provider comes to you</span>
                    </button>
                    <button
                      onClick={() => setLocationType('provider')}
                      className={`p-4 rounded-xl border-2 text-center transition-colors ${
                        locationType === 'provider'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <HiOfficeBuilding className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                      <span className="font-medium">At Provider</span>
                      <span className="text-xs text-gray-500 block mt-1">{provider.location}</span>
                    </button>
                  </div>
                </div>

                {locationType === 'home' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full address..."
                      className="input min-h-[100px]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or notes for the provider..."
                    className="input min-h-[80px]"
                  />
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <HiCash className="inline w-5 h-5 mr-1" />
                    Select Payment Method
                  </label>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-colors ${
                          paymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <span className="font-medium block">{method.name}</span>
                          <span className="text-sm text-gray-500">{method.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod && paymentMethod !== 'cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number for Payment
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="input"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Confirm Step */}
            {step === 'confirm' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider</span>
                    <span className="font-medium">{provider.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, 'EEE, MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">
                      {Math.floor(service.duration / 60)}h {service.duration % 60}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">
                      {locationType === 'home' ? 'At your location' : provider.location}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary-600">
                      KSh {service.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  By confirming this booking, you agree to our Terms of Service and Cancellation Policy.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
            {step !== 'datetime' ? (
              <button onClick={handleBack} className="btn-outline">
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step !== 'confirm' ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
