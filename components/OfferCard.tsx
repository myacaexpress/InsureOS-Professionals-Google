import React, { useState } from 'react';
import { Star, Play, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Offer } from '../types';

interface OfferCardProps {
  offer: Offer;
  onMessage: (offer: Offer) => void;
  isPreview?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onMessage, isPreview = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getPriceDisplay = () => {
    const price = (offer.price_cents / 100).toFixed(0);
    
    if (offer.pricingModel === 'subscription') {
      return `$${price}/mo`;
    }
    
    if (offer.pricingModel === 'hybrid' && offer.setup_fee_cents) {
      const setup = (offer.setup_fee_cents / 100).toFixed(0);
      return (
        <div className="flex flex-col items-end leading-tight">
          <span className="text-lg font-bold">${setup} <span className="text-xs font-normal text-gray-500">setup</span></span>
          <span className="text-xs font-medium text-gray-600">+ ${price}/mo</span>
        </div>
      );
    }

    return `$${price}`;
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1];
      }
      
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    } catch (e) {
      return null;
    }
  };

  const embedUrl = offer.videoUrl ? getYoutubeEmbedUrl(offer.videoUrl) : null;

  return (
    <motion.div 
      whileHover={isPreview ? {} : { y: -8 }}
      className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative"
    >
      {isPreview && (
        <div className="absolute -top-3 -right-3 bg-brand-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
          Preview Mode
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <span className="bg-blue-50 text-brand-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {offer.category}
        </span>
        <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
          <Star size={14} fill="currentColor" /> {offer.rating.toFixed(1)}
        </div>
      </div>
      
      <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-gray-100 relative group">
         {isPlaying && embedUrl ? (
           <div className="w-full h-full relative">
             <iframe 
               src={embedUrl} 
               className="w-full h-full absolute inset-0" 
               allow="autoplay; encrypted-media" 
               allowFullScreen
               title={offer.title}
             />
             <button 
               onClick={() => setIsPlaying(false)}
               className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 z-10"
             >
               <X size={14} />
             </button>
           </div>
         ) : (
           <>
             <img src={offer.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={offer.title} className="w-full h-full object-cover" />
             
             {embedUrl && (
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transform group-hover:scale-110 transition-transform">
                    <Play fill="currentColor" className="text-brand-black ml-1" size={20} />
                  </div>
               </div>
             )}
           </>
         )}
      </div>

      <h3 className="text-xl font-bold text-brand-black mb-1 line-clamp-2">{offer.title || "Untitled Offer"}</h3>
      <p className="text-sm text-gray-500 mb-3">by {offer.vendorName}</p>
      
      <p className="text-sm text-gray-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
        {offer.description || (isPreview ? "Description will appear here..." : "No description.")}
      </p>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
        <div>
          {typeof getPriceDisplay() === 'string' ? (
             <span className="text-lg font-bold">{getPriceDisplay()}</span>
          ) : (
            getPriceDisplay()
          )}
        </div>
        <button 
          onClick={() => !isPreview && onMessage(offer)}
          disabled={isPreview}
          className={`text-sm font-bold px-4 py-2 rounded-full transition-colors ${isPreview ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white'}`}
        >
          Message
        </button>
      </div>
    </motion.div>
  );
};

export default OfferCard;