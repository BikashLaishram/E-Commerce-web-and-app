import React, { useState } from 'react';
import { CartItem, Coupon, User, UserAddress, Order, PaymentMethodType } from '../../types';
import { NexoraAPIService } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Download,
  Calendar,
  Building,
  Smartphone,
  Banknote,
  RotateCcw,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: User;
  appliedCoupon?: Coupon;
  discountAmount?: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  appliedCoupon,
  discountAmount = 0,
  onOrderSuccess,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(
    user.addresses[0] || {
      id: 'addr-temp',
      fullName: 'Alex Vance',
      street: '742 Cyberpunk Boulevard, Apt 14B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      phone: '+1 (555) 382-9104',
      isDefault: true,
    }
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form fields for address editing
  const [fullName, setFullName] = useState(selectedAddress.fullName);
  const [street, setStreet] = useState(selectedAddress.street);
  const [city, setCity] = useState(selectedAddress.city);
  const [state, setState] = useState(selectedAddress.state);
  const [zipCode, setZipCode] = useState(selectedAddress.zipCode);
  const [phone, setPhone] = useState(selectedAddress.phone);

  // Mock Card Details
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('999');

  // Mock UPI
  const [upiId, setUpiId] = useState('alex@okaxis');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.product.price + item.variant.priceAdjustment) * item.quantity;
  }, 0);

  const shippingCost = subtotal > 150 ? 0 : 15.0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const total = Math.round((taxableAmount + shippingCost + tax) * 100) / 100;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    const shippingAddress: UserAddress = {
      id: `addr-${Date.now()}`,
      fullName,
      street,
      city,
      state,
      zipCode,
      country: 'United States',
      phone,
    };

    setTimeout(() => {
      const order = NexoraAPIService.createOrder({
        items: cart,
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code,
        discount: discountAmount,
      });

      setIsProcessing(false);
      setCompletedOrder(order);
      onOrderSuccess(order);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#00E5FF', '#F43F5E', '#10B981'],
        });
      } catch (e) {
        // Fallback gracefully
      }
    }, 1400);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#0B0B0F] rounded-[10px] flex items-center justify-center">
                <Lock className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="font-heading font-black text-white text-lg">
                {completedOrder ? 'Order Confirmation' : 'Secure Checkout'}
              </h2>
              <span className="text-xs text-zinc-400">
                {completedOrder ? 'Order successfully logged & verified' : '256-Bit Encrypted Spatial Protocol'}
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

        {/* Completed Order Confirmation View */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold mb-2">
                ORDER ID: {completedOrder.id}
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
                Payment Received & Verified!
              </h3>
              <p className="text-zinc-400 text-sm mt-1 max-w-md">
                Thank you, <strong>{completedOrder.shippingAddress.fullName}</strong>. An email confirmation has been dispatched with tracking link.
              </p>
            </div>

            {/* Tracking Roadmap */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10">
              <div className="flex justify-between items-center mb-4 text-xs font-semibold">
                <span className="text-zinc-400">Tracking: <strong className="text-cyan-300">{completedOrder.trackingNumber}</strong></span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Est. Arrival: {completedOrder.estimatedDelivery}</span>
                </span>
              </div>

              {/* Status Steps */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { step: 'Order Placed', done: true },
                  { step: 'Processing', done: true },
                  { step: 'Air Cargo', done: false },
                  { step: 'Delivered', done: false },
                ].map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                        s.done
                          ? 'bg-cyan-500 text-black'
                          : 'bg-zinc-800 text-zinc-500 border border-white/10'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        s.done ? 'text-white' : 'text-zinc-500'
                      }`}
                    >
                      {s.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 divide-y divide-white/5">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.variantColorHex }}
                    />
                    <span className="text-white font-medium">{item.productName}</span>
                    <span className="text-zinc-500">×{item.quantity}</span>
                  </div>
                  <span className="font-mono text-cyan-300">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-3 flex justify-between text-sm font-bold text-white">
                <span>Total Paid</span>
                <span className="font-heading font-black text-cyan-300">
                  ${completedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handlePrintInvoice}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download / Print Invoice</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs transition-opacity hover:opacity-90 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Active Checkout Steps View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address Section */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>1. Shipping Destination</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500"
                  />
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street Address"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500"
                    />
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State / Province"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="Postal Code"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500"
                    />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Selector */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>2. Payment Gateway</span>
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'stripe', label: 'Stripe' },
                    { id: 'razorpay', label: 'Razorpay' },
                    { id: 'upi', label: 'UPI' },
                    { id: 'card', label: 'Cards' },
                    { id: 'netbanking', label: 'Net Banking' },
                    { id: 'cod', label: 'Cash on Delivery' },
                  ].map((gateway) => (
                    <button
                      key={gateway.id}
                      onClick={() => setPaymentMethod(gateway.id as PaymentMethodType)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        paymentMethod === gateway.id
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md'
                          : 'border-white/10 glass-panel text-zinc-400 hover:text-white'
                      }`}
                    >
                      {gateway.label}
                    </button>
                  ))}
                </div>

                {/* Gateway Specific Input Simulation */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
                  {paymentMethod === 'upi' ? (
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Enter UPI VPA ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white"
                      />
                    </div>
                  ) : paymentMethod === 'cod' ? (
                    <div className="text-[11px] text-zinc-400 leading-relaxed">
                      Cash on Delivery is verified via OTP upon arrival. Please keep cash or dynamic UPI QR ready.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Simulated Card Details</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono"
                        />
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Transactions are tokenized. Raw credentials are never stored.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Price Summary Bar */}
            <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs text-zinc-400">
                <div>Subtotal: <strong className="text-white">${subtotal.toFixed(2)}</strong></div>
                {discountAmount > 0 && <div>Discount: <strong className="text-cyan-400">-${discountAmount.toFixed(2)}</strong></div>}
                <div>Shipping: <strong className="text-white">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</strong></div>
                <div>Tax: <strong className="text-white">${tax.toFixed(2)}</strong></div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xs text-zinc-400">Total:</span>
                <span className="font-heading font-black text-2xl text-cyan-300">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Payment via {paymentMethod.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Place Order (${total.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
