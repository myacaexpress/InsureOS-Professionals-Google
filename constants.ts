import { Offer, User, UserRole, Conversation, OrderStatus } from './types';

export const MOCK_USER_AGENT: User = {
  uid: 'user_agent_1',
  role: UserRole.AGENT,
  roles: [UserRole.AGENT],
  displayName: 'James Bond',
  badges: ['Verified Payer'],
  npn: '1234567890'
};

export const MOCK_USER_VENDOR: User = {
  uid: 'user_vendor_1',
  role: UserRole.VENDOR,
  roles: [UserRole.VENDOR],
  displayName: 'Acme Marketing',
  badges: ['Top Rated'],
  businessName: 'Acme Marketing LLC',
  stripeAccountId: 'acct_123'
};

export const CATEGORIES = [
  "Inbound Call Vendor",
  "Marketer/Media Buyer",
  "Social Media Manager",
  "Coach",
  "Developer"
];

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'offer_1',
    vendorId: 'user_vendor_1',
    vendorName: 'Acme Marketing',
    title: 'High Intent Final Expense Transfers',
    description: 'Exclusive inbound transfers generated fresh daily. 100% TCPA compliant.',
    category: 'Inbound Call Vendor',
    pricingModel: 'one_time',
    price_cents: 50000, // $500.00
    turnaround_time: 3,
    rating: 4.9,
    image: 'https://picsum.photos/400/300?random=1',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ', // Mock video
    keywords: ['leads', 'expense', 'transfers', 'inbound']
  },
  {
    id: 'offer_2',
    vendorId: 'user_vendor_2',
    vendorName: 'TechFlow Systems',
    title: 'Full GHL Automation Setup',
    description: 'Complete GoHighLevel snapshot installation with workflows, pipelines, and calendars.',
    category: 'Developer',
    pricingModel: 'hybrid',
    price_cents: 9700, // $97/mo
    setup_fee_cents: 29700, // $297 setup
    turnaround_time: 2,
    rating: 5.0,
    image: 'https://picsum.photos/400/300?random=2',
    keywords: ['ghl', 'crm', 'automation', 'developer']
  },
  {
    id: 'offer_3',
    vendorId: 'user_vendor_3',
    vendorName: 'Sarah Jenkins',
    title: 'Weekly Sales Coaching',
    description: 'Ongoing weekly coaching sessions to refine your telesales script and handle objections.',
    category: 'Coach',
    pricingModel: 'subscription',
    price_cents: 15000, // $150/mo
    turnaround_time: 1,
    rating: 4.8,
    image: 'https://picsum.photos/400/300?random=3',
    keywords: ['sales', 'coaching', 'script']
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participants: ['user_agent_1', 'user_vendor_1'],
    lastMessage: 'Thanks, I will review the file.',
    updatedAt: Date.now() - 10000,
    activeOrderId: 'order_1',
    offerContext: {
      title: 'High Intent Final Expense Transfers',
      price: 500,
      pricingModel: 'one_time'
    },
    messages: [
      { id: 'm1', senderId: 'user_agent_1', text: 'Hi, are these calls fresh?', timestamp: Date.now() - 86400000 },
      { id: 'm2', senderId: 'user_vendor_1', text: 'Yes, generated live.', timestamp: Date.now() - 86000000 },
      { id: 'm3', senderId: 'system', text: 'James Bond funded $525.00 into Escrow.', timestamp: Date.now() - 4000000, isSystem: true },
      { id: 'm4', senderId: 'user_vendor_1', text: 'Great, getting to work.', timestamp: Date.now() - 3000000 },
    ]
  }
];
