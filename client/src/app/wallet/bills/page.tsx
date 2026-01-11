'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiLightningBolt, 
  HiPhone, 
  HiWifi, 
  HiHome, 
  HiFilm,
  HiAcademicCap,
  HiHeart,
  HiCreditCard,
  HiClock,
  HiCheckCircle,
  HiSearch,
  HiStar,
  HiRefresh,
  HiShieldCheck,
  HiInformationCircle,
  HiExclamationCircle,
  HiGlobe,
  HiCash,
  HiOfficeBuilding,
  HiTruck
} from 'react-icons/hi';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';

// Provider type definition
interface Provider {
  id: string;
  name: string;
  logo: string;
  accountType: string;
  accountFormat: string;
  accountPlaceholder: string;
  accountRegex: RegExp;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  charges: number;
  quickAmounts?: number[];
  bundles?: Array<{ name: string; price: number; validity: string }>;
  packages?: Array<{ name: string; price: number }>;
  requiresStudentId?: boolean;
}

interface Category {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  description: string;
  providers: Provider[];
}

// Comprehensive bill categories with Kenyan providers
const billCategories: Category[] = [
  { 
    id: 'electricity', 
    icon: HiLightningBolt, 
    label: 'Electricity', 
    color: 'bg-yellow-500',
    description: 'Pay your electricity bills',
    providers: [
      { 
        id: 'kplc-prepaid', 
        name: 'Kenya Power (Prepaid)', 
        logo: '/providers/kplc.png',
        accountType: 'Meter Number',
        accountFormat: '11 digits',
        accountPlaceholder: '12345678901',
        accountRegex: /^\d{11}$/,
        minAmount: 50,
        maxAmount: 50000,
        processingTime: 'Instant',
        charges: 0
      },
      { 
        id: 'kplc-postpaid', 
        name: 'Kenya Power (Postpaid)', 
        logo: '/providers/kplc.png',
        accountType: 'Account Number',
        accountFormat: '10 digits',
        accountPlaceholder: '1234567890',
        accountRegex: /^\d{10}$/,
        minAmount: 100,
        maxAmount: 100000,
        processingTime: 'Instant',
        charges: 0
      },
      { 
        id: 'umeme', 
        name: 'Umeme (Uganda)', 
        logo: '/providers/umeme.png',
        accountType: 'Meter Number',
        accountFormat: '11 digits',
        accountPlaceholder: '04012345678',
        accountRegex: /^\d{11}$/,
        minAmount: 1000,
        maxAmount: 500000,
        processingTime: 'Instant',
        charges: 50
      }
    ]
  },
  { 
    id: 'airtime', 
    icon: HiPhone, 
    label: 'Airtime & Bundles', 
    color: 'bg-green-500',
    description: 'Top up airtime and data bundles',
    providers: [
      { 
        id: 'safaricom-airtime', 
        name: 'Safaricom Airtime', 
        logo: '/providers/safaricom.png',
        accountType: 'Phone Number',
        accountFormat: '07XX or 01XX',
        accountPlaceholder: '0722123456',
        accountRegex: /^(07|01)\d{8}$/,
        minAmount: 5,
        maxAmount: 10000,
        processingTime: 'Instant',
        charges: 0,
        quickAmounts: [50, 100, 200, 500, 1000, 2000]
      },
      { 
        id: 'safaricom-bundles', 
        name: 'Safaricom Data Bundles', 
        logo: '/providers/safaricom.png',
        accountType: 'Phone Number',
        accountFormat: '07XX or 01XX',
        accountPlaceholder: '0722123456',
        accountRegex: /^(07|01)\d{8}$/,
        minAmount: 10,
        maxAmount: 10000,
        processingTime: 'Instant',
        charges: 0,
        bundles: [
          { name: '1GB Daily', price: 99, validity: '24 hours' },
          { name: '2.5GB Weekly', price: 249, validity: '7 days' },
          { name: '6GB Monthly', price: 500, validity: '30 days' },
          { name: '12GB Monthly', price: 1000, validity: '30 days' },
          { name: '25GB Monthly', price: 2000, validity: '30 days' },
          { name: 'Unlimited (24hrs)', price: 299, validity: '24 hours' }
        ]
      },
      { 
        id: 'airtel-airtime', 
        name: 'Airtel Airtime', 
        logo: '/providers/airtel.png',
        accountType: 'Phone Number',
        accountFormat: '073X or 0100',
        accountPlaceholder: '0733123456',
        accountRegex: /^(073|0100)\d{7,8}$/,
        minAmount: 5,
        maxAmount: 10000,
        processingTime: 'Instant',
        charges: 0,
        quickAmounts: [50, 100, 200, 500, 1000]
      },
      { 
        id: 'airtel-bundles', 
        name: 'Airtel Data Bundles', 
        logo: '/providers/airtel.png',
        accountType: 'Phone Number',
        accountFormat: '073X or 0100',
        accountPlaceholder: '0733123456',
        accountRegex: /^(073|0100)\d{7,8}$/,
        minAmount: 10,
        maxAmount: 5000,
        processingTime: 'Instant',
        charges: 0,
        bundles: [
          { name: '1.5GB Daily', price: 99, validity: '24 hours' },
          { name: '3GB Weekly', price: 249, validity: '7 days' },
          { name: '10GB Monthly', price: 500, validity: '30 days' },
          { name: '20GB Monthly', price: 1000, validity: '30 days' }
        ]
      },
      { 
        id: 'telkom-airtime', 
        name: 'Telkom Airtime', 
        logo: '/providers/telkom.png',
        accountType: 'Phone Number',
        accountFormat: '077X',
        accountPlaceholder: '0771123456',
        accountRegex: /^077\d{7}$/,
        minAmount: 5,
        maxAmount: 10000,
        processingTime: 'Instant',
        charges: 0,
        quickAmounts: [50, 100, 200, 500, 1000]
      }
    ]
  },
  { 
    id: 'internet', 
    icon: HiWifi, 
    label: 'Internet', 
    color: 'bg-blue-500',
    description: 'Pay for home and office internet',
    providers: [
      { 
        id: 'safaricom-home', 
        name: 'Safaricom Home Fibre', 
        logo: '/providers/safaricom.png',
        accountType: 'Account Number',
        accountFormat: 'Phone/Account',
        accountPlaceholder: '0722123456',
        accountRegex: /^(07|01)\d{8}$|^\d{8,12}$/,
        minAmount: 2999,
        maxAmount: 30000,
        processingTime: 'Instant',
        charges: 0,
        packages: [
          { name: '8 Mbps', price: 2999 },
          { name: '20 Mbps', price: 3999 },
          { name: '40 Mbps', price: 5999 },
          { name: '100 Mbps', price: 9999 }
        ]
      },
      { 
        id: 'zuku', 
        name: 'Zuku Internet', 
        logo: '/providers/zuku.png',
        accountType: 'Account Number',
        accountFormat: '6-10 digits',
        accountPlaceholder: '123456789',
        accountRegex: /^\d{6,10}$/,
        minAmount: 1999,
        maxAmount: 20000,
        processingTime: 'Instant',
        charges: 0,
        packages: [
          { name: 'Silver (10 Mbps)', price: 2499 },
          { name: 'Gold (25 Mbps)', price: 3999 },
          { name: 'Platinum (60 Mbps)', price: 5999 }
        ]
      },
      { 
        id: 'faiba', 
        name: 'Faiba Home', 
        logo: '/providers/faiba.png',
        accountType: 'Account Number',
        accountFormat: 'Phone/Account',
        accountPlaceholder: '0747123456',
        accountRegex: /^(0747|074)\d{6,7}$|^\d{8,12}$/,
        minAmount: 1499,
        maxAmount: 15000,
        processingTime: 'Instant',
        charges: 0,
        packages: [
          { name: '15 Mbps', price: 1499 },
          { name: '30 Mbps', price: 2499 },
          { name: '50 Mbps', price: 3499 }
        ]
      }
    ]
  },
  { 
    id: 'water', 
    icon: HiHome, 
    label: 'Water', 
    color: 'bg-cyan-500',
    description: 'Pay your water bills',
    providers: [
      { 
        id: 'kiwasco', 
        name: 'KIWASCO (Kisumu)', 
        logo: '/providers/kiwasco.png',
        accountType: 'Account Number',
        accountFormat: '8-12 digits',
        accountPlaceholder: '12345678',
        accountRegex: /^\d{8,12}$/,
        minAmount: 100,
        maxAmount: 50000,
        processingTime: '1-2 hours',
        charges: 0
      },
      { 
        id: 'nairobi-water', 
        name: 'Nairobi Water', 
        logo: '/providers/nairobi-water.png',
        accountType: 'Account Number',
        accountFormat: '8-12 digits',
        accountPlaceholder: '12345678901',
        accountRegex: /^\d{8,12}$/,
        minAmount: 100,
        maxAmount: 100000,
        processingTime: '1-2 hours',
        charges: 0
      },
      { 
        id: 'eldowas', 
        name: 'ELDOWAS (Eldoret)', 
        logo: '/providers/eldowas.png',
        accountType: 'Account Number',
        accountFormat: '8-10 digits',
        accountPlaceholder: '12345678',
        accountRegex: /^\d{8,10}$/,
        minAmount: 100,
        maxAmount: 50000,
        processingTime: '1-2 hours',
        charges: 0
      }
    ]
  },
  { 
    id: 'tv', 
    icon: HiFilm, 
    label: 'TV & Streaming', 
    color: 'bg-purple-500',
    description: 'Pay for TV subscriptions',
    providers: [
      { 
        id: 'dstv', 
        name: 'DStv', 
        logo: '/providers/dstv.png',
        accountType: 'Smartcard Number',
        accountFormat: '10 digits',
        accountPlaceholder: '7012345678',
        accountRegex: /^70\d{8}$/,
        minAmount: 230,
        maxAmount: 21000,
        processingTime: 'Instant',
        charges: 0,
        packages: [
          { name: 'DStv Access', price: 650 },
          { name: 'DStv Family', price: 1150 },
          { name: 'DStv Compact', price: 2900 },
          { name: 'DStv Compact Plus', price: 5400 },
          { name: 'DStv Premium', price: 8900 }
        ]
      },
      { 
        id: 'gotv', 
        name: 'GOtv', 
        logo: '/providers/gotv.png',
        accountType: 'IUC Number',
        accountFormat: '10 digits',
        accountPlaceholder: '2012345678',
        accountRegex: /^20\d{8}$/,
        minAmount: 230,
        maxAmount: 5000,
        processingTime: 'Instant',
        charges: 0,
        packages: [
          { name: 'GOtv Lite', price: 230 },
          { name: 'GOtv Value', price: 590 },
          { name: 'GOtv Plus', price: 990 },
          { name: 'GOtv Max', price: 1350 }
        ]
      },
      { 
        id: 'startimes', 
        name: 'StarTimes', 
        logo: '/providers/startimes.png',
        accountType: 'Smartcard Number',
        accountFormat: '10-11 digits',
        accountPlaceholder: '02123456789',
        accountRegex: /^\d{10,11}$/,
        minAmount: 199,
        maxAmount: 5000,
        processingTime: 'Instant',
        charges: 0,
        packages: [
          { name: 'Nova', price: 199 },
          { name: 'Basic', price: 459 },
          { name: 'Smart', price: 699 },
          { name: 'Classic', price: 1199 }
        ]
      },
      { 
        id: 'showmax', 
        name: 'Showmax', 
        logo: '/providers/showmax.png',
        accountType: 'Email/Phone',
        accountFormat: 'Email or Phone',
        accountPlaceholder: 'email@example.com',
        accountRegex: /^.+@.+\..+$|^(07|01)\d{8}$/,
        minAmount: 300,
        maxAmount: 1100,
        processingTime: 'Instant',
        charges: 0,
        packages: [
          { name: 'Showmax Mobile', price: 300 },
          { name: 'Showmax', price: 750 },
          { name: 'Showmax Pro Mobile', price: 900 },
          { name: 'Showmax Pro', price: 1100 }
        ]
      }
    ]
  },
  { 
    id: 'education', 
    icon: HiAcademicCap, 
    label: 'School Fees', 
    color: 'bg-orange-500',
    description: 'Pay school and college fees',
    providers: [
      { 
        id: 'school-direct', 
        name: 'Direct to School', 
        logo: '/providers/school.png',
        accountType: 'Paybill Number',
        accountFormat: '5-6 digit paybill',
        accountPlaceholder: '123456',
        accountRegex: /^\d{5,6}$/,
        minAmount: 100,
        maxAmount: 500000,
        processingTime: '1-2 hours',
        charges: 0,
        requiresStudentId: true
      },
      { 
        id: 'helb', 
        name: 'HELB Loan Repayment', 
        logo: '/providers/helb.png',
        accountType: 'ID Number',
        accountFormat: '8 digits',
        accountPlaceholder: '12345678',
        accountRegex: /^\d{8}$/,
        minAmount: 500,
        maxAmount: 100000,
        processingTime: '1-2 days',
        charges: 0
      }
    ]
  },
  { 
    id: 'insurance', 
    icon: HiHeart, 
    label: 'Insurance', 
    color: 'bg-red-500',
    description: 'Pay insurance premiums',
    providers: [
      { 
        id: 'nhif', 
        name: 'NHIF', 
        logo: '/providers/nhif.png',
        accountType: 'Member Number',
        accountFormat: '8-12 characters',
        accountPlaceholder: '12345678',
        accountRegex: /^.{8,12}$/,
        minAmount: 500,
        maxAmount: 5000,
        processingTime: '1-2 hours',
        charges: 0
      },
      { 
        id: 'jubilee', 
        name: 'Jubilee Insurance', 
        logo: '/providers/jubilee.png',
        accountType: 'Policy Number',
        accountFormat: 'Policy number',
        accountPlaceholder: 'JHL12345678',
        accountRegex: /^.{8,15}$/,
        minAmount: 1000,
        maxAmount: 200000,
        processingTime: '1-2 hours',
        charges: 0
      },
      { 
        id: 'britam', 
        name: 'Britam Insurance', 
        logo: '/providers/britam.png',
        accountType: 'Policy Number',
        accountFormat: 'Policy number',
        accountPlaceholder: 'BRT12345678',
        accountRegex: /^.{8,15}$/,
        minAmount: 1000,
        maxAmount: 200000,
        processingTime: '1-2 hours',
        charges: 0
      }
    ]
  },
  { 
    id: 'loans', 
    icon: HiCreditCard, 
    label: 'Loans', 
    color: 'bg-gray-600',
    description: 'Repay mobile and bank loans',
    providers: [
      { 
        id: 'mshwari', 
        name: 'M-Shwari Loan', 
        logo: '/providers/safaricom.png',
        accountType: 'M-Pesa Number',
        accountFormat: '07XX or 01XX',
        accountPlaceholder: '0722123456',
        accountRegex: /^(07|01)\d{8}$/,
        minAmount: 100,
        maxAmount: 100000,
        processingTime: 'Instant',
        charges: 0
      },
      { 
        id: 'kcb-mpesa', 
        name: 'KCB M-Pesa Loan', 
        logo: '/providers/kcb.png',
        accountType: 'M-Pesa Number',
        accountFormat: '07XX or 01XX',
        accountPlaceholder: '0722123456',
        accountRegex: /^(07|01)\d{8}$/,
        minAmount: 100,
        maxAmount: 200000,
        processingTime: 'Instant',
        charges: 0
      },
      { 
        id: 'tala', 
        name: 'Tala Loan', 
        logo: '/providers/tala.png',
        accountType: 'Phone Number',
        accountFormat: '07XX or 01XX',
        accountPlaceholder: '0722123456',
        accountRegex: /^(07|01)\d{8}$/,
        minAmount: 500,
        maxAmount: 50000,
        processingTime: '1-2 hours',
        charges: 0
      }
    ]
  },
  { 
    id: 'government', 
    icon: HiOfficeBuilding, 
    label: 'Government', 
    color: 'bg-indigo-500',
    description: 'Pay government services',
    providers: [
      { 
        id: 'kra', 
        name: 'KRA Tax Payment', 
        logo: '/providers/kra.png',
        accountType: 'KRA PIN',
        accountFormat: '11 characters (A + 9 digits + letter)',
        accountPlaceholder: 'A123456789B',
        accountRegex: /^[A-Z]\d{9}[A-Z]$/,
        minAmount: 100,
        maxAmount: 10000000,
        processingTime: '1-2 hours',
        charges: 0
      },
      { 
        id: 'ecitizen', 
        name: 'eCitizen Services', 
        logo: '/providers/ecitizen.png',
        accountType: 'Invoice Number',
        accountFormat: 'Invoice number',
        accountPlaceholder: 'INV123456789',
        accountRegex: /^.{8,20}$/,
        minAmount: 50,
        maxAmount: 100000,
        processingTime: 'Instant',
        charges: 0
      },
      { 
        id: 'ntsa', 
        name: 'NTSA (Vehicle)', 
        logo: '/providers/ntsa.png',
        accountType: 'Number Plate',
        accountFormat: 'KXX 123X',
        accountPlaceholder: 'KAA 123A',
        accountRegex: /^K[A-Z]{2}\s?\d{3}[A-Z]$/,
        minAmount: 100,
        maxAmount: 50000,
        processingTime: '1-2 hours',
        charges: 0
      }
    ]
  },
  { 
    id: 'transport', 
    icon: HiTruck, 
    label: 'Transport', 
    color: 'bg-teal-500',
    description: 'Transport and parking services',
    providers: [
      { 
        id: 'kenya-railways', 
        name: 'Kenya Railways (SGR)', 
        logo: '/providers/sgr.png',
        accountType: 'Booking ID',
        accountFormat: 'Booking reference',
        accountPlaceholder: 'SGR123456789',
        accountRegex: /^.{10,15}$/,
        minAmount: 500,
        maxAmount: 10000,
        processingTime: 'Instant',
        charges: 0
      },
      { 
        id: 'nairobi-parking', 
        name: 'Nairobi Parking', 
        logo: '/providers/nairobi.png',
        accountType: 'Number Plate',
        accountFormat: 'KXX 123X',
        accountPlaceholder: 'KAA 123A',
        accountRegex: /^K[A-Z]{2}\s?\d{3}[A-Z]$/,
        minAmount: 100,
        maxAmount: 5000,
        processingTime: 'Instant',
        charges: 0
      }
    ]
  }
];

const savedBillers = [
  { id: 1, name: 'Kenya Power', account: '12345678901', providerId: 'kplc-prepaid', categoryId: 'electricity', lastPaid: 'KES 2,500' },
  { id: 2, name: 'Safaricom Home Fibre', account: '0722123456', providerId: 'safaricom-home', categoryId: 'internet', lastPaid: 'KES 3,999' },
  { id: 3, name: 'DStv Premium', account: '7023456789', providerId: 'dstv', categoryId: 'tv', lastPaid: 'KES 8,900' },
  { id: 4, name: 'NHIF', account: 'NHIF12345', providerId: 'nhif', categoryId: 'insurance', lastPaid: 'KES 500' },
];

const recentPayments = [
  { id: 1, name: 'Kenya Power', amount: 2500, date: 'Jan 1, 2026', status: 'completed', provider: 'kplc-prepaid' },
  { id: 2, name: 'Safaricom Airtime', amount: 500, date: 'Dec 30, 2025', status: 'completed', provider: 'safaricom-airtime' },
  { id: 3, name: 'Zuku Internet', amount: 2999, date: 'Dec 28, 2025', status: 'completed', provider: 'zuku' },
  { id: 4, name: 'DSTV Compact', amount: 2900, date: 'Dec 25, 2025', status: 'completed', provider: 'dstv' },
];

export default function BillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBundle, setSelectedBundle] = useState<{ name: string; price: number; validity?: string } | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [verifiedAccount, setVerifiedAccount] = useState<{ name: string; balance?: string } | null>(null);
  const [saveAsBiller, setSaveAsBiller] = useState(false);

  // Filter categories based on search
  const filteredCategories = billCategories.filter(cat => 
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.providers.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Find provider across all categories
  const findProviderById = (providerId: string): { category: Category; provider: Provider } | null => {
    for (const cat of billCategories) {
      const provider = cat.providers.find(p => p.id === providerId);
      if (provider) {
        return { category: cat, provider };
      }
    }
    return null;
  };

  // Handle category selection
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setSelectedProvider(null);
    setStep(2);
  };

  // Handle provider selection
  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setAccountNumber('');
    setAmount('');
    setSelectedBundle(null);
    setAccountError('');
    setVerifiedAccount(null);
    setStep(3);
  };

  // Validate account number
  const validateAccount = (value: string) => {
    if (!selectedProvider) return;
    
    setAccountNumber(value);
    setAccountError('');
    setVerifiedAccount(null);

    if (value && !selectedProvider.accountRegex.test(value)) {
      setAccountError(`Invalid format. Expected: ${selectedProvider.accountFormat}`);
    }
  };

  // Simulate account verification
  const verifyAccount = async () => {
    if (!selectedProvider || !accountNumber) return;
    
    if (!selectedProvider.accountRegex.test(accountNumber)) {
      setAccountError(`Invalid format. Expected: ${selectedProvider.accountFormat}`);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock verification response
    const mockNames = ['John Mwangi', 'Mary Wanjiku', 'Peter Ochieng', 'Grace Nyambura'];
    const mockName = mockNames[Math.floor(Math.random() * mockNames.length)];
    
    setVerifiedAccount({ 
      name: mockName,
      balance: selectedCategory?.id === 'electricity' ? 'KES 1,250 (Arrears)' : undefined
    });
    setIsLoading(false);
    toast.success('Account verified successfully');
  };

  // Handle bundle selection
  const handleBundleSelect = (bundle: { name: string; price: number; validity?: string }) => {
    setSelectedBundle(bundle);
    setAmount(bundle.price.toString());
  };

  // Handle payment
  const handlePayBill = async () => {
    if (!selectedProvider || !accountNumber) {
      toast.error('Please enter account details');
      return;
    }

    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount < selectedProvider.minAmount) {
      toast.error(`Minimum amount is KES ${selectedProvider.minAmount.toLocaleString()}`);
      return;
    }

    if (payAmount > selectedProvider.maxAmount) {
      toast.error(`Maximum amount is KES ${selectedProvider.maxAmount.toLocaleString()}`);
      return;
    }

    setIsLoading(true);
    
    try {
      const { walletApi } = await import('@/lib/api');
      await walletApi.payBill({
        billType: selectedProvider.id,
        provider: selectedProvider.name,
        accountNumber,
        amount: payAmount
      });
      
      toast.success(
        <div>
          <p className="font-semibold">Payment Successful!</p>
          <p className="text-sm">KES {payAmount.toLocaleString()} paid to {selectedProvider.name}</p>
        </div>
      );

      if (saveAsBiller) {
        toast.success('Biller saved for quick access');
      }

      resetFlow();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saved biller selection
  const handlePaySavedBiller = (biller: typeof savedBillers[0]) => {
    const result = findProviderById(biller.providerId);
    if (result) {
      setSelectedCategory(result.category);
      setSelectedProvider(result.provider);
      setAccountNumber(biller.account);
      setStep(3);
      toast(`Paying ${biller.name}`);
    }
  };

  // Reset flow
  const resetFlow = () => {
    setSelectedCategory(null);
    setSelectedProvider(null);
    setAccountNumber('');
    setStudentId('');
    setAmount('');
    setSelectedBundle(null);
    setAccountError('');
    setVerifiedAccount(null);
    setSaveAsBiller(false);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-lg mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/wallet" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <HiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Pay Bills</h1>
              <p className="text-gray-500 text-sm">Quick and secure bill payments</p>
            </div>
          </div>

          {/* Breadcrumbs */}
          {step > 1 && (
            <div className="flex items-center gap-2 mb-6 text-sm">
              <button onClick={resetFlow} className="text-primary-600 hover:underline">
                All Bills
              </button>
              {selectedCategory && (
                <>
                  <span className="text-gray-400">/</span>
                  <button 
                    onClick={() => { setStep(2); setSelectedProvider(null); setAccountError(''); setVerifiedAccount(null); }}
                    className="text-primary-600 hover:underline"
                  >
                    {selectedCategory.label}
                  </button>
                </>
              )}
              {selectedProvider && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">{selectedProvider.name}</span>
                </>
              )}
            </div>
          )}

          {/* Step 1: Categories */}
          {step === 1 && (
            <>
              {/* Search */}
              <div className="relative mb-6">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bills and services..."
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Saved Billers */}
              {savedBillers.length > 0 && !searchQuery && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <HiStar className="w-5 h-5 text-yellow-500" />
                      Saved Billers
                    </h3>
                    <button className="text-sm text-primary-600 hover:underline">Manage</button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {savedBillers.map((biller, index) => {
                      const categoryData = billCategories.find(c => c.id === biller.categoryId);
                      const Icon = categoryData?.icon || HiCreditCard;
                      
                      return (
                        <button
                          key={biller.id}
                          onClick={() => handlePaySavedBiller(biller)}
                          className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                            index !== savedBillers.length - 1 ? 'border-b' : ''
                          }`}
                        >
                          <div className={`w-10 h-10 ${categoryData?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{biller.name}</p>
                            <p className="text-sm text-gray-500 truncate">{biller.account}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Last paid</p>
                            <p className="font-medium text-primary-600">{biller.lastPaid}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bill Categories Grid */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">All Categories</h3>
                <div className="grid grid-cols-4 gap-3">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleSelectCategory(category)}
                      className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-center leading-tight">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Payments */}
              {recentPayments.length > 0 && !searchQuery && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <HiClock className="w-5 h-5 text-gray-400" />
                      Recent Payments
                    </h3>
                    <Link href="/wallet/history" className="text-sm text-primary-600 hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {recentPayments.map((payment, index) => (
                      <div
                        key={payment.id}
                        className={`p-4 flex items-center justify-between ${
                          index !== recentPayments.length - 1 ? 'border-b' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <HiCheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.name}</p>
                            <p className="text-sm text-gray-500">{payment.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KES {payment.amount.toLocaleString()}</p>
                          <button 
                            onClick={() => {
                              const result = findProviderById(payment.provider);
                              if (result) {
                                setSelectedCategory(result.category);
                                setSelectedProvider(result.provider);
                                setStep(3);
                              }
                            }}
                            className="text-xs text-primary-600 hover:underline"
                          >
                            Pay Again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 2: Provider Selection */}
          {step === 2 && selectedCategory && (
            <div className="space-y-4">
              {/* Category Header */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 ${selectedCategory.color} rounded-xl flex items-center justify-center`}>
                    <selectedCategory.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedCategory.label}</h3>
                    <p className="text-sm text-gray-500">{selectedCategory.description}</p>
                  </div>
                </div>
              </div>

              {/* Provider List */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <p className="font-medium text-gray-600">Select Provider</p>
                </div>
                {selectedCategory.providers.map((provider, index) => (
                  <button
                    key={provider.id}
                    onClick={() => handleSelectProvider(provider)}
                    className={`w-full p-4 flex items-center justify-between hover:bg-primary-50 transition-colors ${
                      index !== selectedCategory.providers.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <HiGlobe className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-xs text-gray-500">{provider.processingTime} • {provider.charges === 0 ? 'No charges' : `KES ${provider.charges} charge`}</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Payment Details */}
          {step === 3 && selectedProvider && (
            <div className="space-y-4">
              {/* Provider Info Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${selectedCategory?.color} rounded-xl flex items-center justify-center`}>
                    {selectedCategory && <selectedCategory.icon className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedProvider.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{selectedProvider.processingTime}</span>
                      <span>•</span>
                      <span>{selectedProvider.charges === 0 ? 'No service fee' : `KES ${selectedProvider.charges} fee`}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                    <HiShieldCheck className="w-3 h-3" />
                    <span>Secure</span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-semibold mb-4">Account Details</h4>
                
                {/* Account Number Input */}
                <div className="mb-4">
                  <label className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{selectedProvider.accountType}</span>
                    <span className="text-xs text-gray-400">{selectedProvider.accountFormat}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => validateAccount(e.target.value)}
                      placeholder={selectedProvider.accountPlaceholder}
                      className={`w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 transition-all ${
                        accountError ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-primary-500'
                      }`}
                    />
                    {accountNumber && !accountError && !verifiedAccount && (
                      <button
                        onClick={verifyAccount}
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 disabled:opacity-50"
                      >
                        {isLoading ? 'Verifying...' : 'Verify'}
                      </button>
                    )}
                  </div>
                  {accountError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <HiExclamationCircle className="w-3 h-3" />
                      {accountError}
                    </p>
                  )}
                  {verifiedAccount && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <HiCheckCircle className="w-4 h-4" />
                        <span className="font-medium">{verifiedAccount.name}</span>
                      </div>
                      {verifiedAccount.balance && (
                        <p className="text-sm text-gray-600 mt-1">{verifiedAccount.balance}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Student ID for School Fees */}
                {selectedProvider.requiresStudentId && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">Student/Admission Number</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Enter student ID"
                      className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Data Bundles Selection */}
                {selectedProvider.bundles && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">Select Bundle</label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProvider.bundles.map((bundle, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleBundleSelect(bundle)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            selectedBundle?.name === bundle.name
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <p className="font-medium text-sm">{bundle.name}</p>
                          <p className="text-primary-600 font-bold">KES {bundle.price}</p>
                          <p className="text-xs text-gray-500">{bundle.validity}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Package Selection for TV/Internet */}
                {selectedProvider.packages && !selectedProvider.bundles && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">Select Package</label>
                    <div className="space-y-2">
                      {selectedProvider.packages.map((pkg, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleBundleSelect(pkg)}
                          className={`w-full p-3 rounded-xl border-2 flex justify-between items-center transition-all ${
                            selectedBundle?.name === pkg.name
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <span className="font-medium">{pkg.name}</span>
                          <span className="font-bold text-primary-600">KES {pkg.price.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Amount</span>
                    <span className="text-xs text-gray-400">
                      Min: KES {selectedProvider.minAmount.toLocaleString()} • Max: KES {selectedProvider.maxAmount.toLocaleString()}
                    </span>
                  </label>
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl focus-within:ring-2 focus-within:ring-primary-500">
                    <span className="text-xl font-bold text-gray-400">KES</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="text-2xl font-bold w-full outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Quick Amounts for Airtime */}
                {selectedProvider.quickAmounts && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">Quick Amounts</label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProvider.quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          onClick={() => setAmount(quickAmount.toString())}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            amount === quickAmount.toString()
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 hover:bg-primary-100 hover:text-primary-600'
                          }`}
                        >
                          {quickAmount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save as Biller Checkbox */}
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    checked={saveAsBiller}
                    onChange={(e) => setSaveAsBiller(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium">Save as Quick Biller</p>
                    <p className="text-xs text-gray-500">Quick access for future payments</p>
                  </div>
                </label>

                {/* Payment Summary */}
                {amount && parseFloat(amount) > 0 && (
                  <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <HiInformationCircle className="w-5 h-5 text-primary-500" />
                      Payment Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-medium">KES {parseFloat(amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Fee</span>
                        <span className={selectedProvider.charges === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                          {selectedProvider.charges === 0 ? 'FREE' : `KES ${selectedProvider.charges}`}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary-600">
                          KES {(parseFloat(amount) + selectedProvider.charges).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={resetFlow}
                    className="flex-1 py-4 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayBill}
                    disabled={!accountNumber || !amount || !!accountError || isLoading}
                    className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <HiRefresh className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <HiCash className="w-5 h-5" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-sm">
                <HiShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-blue-800">
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-blue-600 text-xs">Your payment is encrypted and processed securely through our partners.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
