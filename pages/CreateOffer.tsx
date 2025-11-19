import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2, DollarSign, Calendar, Layers, Image as ImageIcon, Youtube, Eye, ArrowRight, Upload, X, Check, ZoomIn } from 'lucide-react';
import Cropper from 'react-easy-crop';
import heic2any from 'heic2any';
import { generateOfferDescription } from '../services/geminiService';
import { CATEGORIES } from '../constants';
import { PricingModel, Offer } from '../types';
import OfferCard from '../components/OfferCard';

interface CreateOfferProps {
  onNavigate: (path: string) => void;
}

// --- IMAGE PROCESSING HELPERS ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
}

const CreateOffer: React.FC<CreateOfferProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Media State
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  // Editor State
  const [isCropping, setIsCropping] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Pricing State
  const [pricingModel, setPricingModel] = useState<PricingModel>('one_time');
  const [price, setPrice] = useState('');
  const [setupFee, setSetupFee] = useState('');

  const handleGenerateDescription = async () => {
    if (!title) return;
    setIsGenerating(true);
    const desc = await generateOfferDescription(title, category);
    setDescription(desc);
    setIsGenerating(false);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsProcessingFile(true);

      try {
        let processableBlob = file;

        // Convert HEIC if necessary
        if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
           const result = await heic2any({
             blob: file,
             toType: 'image/jpeg',
             quality: 0.8
           });
           // heic2any returns Blob or Blob[]
           processableBlob = Array.isArray(result) ? result[0] : result;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setRawImageSrc(reader.result as string);
          setIsCropping(true);
          setIsProcessingFile(false);
        });
        reader.readAsDataURL(processableBlob);
      } catch (error) {
        console.error("Error processing image", error);
        setIsProcessingFile(false);
        alert("Could not process image. Please try a JPG or PNG.");
      }
    }
  };

  const saveCroppedImage = async () => {
    if (rawImageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(rawImageSrc, croppedAreaPixels);
        if (croppedImage) {
            setImageUrl(croppedImage);
            setIsCropping(false);
            setRawImageSrc(null);
            // Reset zoom/crop for next time
            setZoom(1);
            setCrop({ x: 0, y: 0 });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = () => {
    onNavigate('/dashboard');
  };

  // Construct preview object
  const previewOffer: Offer = {
    id: 'preview_1',
    vendorId: 'current_user',
    vendorName: 'Your Business Name', 
    title: title,
    description: description,
    category: category,
    pricingModel: pricingModel,
    price_cents: price ? parseFloat(price) * 100 : 0,
    setup_fee_cents: setupFee ? parseFloat(setupFee) * 100 : undefined,
    turnaround_time: 3,
    rating: 5.0, 
    image: imageUrl || 'https://via.placeholder.com/400x300?text=Your+Image',
    videoUrl: videoUrl,
    keywords: []
  };

  return (
    <div className="min-h-screen bg-brand-gray py-8 px-4 md:px-8 relative">
      
      {/* --- CROPPER MODAL --- */}
      {isCropping && rawImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-white z-10">
                <h3 className="font-bold text-lg">Adjust Image</h3>
                <button onClick={() => setIsCropping(false)} className="p-1 hover:bg-gray-100 rounded-full"><X /></button>
            </div>
            
            <div className="relative h-96 w-full bg-gray-900">
                <Cropper
                  image={rawImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
            </div>

            <div className="p-6 space-y-6 bg-white z-10">
                <div className="flex items-center gap-4">
                   <ZoomIn size={20} className="text-gray-400" />
                   <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                   />
                </div>
                
                <button 
                  onClick={saveCroppedImage}
                  className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-brand-blueDark transition-colors"
                >
                   <Check size={18} /> Apply Crop
                </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold text-brand-black">Create New Offer</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* --- FORM COLUMN --- */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Offer Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                placeholder="e.g., Exclusive Final Expense Transfers"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none bg-white transition-all"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Media Inputs */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image (16:9)</label>
                
                {!imageUrl ? (
                  <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-brand-blue hover:bg-blue-50 transition-all">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, image/heic, .heic"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center text-center">
                       {isProcessingFile ? (
                          <Loader2 className="animate-spin text-brand-blue mb-2" size={32} />
                       ) : (
                          <Upload className="text-gray-400 group-hover:text-brand-blue mb-2 transition-colors" size={32} />
                       )}
                       <span className="font-bold text-base text-brand-black group-hover:text-brand-blue">
                         {isProcessingFile ? 'Processing...' : 'Click to Upload Image'}
                       </span>
                       <span className="text-xs text-gray-400 mt-1">JPG, PNG, HEIC supported</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 group aspect-video bg-black">
                     <img src={imageUrl} alt="Cover" className="w-full h-full object-contain" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setRawImageSrc(imageUrl); setIsCropping(true); }}
                          className="bg-white text-brand-black px-3 py-2 rounded-full text-xs font-bold hover:bg-gray-100"
                        >
                          Reposition
                        </button>
                        <button 
                          onClick={() => setImageUrl('')}
                          className="bg-red-500 text-white px-3 py-2 rounded-full text-xs font-bold hover:bg-red-600"
                        >
                          Remove
                        </button>
                     </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Video (Optional)</label>
                <div className="relative">
                   <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     value={videoUrl}
                     onChange={(e) => setVideoUrl(e.target.value)}
                     className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                     placeholder="https://www.youtube.com/watch?v=..."
                   />
                </div>
                <p className="text-xs text-gray-400 mt-1">Add a demo video to increase conversion.</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Description</label>
                <button 
                  onClick={handleGenerateDescription}
                  disabled={!title || isGenerating}
                  className="flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-brand-blueDark disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  AI Assist
                </button>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                placeholder="Describe your service..."
              />
            </div>

            {/* Pricing Model */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Pricing Structure</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => setPricingModel('one_time')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${pricingModel === 'one_time' ? 'bg-brand-black text-white border-brand-black' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  <DollarSign size={20} className="mb-1" />
                  <span className="text-xs font-bold">One-Time</span>
                </button>
                <button
                  onClick={() => setPricingModel('subscription')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${pricingModel === 'subscription' ? 'bg-brand-black text-white border-brand-black' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  <Calendar size={20} className="mb-1" />
                  <span className="text-xs font-bold">Monthly</span>
                </button>
                <button
                  onClick={() => setPricingModel('hybrid')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${pricingModel === 'hybrid' ? 'bg-brand-black text-white border-brand-black' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  <Layers size={20} className="mb-1" />
                  <span className="text-xs font-bold">Hybrid</span>
                </button>
              </div>

              <div className="flex gap-4">
                 {pricingModel === 'hybrid' && (
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">One-Time Setup Fee</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                        <input 
                          type="number" 
                          value={setupFee}
                          onChange={(e) => setSetupFee(e.target.value)}
                          className="w-full pl-7 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                          placeholder="297.00"
                        />
                      </div>
                    </div>
                 )}
                 
                 <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      {pricingModel === 'one_time' ? 'Total Price' : 'Monthly Recurring Price'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-7 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        placeholder={pricingModel === 'one_time' ? '500.00' : '97.00'}
                      />
                    </div>
                 </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4">
              <button 
                onClick={handleSubmit}
                disabled={!title || !price}
                className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-blueDark transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                Publish Offer
                <ArrowRight size={20} />
              </button>
            </div>

          </div>

          {/* --- PREVIEW COLUMN --- */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="flex items-center gap-2 text-gray-500">
               <Eye size={20} />
               <span className="font-bold text-sm uppercase tracking-wider">Live Preview</span>
            </div>
            <OfferCard 
              offer={previewOffer} 
              onMessage={() => {}}
              isPreview={true}
            />
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800">
               <p className="font-bold mb-2">Pro Tip</p>
               <p className="leading-relaxed">
                 Offers with a video walkthrough convert <strong>3x higher</strong> than images alone. 
                 Make sure your pricing model is clear to avoid disputes.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateOffer;