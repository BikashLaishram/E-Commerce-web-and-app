import React, { useState } from 'react';
import { CartItem, Coupon } from '../../types';
import { NexoraAPIService } from '../../services/api';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  ShieldCheck,
  Truck,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: (appliedCoupon?: Coupon, discountAmount?: number) => void;
  onExploreShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreShop,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.price + item.variant.priceAdjustment;
    return acc + itemPrice * item.quantity;
  }, 0);

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const freeShippingThreshold = 150;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15.0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const estimatedTax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const finalTotal = Math.round((taxableAmount + shippingCost + estimatedTax) * 100) / 100;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const result = NexoraAPIService.validateCoupon(couponCode, subtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponCode('');
    } else {
      setCouponError(result.error || 'Invalid promotional code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-white/10 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0B0B0F] rounded-[7px] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-base">Your Cart</h3>
                <span className="text-xs text-zinc-400 font-mono">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} items selected
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-black/40 border-b border-white/5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  {subtotal >= freeShippingThreshold ? (
                    <strong className="text-cyan-300">You unlocked Free Worldwide Express Air!</strong>
                  ) : (
                    <span>
                      Add <strong>${(freeShippingThreshold - subtotal).toFixed(2)}</strong> for Free Express
                    </span>
                  )}
                </span>
                <span className="font-mono text-zinc-500 text-[11px]">${freeShippingThreshold} goal</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-zinc-600" />
                </div>
                <h4 className="font-heading font-bold text-white text-base mb-1">
                  Your cart is empty
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Explore our 3D interactive hardware models and select your favorite futuristic gear.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreShop();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-xs transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.price + item.variant.priceAdjustment;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl glass-card border border-white/10 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-xl bg-black/50 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-xs text-white truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-zinc-400">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.variant.colorHex }}
                        />
                        <span>{item.variant.name}</span>
                      </div>
                      <div className="mt-1 font-mono font-bold text-sm text-cyan-300">
                        ${itemPrice.toFixed(2)}
                      </div>
                    </div>

                    {/* Stepper & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center glass-panel rounded-lg border border-white/10 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 space-y-4 bg-black/60">
              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-${discountAmount.toFixed(2)})</span>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-zinc-400 hover:text-white text-xs underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo code (try NEXORA20)"
                      className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
              </div>

              {/* Subtotal Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-cyan-400 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-white">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Express Shipping</span>
                  <span className="font-mono text-white">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="font-heading font-black text-lg text-cyan-300">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to checkout button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout(appliedCoupon || undefined, discountAmount);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
