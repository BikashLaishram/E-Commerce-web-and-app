import React, { useState } from 'react';
import { Send, Check, ShieldCheck, Lock, Sparkles, Globe, Terminal } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#07070A] border-t border-white/10 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4 select-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/25">
                <div className="w-full h-full bg-[#0B0B0F] rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 text-lg">
                    NX
                  </span>
                </div>
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-wider text-white">
                NEXORA
              </span>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-sm">
              The premier destination for 3D interactive, animated e-commerce. Bridging cutting-edge hardware engineering, procedural WebGL, and frictionless spatial shopping.
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>256-Bit SSL Encrypted Endpoints</span>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Explore 3D
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trending')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Trending Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('new-arrivals')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Limited Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Engineering */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Engineering
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-purple-400 flex items-center gap-1.5 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin & SQL Server</span>
                </button>
              </li>
              <li>
                <span className="text-zinc-500">Three.js PBR Engine</span>
              </li>
              <li>
                <span className="text-zinc-500">RoomEnvironment PMREM</span>
              </li>
              <li>
                <span className="text-zinc-500">T-SQL 23 Table Relational</span>
              </li>
              <li>
                <span className="text-zinc-500">React Native Simulator</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-4">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-2">
              Cyberpunk Insider
            </h4>
            <p className="text-xs text-zinc-400 mb-4">
              Receive secret promotional codes, 3D prototype drops, and release notifications.
            </p>

            {isSubscribed ? (
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Subscribed! Use code <strong>NEXORA20</strong> at checkout for 20% off.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </form>
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-white/5">NEXORA20 (20% off)</span>
              <span className="px-2 py-0.5 rounded bg-white/5">CYBER50 ($50 off)</span>
            </div>
          </div>
        </div>

        {/* Payment Gateways & Secure Trust Strip */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 mr-2">Verified Gateways:</span>
            {['Stripe', 'Razorpay', 'UPI Direct', 'Visa', 'Mastercard', 'Cash on Delivery'].map(
              (badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                >
                  {badge}
                </span>
              )
            )}
          </div>

          <div className="text-xs text-zinc-500">
            © 2026 NEXORA Spatial Technologies Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
