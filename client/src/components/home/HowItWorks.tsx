import { HiSearch, HiCalendar, HiCheckCircle, HiStar } from 'react-icons/hi';

const steps = [
  {
    icon: HiSearch,
    title: 'Search',
    description: 'Browse through thousands of verified service providers in your area.',
  },
  {
    icon: HiCalendar,
    title: 'Book',
    description: 'Choose your preferred date, time, and location for the service.',
  },
  {
    icon: HiCheckCircle,
    title: 'Confirm',
    description: 'Get instant confirmation and pay securely via M-Pesa or card.',
  },
  {
    icon: HiStar,
    title: 'Review',
    description: 'Rate your experience and help others find great service providers.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Book services in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-200 rotate-45"></div>
                </div>
              )}
              
              {/* Step Number */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-primary-100 rounded-full"></div>
                <div className="relative w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
