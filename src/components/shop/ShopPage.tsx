import React, { useState, useMemo } from 'react';
import { Product, CategoryType, FilterState, ProductVariant } from '../../types';
import { CATEGORIES_LIST } from '../../data/mockData';
import { NexoraAPIService } from '../../services/api';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Star,
  Eye,
  Heart,
  ShoppingBag,
  Grid,
  List,
  Check,
  RotateCcw,
} from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  wishlist: string[];
  initialCategory?: CategoryType;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  wishlist,
  initialCategory = 'All',
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelectProduct,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    brand: '',
    minPrice: 0,
    maxPrice: 3000,
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured',
    searchQuery: '',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return list;
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return NexoraAPIService.filterProducts(products, filters);
  }, [products, filters]);

  const resetFilters = () => {
    setFilters({
      category: 'All',
      brand: '',
      minPrice: 0,
      maxPrice: 3000,
      minRating: 0,
      inStockOnly: false,
      sortBy: 'featured',
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.brand !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 3000 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-white">
          3D Interactive Catalog
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Explore our cyber-engineered hardware with real-time 3D interaction.
        </p>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilters({ ...filters, category: cat.name })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filters.category === cat.name
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30'
                  : 'glass-panel text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                Price Range (${filters.minPrice} - ${filters.maxPrice})
              </label>
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Brand Filter */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">Brand</label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                <button
                  onClick={() => setFilters({ ...filters, brand: '' })}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filters.brand === ''
                      ? 'bg-purple-600/30 text-purple-300 font-bold'
                      : 'text-zinc-400 hover:bg-white/5'
                  }`}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setFilters({ ...filters, brand: b })}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filters.brand === b
                        ? 'bg-purple-600/30 text-purple-300 font-bold'
                        : 'text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">Minimum Rating</label>
              <div className="flex items-center gap-1.5">
                {[0, 4, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilters({ ...filters, minRating: rating })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      filters.minRating === rating
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-black/30 text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    <span>{rating === 0 ? 'Any' : `${rating}★`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-2 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                  className="rounded bg-black/40 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-zinc-300">In-Stock Items Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Search + Count + Sort + Grid/List */}
          <div className="glass-panel p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-zinc-400">
              Showing <strong className="text-white">{filteredProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>

              {/* View mode toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-zinc-500'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white/15 text-white' : 'text-zinc-500'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white/10 text-zinc-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="glass-card p-12 rounded-3xl text-center border border-white/10">
              <p className="text-lg text-white font-bold mb-2">No products match your criteria</p>
              <p className="text-zinc-400 text-sm mb-6">
                Try clearing active filters or adjusting the price threshold.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Products Render */}
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const defaultVariant = product.variants[0];

              if (viewMode === 'list') {
                return (
                  <div
                    key={product.id}
                    className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-5 group hover:border-cyan-500/30 transition-all"
                  >
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="w-full sm:w-40 aspect-square bg-black/40 rounded-xl p-3 flex items-center justify-center cursor-pointer shrink-0"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                          <span>{product.category}</span>
                          <span>•</span>
                          <span className="text-amber-400 flex items-center gap-1 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {product.rating}
                          </span>
                        </div>
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="font-heading font-bold text-lg text-white hover:text-cyan-400 cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4 pt-3 border-t border-white/5">
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading font-extrabold text-xl text-white">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-zinc-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onQuickView(product)}
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Quick 3D</span>
                          </button>
                          <button
                            onClick={() => onAddToCart(product, defaultVariant)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Grid Card
              return (
                <div
                  key={product.id}
                  className="group glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/40 hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full aspect-square bg-[#0E0E15] overflow-hidden flex items-center justify-center p-4">
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                        3D Viewable
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-500 text-white'
                          : 'bg-black/50 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 cursor-pointer"
                    />

                    <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <button
                        onClick={() => onQuickView(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Quick 3D View</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-zinc-500 font-medium">{product.category}</span>
                        <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-heading font-bold text-base text-white hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-zinc-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                        {product.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-heading font-extrabold text-lg text-white">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1">
                          {product.variants.slice(0, 3).map((v) => (
                            <div
                              key={v.id}
                              className="w-3.5 h-3.5 rounded-full ring-1 ring-white/20"
                              style={{ backgroundColor: v.colorHex }}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(product, defaultVariant)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 text-white text-xs font-semibold border border-white/10 hover:border-transparent transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
