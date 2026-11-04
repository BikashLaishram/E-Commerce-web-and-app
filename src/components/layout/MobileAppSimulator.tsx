import React, { useState } from 'react';
import { Product, ProductVariant, User, CartItem, Order } from '../../types';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import {
  Smartphone,
  X,
  Home,
  Grid,
  Heart,
  User as UserIcon,
  ShoppingBag,
  Bell,
  Search,
  Sparkles,
  ChevronRight,
  Star,
  Camera,
  Layers,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface MobileAppSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  user: User;
  cart: CartItem[];
  wishlist: string[];
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenAR: () => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  isOpen,
  onClose,
  products,
  user,
  cart,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onOpenAR,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'ar' | 'cart' | 'profile'>('home');
  const [selectedMobileProduct, setSelectedMobileProduct] = useState<Product | null>(null);
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(
    '⚡ Flash Drop: Cyber-Pulse X9 now has 20% discount with code NEXORA20'
  );

  if (!isOpen) return null;

  const featured = products[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      {/* Container with Close button & header notice */}
      <div className="relative flex flex-col items-center">
        {/* Floating Simulator Controls */}
        <div className="mb-4 flex items-center justify-between w-full max-w-[390px] px-2 text-white">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold font-heading">
              React Native / Expo Mobile App Simulator
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Realistic Mobile Device Frame */}
        <div className="relative w-[360px] sm:w-[390px] h-[760px] bg-[#0A0A0F] rounded-[48px] border-[10px] border-zinc-800 shadow-[0_0_50px_rgba(139,92,246,0.3)] overflow-hidden flex flex-col select-none">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-zinc-700" />
          </div>

          {/* Status Bar */}
          <div className="h-10 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-zinc-400 z-30 bg-black/60 backdrop-blur-md">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-4 h-2 rounded-sm border border-zinc-400 flex items-center p-0.5">
                <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Push Notification Banner */}
          {simulatedNotification && (
            <div className="mx-3 mt-1 p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 backdrop-blur-md flex items-center justify-between z-30 shadow-lg animate-slide-down">
              <div className="flex items-center gap-2 text-[10px] text-zinc-200">
                <Bell className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="line-clamp-1">{simulatedNotification}</span>
              </div>
              <button
                onClick={() => setSimulatedNotification(null)}
                className="text-zinc-400 hover:text-white text-xs ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Screen Body */}
          <div className="flex-1 overflow-y-auto pb-16">
            {selectedMobileProduct ? (
              /* Mobile Product Details View */
              <div className="p-4 space-y-4">
                <button
                  onClick={() => setSelectedMobileProduct(null)}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Explore</span>
                </button>

                <div className="h-64 rounded-2xl overflow-hidden border border-white/10 bg-[#0E0E16]">
                  <ProductViewer3D
                    modelType={selectedMobileProduct.modelType}
                    variants={selectedMobileProduct.variants}
                    selectedVariant={selectedMobileProduct.variants[0]}
                    height="100%"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-cyan-400 font-mono text-[10px] uppercase">
                      {selectedMobileProduct.brand}
                    </span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      {selectedMobileProduct.rating}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-white text-lg">
                    {selectedMobileProduct.name}
                  </h3>

                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    {selectedMobileProduct.description}
                  </p>

                  <div className="my-3 font-heading font-black text-2xl text-cyan-300">
                    ${selectedMobileProduct.price.toFixed(2)}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onAddToCart(selectedMobileProduct)}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                    <button
                      onClick={() => onToggleWishlist(selectedMobileProduct.id)}
                      className="p-3 rounded-xl glass-panel text-white"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'home' ? (
              /* Mobile Home Screen */
              <div className="p-4 space-y-5">
                {/* Mobile Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                      <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center font-bold text-xs text-white">
                        NX
                      </div>
                    </div>
                    <span className="font-heading font-black text-base text-white">NEXORA</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('cart')}
                      className="relative p-2 rounded-xl bg-white/5 text-zinc-300"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 text-black text-[9px] font-bold flex items-center justify-center">
                          {cart.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Hero 3D Card */}
                <div
                  onClick={() => setSelectedMobileProduct(featured)}
                  className="relative p-4 rounded-3xl bg-gradient-to-br from-purple-900/40 via-zinc-900 to-[#12121A] border border-purple-500/30 overflow-hidden cursor-pointer"
                >
                  <div className="relative z-10 space-y-1">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-bold uppercase">
                      3D Spatial Drop
                    </span>
                    <h3 className="font-heading font-black text-white text-base">
                      {featured.name}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-1">{featured.tagline}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-heading font-bold text-lg text-white">
                        ${featured.price.toFixed(2)}
                      </span>
                      <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                        <span>Inspect in 3D</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category horizontal scrolls */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                    Quick Categories
                  </span>
                  <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                    {['Audio', 'Sneakers', 'Watches', 'Drones', 'Phones'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveTab('catalog')}
                        className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold whitespace-nowrap border border-white/5"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Grid */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                    Trending Hardware
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {products.slice(1, 5).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedMobileProduct(p)}
                        className="p-3 rounded-2xl glass-card border border-white/10 flex flex-col justify-between cursor-pointer"
                      >
                        <div className="w-full aspect-square bg-black/40 rounded-xl p-2 mb-2 flex items-center justify-center">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <h4 className="font-bold text-xs text-white truncate">{p.name}</h4>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="font-mono text-cyan-300 text-xs font-bold">
                            ${p.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                            ★{p.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === 'catalog' ? (
              /* Mobile Catalog Screen */
              <div className="p-4 space-y-3">
                <h3 className="font-heading font-black text-lg text-white">Full 3D Catalog</h3>
                <div className="space-y-2.5">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedMobileProduct(p)}
                      className="p-3 rounded-2xl glass-card border border-white/10 flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-xl bg-black/50 p-1 flex items-center justify-center shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{p.name}</h4>
                        <span className="text-[10px] text-zinc-400 block">{p.category}</span>
                        <span className="font-mono text-cyan-300 font-bold text-xs">${p.price.toFixed(2)}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'ar' ? (
              /* Mobile AR Preview Screen */
              <div className="p-4 flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="font-heading font-black text-white text-lg">
                  Camera-Based AR Preview
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
                  Place high-fidelity 3D models into your physical room space using camera LiDAR tracking.
                </p>
                <button
                  onClick={onOpenAR}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs"
                >
                  Launch Mobile AR View
                </button>
              </div>
            ) : activeTab === 'cart' ? (
              /* Mobile Cart Screen */
              <div className="p-4 space-y-4">
                <h3 className="font-heading font-black text-white text-lg">Shopping Bag</h3>
                {cart.length === 0 ? (
                  <p className="text-zinc-500 text-center py-10 text-xs">No items in cart</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl glass-card flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-contain" />
                          <div>
                            <h4 className="font-bold text-xs text-white truncate w-36">{item.product.name}</h4>
                            <span className="text-[10px] text-zinc-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono text-cyan-300 font-bold text-xs">
                          ${((item.product.price + item.variant.priceAdjustment) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Mobile Profile Screen */
              <div className="p-4 space-y-4 text-center">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-cyan-500/50"
                />
                <h3 className="font-heading font-black text-white text-base">{user.name}</h3>
                <p className="text-zinc-400 text-xs">{user.email}</p>
                <div className="pt-4 space-y-2 text-left">
                  <div className="p-3 rounded-xl glass-panel text-xs text-white flex justify-between">
                    <span>Order Notifications</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                  <div className="p-3 rounded-xl glass-panel text-xs text-white flex justify-between">
                    <span>Biometric FaceID</span>
                    <span className="text-cyan-400 font-bold">Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Native Tab Navigation Bar */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-black/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-around z-40 px-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'catalog', icon: Grid, label: 'Shop' },
              { id: 'ar', icon: Camera, label: '3D AR' },
              { id: 'cart', icon: ShoppingBag, label: 'Cart' },
              { id: 'profile', icon: UserIcon, label: 'Profile' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedMobileProduct(null);
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  activeTab === tab.id ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Home indicator bar at bottom */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
