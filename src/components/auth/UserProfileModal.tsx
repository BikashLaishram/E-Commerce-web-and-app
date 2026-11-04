import React, { useState } from 'react';
import { User, Order, Product, UserAddress } from '../../types';
import { NexoraAPIService } from '../../services/api';
import {
  X,
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  LogOut,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  ShoppingBag,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  products: Product[];
  wishlist: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  products,
  wishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newZip, setNewZip] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  if (!isOpen) return null;

  const orders = NexoraAPIService.getOrders();
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStreet && newCity && newZip) {
      NexoraAPIService.addAddress({
        id: `addr-${Date.now()}`,
        fullName: user.name,
        street: newStreet,
        city: newCity,
        state: 'CA',
        zipCode: newZip,
        country: 'United States',
        phone: user.phone || '+1 (555) 000-0000',
        isDefault: false,
      });
      setShowAddAddress(false);
      setNewStreet('');
      setNewCity('');
      setNewZip('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-white text-xl">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 px-6 gap-2 bg-black/30">
          {[
            { id: 'orders', label: 'Order History', icon: Package, count: orders.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: user.addresses.length },
            { id: 'wishlist', label: '3D Wishlist', icon: Heart, count: wishlistedProducts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-zinc-500 text-center py-10 text-xs">No orders placed yet.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono">{order.id}</strong>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-heading font-black text-sm text-white">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-white/5 pt-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <span className="text-zinc-300">
                            {item.productName} <span className="text-zinc-500">×{item.quantity}</span>
                          </span>
                          <span className="font-mono text-zinc-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Tracking: <strong className="text-zinc-300 font-mono">{order.trackingNumber}</strong></span>
                      <span>Delivery: <strong className="text-zinc-300">{order.estimatedDelivery}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-400">Delivery locations for 1-click checkout</span>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                  <input
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="Street line"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="City"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                    />
                    <input
                      type="text"
                      value={newZip}
                      onChange={(e) => setNewZip(e.target.value)}
                      placeholder="Zip Code"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="text-white text-xs">{addr.fullName}</strong>
                        {addr.isDefault && (
                          <span className="text-[10px] text-cyan-400 font-bold uppercase">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {addr.street}<br />
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-3">
              {wishlistedProducts.length === 0 ? (
                <p className="text-zinc-500 text-center py-10 text-xs">Your 3D wishlist is empty.</p>
              ) : (
                wishlistedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black/40 p-1 flex items-center justify-center shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-xs text-white">{p.name}</h4>
                        <span className="font-mono text-cyan-300 text-xs">${p.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="p-2 rounded-xl glass-panel text-zinc-300 hover:text-white"
                        title="Inspect in 3D"
                      >
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => {
                          onAddToCart(p);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
