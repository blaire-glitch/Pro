'use client';

import { useState, useRef, useEffect } from 'react';
import { HiX, HiPaperAirplane, HiSparkles, HiLightningBolt, HiChat, HiPhone, HiMail } from 'react-icons/hi';
import { ChatBotAvatar } from './ChatBotAvatar';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Quick action suggestions with icons
const quickActions = [
  { id: 'services', label: 'Our Services', icon: '✨', query: 'What services do you offer?' },
  { id: 'booking', label: 'How to Book', icon: '📅', query: 'How do I book a service?' },
  { id: 'payment', label: 'Payments', icon: '💳', query: 'What payment methods do you accept?' },
  { id: 'support', label: 'Get Help', icon: '🆘', query: 'I need to speak with customer support' },
];

// AI response logic
const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.match(/^(hi|hello|hey|jambo|habari|good morning|good afternoon|good evening)/)) {
    return "Hello! Welcome to Afrionex. I'm here to help you 24/7. What can I do for you today?";
  }
  
  if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you')) {
    return "We offer amazing services across Western Kenya:\n\n✨ Beauty - Hair, makeup, nails\n🏠 Home - Cleaning, repairs\n💆 Wellness - Massage, spa, fitness\n📸 Lifestyle - Events, photography\n🚚 Delivery - Fast & reliable\n\nWhat interests you?";
  }
  
  if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return "Booking is super easy!\n\n1️⃣ Find your service\n2️⃣ Pick a top-rated provider\n3️⃣ Choose date & time\n4️⃣ Pay with M-Pesa\n5️⃣ Get instant confirmation\n\nNeed help finding something?";
  }
  
  if (lowerMessage.includes('pay') || lowerMessage.includes('mpesa') || lowerMessage.includes('m-pesa') || lowerMessage.includes('airtel') || lowerMessage.includes('money')) {
    return "We accept:\n\n📱 M-Pesa - Fast & trusted\n📱 Airtel Money - Secure payments\n\nAll transactions are 100% secure. You can save your preferred method for quicker checkout!";
  }
  
  if (lowerMessage.includes('location') || lowerMessage.includes('city') || lowerMessage.includes('where') || lowerMessage.includes('kisumu') || lowerMessage.includes('kakamega') || lowerMessage.includes('bungoma') || lowerMessage.includes('busia')) {
    return "We're live in Western Kenya!\n\n📍 Kisumu\n📍 Kakamega\n📍 Bungoma\n📍 Busia\n\nMore cities coming soon! Where are you based?";
  }
  
  if (lowerMessage.includes('provider') || lowerMessage.includes('work with') || lowerMessage.includes('join') || lowerMessage.includes('earn')) {
    return "Want to earn with Afrionex?\n\n💰 Reach thousands of customers\n⏰ Work on your schedule\n💳 Get paid via mobile money\n📊 Free business tools\n\nJoin as a provider today!";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('fee')) {
    return "Prices vary by service & provider.\n\n✅ Compare rates easily\n✅ See prices upfront\n✅ No hidden fees\n✅ Get custom quotes\n\nWhat service are you looking for?";
  }
  
  if (lowerMessage.includes('cancel') || lowerMessage.includes('refund') || lowerMessage.includes('reschedule')) {
    return "Our flexible policy:\n\n✅ Free cancellation 24hrs before\n✅ Easy rescheduling\n✅ Refunds in 3-5 days\n\nNeed to modify a booking?";
  }
  
  if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('speak') || lowerMessage.includes('human') || lowerMessage.includes('agent') || lowerMessage.includes('call')) {
    return "I'm here for you!\n\n📧 support@afrionex.com\n📞 +254 700 000 000\n🕐 Humans: 8AM-8PM EAT\n🤖 AI: 24/7 always here\n\nHow can I help?";
  }
  
  if (lowerMessage.includes('account') || lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('login') || lowerMessage.includes('password')) {
    return "Account help:\n\n🆕 Sign Up - Quick & easy\n🔑 Login - Email & password\n🔄 Forgot password? Reset it\n⚙️ Settings in Dashboard\n\nWhat do you need?";
  }
  
  if (lowerMessage.includes('safe') || lowerMessage.includes('trust') || lowerMessage.includes('verified')) {
    return "Your safety matters!\n\n✅ All providers verified\n✅ ID checks required\n✅ Real-time tracking\n✅ Secure messaging\n✅ 24/7 support\n\nBook with confidence!";
  }
  
  if (lowerMessage.includes('afripass') || lowerMessage.includes('subscription') || lowerMessage.includes('premium') || lowerMessage.includes('unlock')) {
    return "Unlock AfriPass Premium!\n\n🚗 Transport services\n🛒 Marketplace access\n💰 Digital Wallet\n⚡ Priority booking\n🎁 Exclusive deals\n\nUpgrade your experience!";
  }
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('asante')) {
    return "You're welcome! 😊\n\nAnything else I can help with? I'm always here!";
  }
  
  if (lowerMessage.match(/(bye|goodbye|see you|goodnight|kwaheri)/)) {
    return "Goodbye! 👋\n\nThanks for chatting. Come back anytime! Have an amazing day!";
  }
  
  return "I can help you with:\n\n🔍 Finding services\n📅 Booking help\n💳 Payment questions\n👤 Account support\n\nTell me more about what you need!";
};

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! 👋 I'm your Afrionex assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 group transition-all duration-500 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open chat"
      >
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-ping opacity-30"></div>
          {/* Avatar container */}
          <div className="relative bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 p-1 rounded-full shadow-xl hover:shadow-2xl transition-shadow">
            <div className="bg-white rounded-full p-1">
              <ChatBotAvatar size="lg" />
            </div>
          </div>
          {/* Online badge */}
          <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            LIVE
          </div>
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] transition-all duration-500 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 p-4 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-1">
                  <ChatBotAvatar size="md" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Afrionex AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-white/90 text-xs font-medium">Always here to help</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <HiX className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[320px] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
                      <ChatBotAvatar size="sm" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-br-sm'
                      : 'bg-white text-gray-700 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100'
                  } px-4 py-2.5`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p
                    className={`text-[10px] mt-1.5 ${
                      message.sender === 'user' ? 'text-white/60' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start animate-fade-in">
                <div className="flex-shrink-0">
                  <div className="w-8 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
                    <ChatBotAvatar size="sm" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleSendMessage(action.query)}
                    className="flex items-center gap-2 px-3 py-2 text-xs bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl transition-all hover:shadow-sm text-gray-700 hover:text-primary-600"
                  >
                    <span>{action.icon}</span>
                    <span className="font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1.5">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center hover:from-primary-600 hover:to-secondary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                aria-label="Send message"
              >
                <HiPaperAirplane className="w-5 h-5 rotate-90" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <HiSparkles className="w-3 h-3 text-primary-400" />
              <p className="text-[10px] text-gray-400 font-medium">Powered by Afrionex AI</p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
