import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, ShieldCheck, CheckCircle, Clock, PackageCheck, CreditCard, Repeat } from 'lucide-react';
import { MOCK_CONVERSATIONS } from '../constants';
import { Conversation, Message, OrderStatus, User, UserRole } from '../types';
import { motion } from 'framer-motion';

interface InboxProps {
  user: User;
}

const Inbox: React.FC<InboxProps> = ({ user }) => {
  // In a real app, you'd fetch conversations involving the user.
  // For this demo, we use the mock conversation. 
  const [activeConv, setActiveConv] = useState<Conversation>(MOCK_CONVERSATIONS[0]);
  const [input, setInput] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [activeOrderStatus, setActiveOrderStatus] = useState<OrderStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv.messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user.uid,
      text: input,
      timestamp: Date.now()
    };
    setActiveConv({
      ...activeConv,
      messages: [...activeConv.messages, newMsg]
    });
    setInput('');
  };

  // --- AGENT ACTIONS ---
  const handleFundProject = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setActiveOrderStatus(OrderStatus.FUNDED);
      
      let systemText = `${user.displayName} funded $${activeConv.offerContext?.price.toFixed(2)} into Escrow.`;
      
      if (activeConv.offerContext?.pricingModel === 'subscription') {
        systemText = `${user.displayName} started a subscription for $${activeConv.offerContext?.price.toFixed(2)}/mo.`;
      } else if (activeConv.offerContext?.pricingModel === 'hybrid') {
        systemText = `${user.displayName} paid setup fee ($${activeConv.offerContext?.setupFee}) and subscribed at $${activeConv.offerContext?.price.toFixed(2)}/mo.`;
      }

      const sysMsg: Message = {
        id: Date.now().toString(),
        senderId: 'system',
        text: systemText,
        timestamp: Date.now(),
        isSystem: true
      };
      setActiveConv(prev => ({ ...prev, messages: [...prev.messages, sysMsg] }));
    }, 2000);
  };

  const handleApproveRelease = () => {
      setActiveOrderStatus(OrderStatus.COMPLETED);
      const sysMsg: Message = {
        id: Date.now().toString(),
        senderId: 'system',
        text: 'Work approved. Funds released to Vendor.',
        timestamp: Date.now(),
        isSystem: true
      };
      setActiveConv(prev => ({ ...prev, messages: [...prev.messages, sysMsg] }));
  };

  // --- VENDOR ACTIONS ---
  const handleMarkDelivered = () => {
    // In a real app, this would trigger a status change requiring Agent approval
    // For the MVP flow, we'll keep it simple or assume it notifies the agent
    const sysMsg: Message = {
        id: Date.now().toString(),
        senderId: 'system',
        text: 'Vendor marked the order as Delivered. Waiting for Agent approval.',
        timestamp: Date.now(),
        isSystem: true
      };
      setActiveConv(prev => ({ ...prev, messages: [...prev.messages, sysMsg] }));
  };

  // Helper to get button text based on pricing model
  const getFundingButtonText = () => {
    if (isPaymentProcessing) return 'Processing...';
    
    const ctx = activeConv.offerContext;
    if (!ctx) return 'Fund Project';

    if (ctx.pricingModel === 'subscription') {
      return `Subscribe ($${ctx.price}/mo)`;
    }
    if (ctx.pricingModel === 'hybrid') {
      return `Pay Setup ($${ctx.setupFee}) & Subscribe`;
    }
    return `Fund $${(ctx.price * 1.05).toFixed(2)}`; // Including 5% fee for visual accuracy
  };

  return (
    <div className="flex h-[calc(100vh-73px)] bg-brand-gray overflow-hidden">
      {/* --- Sidebar (Conversation List) --- */}
      <div className="w-80 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-xl text-brand-black">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONVERSATIONS.map(conv => (
            <div 
              key={conv.id}
              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${activeConv.id === conv.id ? 'bg-blue-50/50' : ''}`}
              onClick={() => setActiveConv(conv)}
            >
              <div className="flex justify-between mb-1">
                <span className="font-bold text-sm text-brand-black">
                   {user.role === UserRole.AGENT ? 'Acme Marketing' : 'James Bond'}
                </span>
                <span className="text-xs text-gray-400">2m ago</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{conv.activeOrderId ? 'Active Order: High Intent Leads' : conv.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Chat Area --- */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between shadow-sm z-10">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
                {user.role === UserRole.AGENT ? 'A' : 'J'}
             </div>
             <div>
               <h3 className="font-bold text-brand-black leading-tight">
                 {user.role === UserRole.AGENT ? 'Acme Marketing' : 'James Bond'}
               </h3>
               <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                 {user.role === UserRole.AGENT && <span>🏆 Top Rated</span>}
                 {user.role === UserRole.AGENT && <span className="text-gray-300">|</span>}
                 <span className="text-gray-500">Online now</span>
               </div>
             </div>
           </div>
           
           {activeConv.offerContext && (
             <div className="hidden lg:block text-right">
               <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Context</p>
               <div className="text-sm font-medium text-brand-black flex items-center justify-end gap-2">
                 {activeConv.offerContext.pricingModel === 'subscription' && <Repeat size={14} className="text-brand-blue" />}
                 {activeConv.offerContext.title} 
                 <span className="font-bold text-brand-blue">
                   (${activeConv.offerContext.price})
                 </span>
               </div>
             </div>
           )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {activeConv.messages.map(msg => {
            // Determine alignment based on current user
            const isMe = msg.senderId === user.uid; 
            
            if (msg.isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                    {msg.text}
                  </span>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-brand-blue text-white rounded-tr-sm' : 'bg-white text-brand-black rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Action Bar (The "Trust Loop" Driver) */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-white border-t border-gray-200 p-4 z-20"
        >
          {/* 1. NO ACTIVE ORDER */}
          {!activeOrderStatus && (
             <div className="mb-4 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
               {user.role === UserRole.AGENT ? (
                 /* AGENT VIEW: FUND BUTTON */
                 <>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-brand-blue" size={24} />
                        <div>
                        <p className="font-bold text-brand-blue text-sm">Secure Transaction</p>
                        <p className="text-xs text-blue-600">
                          {activeConv.offerContext?.pricingModel === 'one_time' 
                            ? 'Funds held in Escrow until you approve.' 
                            : 'Secure subscription setup via Stripe.'}
                        </p>
                        </div>
                    </div>
                    <button 
                        onClick={handleFundProject}
                        disabled={isPaymentProcessing}
                        className="bg-brand-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                    >
                        <CreditCard size={16} />
                        {getFundingButtonText()}
                    </button>
                 </>
               ) : (
                 /* VENDOR VIEW: WAITING STATE */
                 <div className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-blue-100 text-brand-blue rounded-full">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-brand-black text-sm">Waiting for Funding</p>
                        <p className="text-xs text-gray-500">You will be notified when the agent funds the project into Escrow.</p>
                    </div>
                 </div>
               )}
             </div>
          )}

          {/* 2. FUNDED STATE */}
          {activeOrderStatus === OrderStatus.FUNDED && (
             <div className="mb-4 bg-green-50 border border-green-100 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                    <ShieldCheck size={18} />
                    {activeConv.offerContext?.pricingModel === 'one_time' 
                      ? 'Funds Secured in Escrow.' 
                      : 'Subscription Active.'}
                    <span className="hidden sm:inline"> {user.role === UserRole.VENDOR ? 'You can start working.' : 'Vendor is working.'}</span>
                </div>
                
                {user.role === UserRole.AGENT && (
                    <button onClick={handleApproveRelease} className="text-sm font-bold underline hover:text-green-900">
                        Approve & Release
                    </button>
                )}
                
                {user.role === UserRole.VENDOR && (
                    <button onClick={handleMarkDelivered} className="flex items-center gap-1 text-sm font-bold bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700">
                        <PackageCheck size={16} />
                        Mark Delivered
                    </button>
                )}
             </div>
          )}

          {/* 3. COMPLETED STATE */}
          {activeOrderStatus === OrderStatus.COMPLETED && (
             <div className="mb-4 bg-gray-100 p-3 rounded-xl flex items-center justify-center gap-2 text-gray-600 text-sm font-medium">
               <CheckCircle size={18} />
               Transaction Completed. Funds released.
             </div>
          )}

          {/* Input Area */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-blue/20 rounded-full px-4 py-2.5 text-sm outline-none transition-all"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="p-2.5 bg-brand-blue text-white rounded-full hover:bg-brand-blueDark transition-colors shadow-lg shadow-blue-500/30"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Inbox;