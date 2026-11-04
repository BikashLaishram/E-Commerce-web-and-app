import React from 'react';
import { Product, ProductVariant } from '../../types';
import { Star, Eye, Heart, ShoppingBag, Sparkles, Check } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onSelectProduct: (product: Product) => void;
  title?: string;
  subtitle?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelectProduct,
  title = 'Featured Innovations',
  subtitle = 'Pioneering designs engineered with precision 3D models',
}) => {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEXORA Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white">
            {title}
          </h2>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">{subtitle}</p>
        </div>
      </div>

      {/* Grid of 3D Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isWishlisted = wishlist.includes(product.id);
          const defaultVariant = product.variants[0];

          return (
            <div
              key={product.id}
              className="group glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col"
            >
              {/* Product Visual Container */}
              <div className="relative w-full aspect-square bg-[#0E0E15] overflow-hidden flex items-center justify-center p-4">
                {/* 3D Visual Tag */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    3D Interactive
                  </span>
                  {product.discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white w-fit">
                      -{product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-black/50 text-zinc-300 hover:text-white hover:bg-black/70'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Image with zoom hover effect */}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  onClick={() => onSelectProduct(product)}
                  className="w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-500 cursor-pointer"
                  loading="lazy"
                />

                {/* Quick View Button on Hover */}
                <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                  <button
                    onClick={() => onQuickView(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Quick 3D View</span>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-500 font-medium">{product.category}</span>
                    <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.rating}</span>
                      <span className="text-zinc-500 font-normal">({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-heading font-bold text-sm sm:text-base text-white hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-zinc-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                    {product.tagline}
                  </p>
                </div>

                {/* Variants swatches & Price */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-extrabold text-lg text-white">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-zinc-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1">
                      {product.variants.slice(0, 3).map((v) => (
                        <div
                          key={v.id}
                          className="w-3.5 h-3.5 rounded-full ring-1 ring-white/20"
                          style={{ backgroundColor: v.colorHex }}
                          title={v.colorName}
                        />
                      ))}
                      {product.variants.length > 3 && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          +{product.variants.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => onAddToCart(product, defaultVariant)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 text-white text-xs font-semibold border border-white/10 hover:border-transparent transition-all duration-300 cursor-pointer group/btn"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:text-white" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
