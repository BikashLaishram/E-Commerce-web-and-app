import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Timer, Zap, Flame, ArrowRight, ShieldCheck } from 'lucide-react';

interface LimitedOfferCountdownProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const LimitedOfferCountdown: React.FC<LimitedOfferCountdownProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden glass-card border border-purple-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[250px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Flash Cyber Drop • Limited Stock</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-white leading-tight">
              {product.name}
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base mt-2 mb-6 max-w-xl">
              {product.tagline}. Exclusive launch allocation with complimentary titanium desk stand and 2-year express replacement warranty.
            </p>

            {/* Countdown Clocks */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              {[
                { label: 'Hours', value: String(timeLeft.hours).padStart(2, '0') },
                { label: 'Minutes', value: String(timeLeft.minutes).padStart(2, '0') },
                { label: 'Seconds', value: String(timeLeft.seconds).padStart(2, '0') },
              ].map((slot, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center font-heading font-black text-2xl sm:text-3xl text-cyan-300 shadow-inner">
                    {slot.value}
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 mt-1.5">
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Claimed Inventory Progress Bar */}
            <div className="w-full max-w-md mb-8">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-zinc-400">Claimed: <strong className="text-white">82%</strong></span>
                <span className="text-rose-400 font-semibold">Only {product.stock} units remaining</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-400 rounded-full w-[82%]" />
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-3xl text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-base text-zinc-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Claim Deal Now</span>
                </button>

                <button
                  onClick={() => onSelectProduct(product)}
                  className="p-3 rounded-xl glass-panel text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Inspect in 3D"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Product Image preview */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div
              onClick={() => onSelectProduct(product)}
              className="relative w-full max-w-[380px] aspect-square rounded-2xl bg-[#0F0F17] border border-white/10 p-6 flex items-center justify-center group cursor-pointer hover:border-cyan-400/40 transition-all shadow-2xl"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 text-[11px] font-semibold text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                Click to inspect in 3D
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
