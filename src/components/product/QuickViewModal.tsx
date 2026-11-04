import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import { X, Star, ShoppingBag, Eye, Heart, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product;
  wishlist: string[];
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  onViewFullDetails: (product: Product) => void;
  onOpenAR: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  wishlist,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onViewFullDetails,
  onOpenAR,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = wishlist.includes(product.id);
  const currentPrice = product.price + selectedVariant.priceAdjustment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl glass-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          {/* 3D Viewer Half */}
          <div className="relative bg-[#0E0E16] min-h-[360px] md:min-h-[480px]">
            <ProductViewer3D
              modelType={product.modelType}
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantChange={(v) => setSelectedVariant(v)}
              onOpenAR={onOpenAR}
              height="100%"
            />
          </div>

          {/* Details Half */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-cyan-400 uppercase tracking-wider">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-heading font-black text-white leading-snug">
                {product.name}
              </h2>

              <p className="text-zinc-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 my-4">
                <span className="font-heading font-black text-2xl text-white">
                  ${currentPrice.toFixed(2)}
                </span>
                {product.originalPrice > currentPrice && (
                  <span className="text-xs text-zinc-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Variants */}
              <div className="mb-4">
                <span className="text-xs text-zinc-400 block mb-2">
                  Finish: <strong className="text-white">{selectedVariant.name}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        selectedVariant.id === v.id
                          ? 'border-cyan-400 bg-cyan-950/40 text-white'
                          : 'border-white/10 glass-panel text-zinc-400'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedVariant, quantity);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (${(currentPrice * quantity).toFixed(2)})</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'glass-panel text-zinc-300 border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  onViewFullDetails(product);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl glass-panel text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Full 3D Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
