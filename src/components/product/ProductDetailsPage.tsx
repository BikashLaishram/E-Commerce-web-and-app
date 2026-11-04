import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Zap,
  Check,
  ChevronLeft,
  Smartphone,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  Send,
} from 'lucide-react';
import { NexoraAPIService } from '../../services/api';

interface ProductDetailsPageProps {
  product: Product;
  allProducts: Product[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenAR: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  allProducts,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onBack,
  onSelectProduct,
  onOpenAR,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'3d' | 'gallery'>('3d');
  const [zipCode, setZipCode] = useState('94107');
  const [zipEstimated, setZipEstimated] = useState('Thursday, Nov 06');
  const [addedNotice, setAddedNotice] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const currentPrice = product.price + selectedVariant.priceAdjustment;

  const handleZipCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim()) {
      setZipEstimated('Arrives in 2 business days via Nexora Express Air');
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewTitle.trim() && reviewComment.trim()) {
      NexoraAPIService.addReview(product.id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewSubmitted(true);
      setReviewTitle('');
      setReviewComment('');
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      {/* Main Grid: Left 3D Viewer/Gallery + Right Specs/Purchase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Visual Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Mode Switcher: 3D Studio vs Photography */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 glass-panel rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('3d')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === '3d'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Interactive 3D Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Photo Gallery
              </button>
            </div>

            <button
              onClick={onOpenAR}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-400/30 text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preview in AR</span>
            </button>
          </div>

          {/* Viewer Area */}
          {activeTab === '3d' ? (
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <ProductViewer3D
                modelType={product.modelType}
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={(v) => setSelectedVariant(v)}
                onOpenAR={onOpenAR}
                height="540px"
              />
            </div>
          ) : (
            <div className="w-full h-[540px] rounded-2xl bg-[#0E0E16] border border-white/10 p-6 flex items-center justify-center">
              <img
                src={product.images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {/* Quick 3D Explanatory Banner */}
          <div className="p-3.5 rounded-xl glass-card border border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Use mouse or finger to rotate 360°. Click "Explode Layers" below the model.</span>
            </span>
            <span className="text-cyan-400 font-mono text-[11px]">Three.js PBR</span>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                {product.brand} • {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-zinc-500 font-normal">
                  ({product.reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white leading-tight">
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-zinc-400 text-sm mt-1 mb-4 leading-relaxed">{product.tagline}</p>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-black/40 border border-white/10">
              <span className="font-heading font-black text-3xl text-white">
                ${currentPrice.toFixed(2)}
              </span>
              {product.originalPrice > currentPrice && (
                <>
                  <span className="text-sm text-zinc-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                    -{product.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Variant selector */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2.5">
                <span className="text-zinc-400">
                  Select Finish:{' '}
                  <strong className="text-white font-semibold">{selectedVariant.name}</strong>
                </span>
                <span className="text-cyan-400 font-mono">{selectedVariant.stock} in stock</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedVariant.id === v.id
                        ? 'bg-purple-600/20 border-cyan-400 text-white shadow-lg shadow-purple-600/10'
                        : 'glass-panel border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-1 ring-white/30"
                      style={{ backgroundColor: v.colorHex }}
                    />
                    <span>{v.name}</span>
                    {v.priceAdjustment > 0 && (
                      <span className="text-[10px] text-zinc-400">+${v.priceAdjustment}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center glass-panel rounded-xl border border-white/10 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-white text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCartClick}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/20 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedNotice ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                      : 'glass-panel text-zinc-300 border-white/10 hover:text-white'
                  }`}
                  title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={() => onBuyNow(product, selectedVariant, quantity)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Checkout (Buy Now)</span>
              </button>
            </div>

            {/* Estimated Delivery Zip Input */}
            <div className="mt-6 p-4 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Estimated Express Delivery</span>
              </div>
              <form onSubmit={handleZipCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter postal code"
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Check
                </button>
              </form>
              <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>{zipEstimated}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Reviews Tabs */}
      <div className="mt-16 pt-10 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Tech Specs */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Technical Architecture</span>
            </h3>
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex justify-between p-3.5 text-xs">
                  <span className="text-zinc-400">{spec.name}</span>
                  <span className="font-semibold text-white">{spec.value}</span>
                </div>
              ))}
              <div className="flex justify-between p-3.5 text-xs">
                <span className="text-zinc-400">Warranty</span>
                <span className="font-semibold text-cyan-300">{product.warranty}</span>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Submit Form */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span>Customer Reviews ({product.reviews.length})</span>
            </h3>

            {/* Write a Review Box */}
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              {reviewSubmitted ? (
                <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-cyan-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Your review has been verified and posted!</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Rate this product:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= reviewRating
                                ? 'text-amber-400 fill-current'
                                : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Review headline (e.g. Unbelievable precision!)"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts on build quality, 3D accuracy, and performance..."
                    required
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit Review</span>
                  </button>
                </form>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl glass-panel border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">{rev.userName}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h5 className="text-xs font-bold text-zinc-200">{rev.title}</h5>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
