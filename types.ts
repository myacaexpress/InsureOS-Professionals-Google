export enum UserRole {
  AGENT = 'agent',
  VENDOR = 'vendor',
  GUEST = 'guest'
}

export interface User {
  uid: string;
  role: UserRole; // The currently active role
  roles: UserRole[]; // All roles the user has signed up for
  displayName: string;
  email?: string;
  phone?: string;
  businessPhone?: string; // Vendor only (optional secondary contact)
  badges: string[];
  npn?: string; // Agent only
  businessName?: string; // Vendor only
  stripeAccountId?: string; // Vendor only
}

export type PricingModel = 'one_time' | 'subscription' | 'hybrid';

export interface Offer {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  category: string;
  pricingModel: PricingModel;
  price_cents: number; // Base price or Monthly recurring price
  setup_fee_cents?: number; // Optional setup fee for hybrid models
  turnaround_time: number;
  rating: number;
  image?: string;
  videoUrl?: string; // Optional YouTube link
  keywords: string[];
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: number;
  activeOrderId: string | null;
  offerContext?: {
    title: string;
    price: number;
    pricingModel: PricingModel;
    setupFee?: number;
  };
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export enum OrderStatus {
  FUNDED = 'funded',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  DISPUTED = 'disputed'
}

export interface Order {
  id: string;
  conversationId: string;
  buyerId: string;
  sellerId: string;
  amount_total: number;
  status: OrderStatus;
}
