'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { chatApi } from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import {
  HiArrowLeft,
  HiPaperAirplane,
  HiPhotograph,
  HiDotsVertical,
  HiCheck,
  HiCheckCircle,
  HiSearch,
  HiChat,
  HiUserCircle,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  businessName?: string;
}

interface Conversation {
  id: string;
  customerId: string;
  providerId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  participant: Participant;
  unreadCount: number;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  attachments: string[];
  isRead: boolean;
  status: string;
  createdAt: string;
  sender?: Participant;
}

function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationIdParam = searchParams.get('conversation');
  
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize Socket.IO
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      newSocket.emit('join_room', user.id);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
      
      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? { ...conv, lastMessage: message.content, lastMessageAt: message.createdAt, unreadCount: conv.unreadCount + 1 }
            : conv
        )
      );
    });

    newSocket.on('user_typing', ({ userId }) => {
      if (selectedConversation) {
        const isOtherUser = 
          (selectedConversation.customerId === userId || selectedConversation.providerId === userId) &&
          userId !== user.id;
        if (isOtherUser) {
          setIsTyping(true);
        }
      }
    });

    newSocket.on('user_stopped_typing', () => {
      setIsTyping(false);
    });

    newSocket.on('messages_read', ({ conversationId }) => {
      if (selectedConversation?.id === conversationId) {
        setMessages((prev) =>
          prev.map((msg) => ({ ...msg, isRead: true, status: 'READ' }))
        );
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Fetch conversations
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/messages');
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await chatApi.getConversations();
        setConversations(response.data.data || []);
        
        // If conversation ID is in URL, select it
        if (conversationIdParam) {
          const conv = response.data.data?.find((c: Conversation) => c.id === conversationIdParam);
          if (conv) {
            setSelectedConversation(conv);
          }
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated, router, conversationIdParam]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await chatApi.getMessages(selectedConversation.id);
        setMessages(response.data.data?.messages || []);
        scrollToBottom();
        
        // Mark as read
        await chatApi.markAsRead(selectedConversation.id);
        
        // Update unread count
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );

        // Join conversation room for real-time updates
        socket?.emit('join_conversation', selectedConversation.id);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    return () => {
      socket?.emit('leave_conversation', selectedConversation.id);
    };
  }, [selectedConversation, socket]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      const response = await chatApi.sendMessage(selectedConversation.id, {
        content: messageContent,
      });
      
      setMessages((prev) => [...prev, response.data.data]);
      
      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: messageContent, lastMessageAt: new Date().toISOString() }
            : conv
        )
      );
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(messageContent);
    } finally {
      setSendingMessage(false);
      inputRef.current?.focus();
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (socket && selectedConversation && user) {
      socket.emit('typing_start', {
        conversationId: selectedConversation.id,
        userId: user.id,
      });
      
      // Stop typing after 2 seconds of inactivity
      setTimeout(() => {
        socket.emit('typing_stop', {
          conversationId: selectedConversation.id,
          userId: user.id,
        });
      }, 2000);
    }
  };

  // Format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) =>
    conv.participant?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-4">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>
            <div className="flex h-full">
              {/* Conversations List */}
              <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
                  <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                      <HiChat className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Start a conversation by messaging a service provider
                      </p>
                      <Link href="/search" className="text-primary-500 font-medium text-sm">
                        Browse Providers →
                      </Link>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                          selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="relative">
                          {conversation.participant?.avatar ? (
                            <img
                              src={conversation.participant.avatar}
                              alt={conversation.participant.firstName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-600 font-medium">
                                {conversation.participant?.firstName?.[0]}
                                {conversation.participant?.lastName?.[0]}
                              </span>
                            </div>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.participant?.businessName || 
                                `${conversation.participant?.firstName} ${conversation.participant?.lastName}`}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessageAt && formatTime(conversation.lastMessageAt)}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            {conversation.lastMessage || 'Start a conversation'}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <HiArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <Link
                        href={`/provider/${selectedConversation.providerId}`}
                        className="flex items-center gap-3 flex-1"
                      >
                        {selectedConversation.participant?.avatar ? (
                          <img
                            src={selectedConversation.participant.avatar}
                            alt={selectedConversation.participant.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium text-sm">
                              {selectedConversation.participant?.firstName?.[0]}
                              {selectedConversation.participant?.lastName?.[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <h2 className="font-medium text-gray-900">
                            {selectedConversation.participant?.businessName || 
                              `${selectedConversation.participant?.firstName} ${selectedConversation.participant?.lastName}`}
                          </h2>
                          {isTyping && (
                            <p className="text-xs text-primary-500">Typing...</p>
                          )}
                        </div>
                      </Link>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <HiDotsVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                      {messages.map((message) => {
                        const isOwnMessage = message.senderId === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                isOwnMessage
                                  ? 'bg-primary-500 text-white rounded-br-md'
                                  : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                              }`}
                            >
                              <p className="break-words">{message.content}</p>
                              <div className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-400'}`}>
                                <span className="text-xs">
                                  {formatTime(message.createdAt)}
                                </span>
                                {isOwnMessage && (
                                  message.isRead ? (
                                    <HiCheckCircle className="w-4 h-4 text-white" />
                                  ) : (
                                    <HiCheck className="w-4 h-4" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <HiPhotograph className="w-6 h-6 text-gray-500" />
                        </button>
                        <input
                          ref={inputRef}
                          type="text"
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                          }}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || sendingMessage}
                          className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HiPaperAirplane className="w-6 h-6 transform rotate-90" />
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                      <HiChat className="w-10 h-10 text-primary-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Messages</h2>
                    <p className="text-gray-500 max-w-sm">
                      Select a conversation to start chatting or browse service providers to start a new conversation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function MessagesPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <MessagesPage />
    </Suspense>
  );
}
