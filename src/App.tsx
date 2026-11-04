/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  User,
  Order,
  Coupon,
  CategoryType,
  Model3DType,
} from './types';
import { NexoraAPIService } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { LimitedOfferCountdown } from './components/home/LimitedOfferCountdown';
import { Interactive3DShowcase } from './components/home/Interactive3DShowcase';
import { Testimonials } from './components/home/Testimonials';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailsPage } from './components/product/ProductDetailsPage';
import { QuickViewModal } from './components/product/QuickViewModal';
import { ARPreviewModal } from './components/product/ARPreviewModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { MobileAppSimulator } from './components/layout/MobileAppSimulator';
import { Check, Heart, ShoppingBag, Sparkles } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User>(NexoraAPIService.getCurrentUser());

  // Navigation & View States
  const [currentNav, setCurrentNav] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [arPreviewProduct, setArPreviewProduct] = useState<Product | null>(null);

  // Checkout coupon memory
  const [checkoutCoupon, setCheckoutCoupon] = useState<Coupon | undefined>(undefined);
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);

  // Micro Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshData = () => {
    setProducts(NexoraAPIService.getProducts());
    setCart(NexoraAPIService.getCart());
    setWishlist(NexoraAPIService.getWishlist());
    setUser(NexoraAPIService.getCurrentUser());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Sync theme class with body element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // Cart operations
  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const selectedVariant = variant || product.variants[0];
    const updatedCart = NexoraAPIService.addToCart(product, selectedVariant, quantity);
    setCart([...updatedCart]);
    showToast(`Added ${product.name} to cart`);
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    const updatedCart = NexoraAPIService.updateCartQuantity(itemId, quantity);
    setCart([...updatedCart]);
  };

  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = NexoraAPIService.removeFromCart(itemId);
    setCart([...updatedCart]);
    showToast('Item removed from cart');
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    const updated = NexoraAPIService.toggleWishlist(productId);
    setWishlist([...updated]);
    const isNowInWishlist = updated.includes(productId);
    showToast(isNowInWishlist ? 'Saved to 3D Wishlist' : 'Removed from Wishlist');
  };

  // Direct Buy Now Trigger
  const handleBuyNow = (product: Product, variant: ProductVariant, quantity: number) => {
    handleAddToCart(product, variant, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Navigation helper
  const handleNavigate = (tab: string, category?: CategoryType) => {
    setSelectedProduct(null);
    setCurrentNav(tab);
    if (category) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHeroModel = (modelType: Model3DType) => {
    const match = products.find((p) => p.modelType === modelType);
    if (match) {
      setSelectedProduct(match);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProceedToCheckout = (coupon?: Coupon, discount?: number) => {
    setCheckoutCoupon(coupon);
    setCheckoutDiscount(discount || 0);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    refreshData();
  };

  const featuredDealProduct = products.find((p) => p.limitedDeal) || products[0];

  return (
    <div className={`min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col font-sans bg-cyber-grid`}>
      {/* Top Navbar */}
      <Navbar
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onToggleMobileSimulator={() => setIsMobileSimulatorOpen(!isMobileSimulatorOpen)}
        isMobileSimulatorActive={isMobileSimulatorOpen}
        currentNav={currentNav}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && currentNav !== 'shop') {
            setCurrentNav('shop');
          }
        }}
      />

      {/* Micro Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl glass-panel border border-cyan-400/40 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {selectedProduct ? (
          /* Product Details Page */
          <ProductDetailsPage
            product={selectedProduct}
            allProducts={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onBack={() => setSelectedProduct(null)}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAR={() => setArPreviewProduct(selectedProduct)}
          />
        ) : currentNav === 'shop' || currentNav === 'trending' || currentNav === 'new-arrivals' || currentNav === 'offers' ? (
          /* Shop / Catalog Page */
          <ShopPage
            products={
              currentNav === 'trending'
                ? products.filter((p) => p.trending)
                : currentNav === 'new-arrivals'
                ? products.filter((p) => p.isNew)
                : currentNav === 'offers'
                ? products.filter((p) => p.discountPercent > 0)
                : products
            }
            wishlist={wishlist}
            initialCategory={selectedCategory}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p, v) => handleAddToCart(p, v)}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        ) : (
          /* Homepage */
          <div className="space-y-6">
            {/* 3D Hero Section */}
            <HeroSection
              onExplore={() => handleNavigate('shop')}
              onShopNow={() => handleNavigate('shop')}
              onSelectHeroModel={handleSelectHeroModel}
            />

            {/* Featured Categories Grid */}
            <FeaturedCategories
              onSelectCategory={(cat) => handleNavigate('shop', cat)}
            />

            {/* Featured Products */}
            {products.length > 0 && (
              <FeaturedProducts
                products={products.filter((p) => p.featured).slice(0, 4)}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={(p, v) => handleAddToCart(p, v)}
                onSelectProduct={(p) => setSelectedProduct(p)}
                title="Pioneering 3D Drops"
                subtitle="High-fidelity spatial engineering rendered in real-time WebGL"
              />
            )}

            {/* Limited Offer Countdown Banner */}
            {featuredDealProduct && (
              <LimitedOfferCountdown
                product={featuredDealProduct}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
              />
            )}

            {/* Interactive 3D Disassembly Showcase */}
            <Interactive3DShowcase
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenAR={() => setArPreviewProduct(products[0])}
            />

            {/* Best Sellers & Trending Section */}
            {products.length > 0 && (
              <FeaturedProducts
                products={products.filter((p) => p.trending).slice(0, 4)}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={(p, v) => handleAddToCart(p, v)}
                onSelectProduct={(p) => setSelectedProduct(p)}
                title="Trending Across the Meta-Grid"
                subtitle="Top rated hardware chosen by digital designers & cyberpunk collectors"
              />
            )}

            {/* Verified Buyer Testimonials */}
            <Testimonials />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
        onExploreShop={() => handleNavigate('shop')}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        user={user}
        appliedCoupon={checkoutCoupon}
        discountAmount={checkoutDiscount}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Quick View Live 3D Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          wishlist={wishlist}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onViewFullDetails={(p) => setSelectedProduct(p)}
          onOpenAR={() => setArPreviewProduct(quickViewProduct)}
        />
      )}

      {/* Simulated AR Camera Preview Modal */}
      {arPreviewProduct && (
        <ARPreviewModal
          product={arPreviewProduct}
          onClose={() => setArPreviewProduct(null)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          showToast(`Welcome back, ${loggedUser.name}!`);
        }}
      />

      {/* User Profile & Orders Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onLogout={() => {
          setUser(NexoraAPIService.getCurrentUser());
          showToast('Signed out successfully');
        }}
        products={products}
        wishlist={wishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {/* Admin Portal & SQL Database Schema Explorer */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onRefreshData={refreshData}
      />

      {/* React Native / Expo Mobile App Phone Simulator */}
      <MobileAppSimulator
        isOpen={isMobileSimulatorOpen}
        onClose={() => setIsMobileSimulatorOpen(false)}
        products={products}
        user={user}
        cart={cart}
        wishlist={wishlist}
        onAddToCart={(p, v) => handleAddToCart(p, v)}
        onToggleWishlist={handleToggleWishlist}
        onOpenAR={() => setArPreviewProduct(products[0])}
      />
    </div>
  );
}
