import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { MOCK_OFFERS, CATEGORIES } from '../constants';
import OfferCard from '../components/OfferCard';
import { Offer } from '../types';

interface BrowseProps {
  onNavigate: (path: string) => void;
}

const Browse: React.FC<BrowseProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredOffers = MOCK_OFFERS.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          offer.keywords.some(k => k.includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || offer.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-brand-gray p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-black mb-2">Browse Services</h1>
          <p className="text-gray-600">Find the perfect partner for your agency.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search for leads, CRM, coaching..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${activeCategory === 'All' ? 'bg-brand-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-brand-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredOffers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} onMessage={() => onNavigate('/inbox')} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <div className="inline-block p-4 bg-gray-200 rounded-full mb-4">
                <Filter size={32} className="text-gray-400" />
             </div>
             <h3 className="text-lg font-bold text-gray-900">No matches found</h3>
             <p className="text-gray-500">Try adjusting your search terms or category.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Browse;
