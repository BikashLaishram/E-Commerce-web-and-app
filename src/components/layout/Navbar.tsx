import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Moon,
  Sun,
  Menu,
  X,
  Smartphone,
  ShieldAlert,
  Sparkles,
  Command,
} from 'lucide-react';
import { User, CartItem, CategoryType } from '../../types';
import { CATEGORIES_LIST } from '../../data/mockData';

interface NavbarProps {
  user: User;
  cartCount: number;
  wishlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onToggleMobileSimulator: () => void;
  isMobileSimulatorActive: boolean;
  currentNav: string;
  onNavigate: (tab: string, category?: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cartCount,
  wishlistCount,
  isDark,
  onToggleTheme,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onToggleMobileSimulator,
  isMobileSimulatorActive,
  currentNav,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'trending', label: 'Trending' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'offers', label: 'Offers' },
  ];

  const popularSearches = ['Headphones', 'Cyber Sneaker', 'Tourbillon Watch', '4K Drone', 'OLED Phone'];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo with 3D glowing cyber cube motif */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0B0B0F] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 group-hover:scale-125 transition-transform duration-500" />
              <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 text-xl tracking-tighter">
                NX
              </span>
            </div>
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl tracking-wider text-white flex items-center gap-1.5">
              NEXORA
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-zinc-400 uppercase -mt-1">
              3D Spatial Commerce
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentNav === link.id
                  ? 'text-white bg-white/10 shadow-inner'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Search Bar with Autocomplete & Trending tags */}
        <div className="relative hidden md:block flex-1 max-w-xs lg:max-w-sm">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search 3D catalog..."
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 glass-panel rounded-2xl shadow-2xl border border-white/10 z-50">
              <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block mb-2">
                Trending 3D Items
              </span>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onMouseDown={() => {
                      onSearchChange(term);
                      onNavigate('shop');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Press Enter to explore all</span>
                <span className="font-mono text-zinc-400">Ctrl + K</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile App Simulator Toggle */}
          <button
            onClick={onToggleMobileSimulator}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
              isMobileSimulatorActive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 hover:bg-white/10 text-cyan-300 border-cyan-500/30'
            }`}
            title="Toggle React Native / Expo Phone Simulator"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mobile App</span>
          </button>

          {/* Admin Dashboard Trigger */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
            title="Open Admin Portal & SQL Database Schema"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">Admin Portal</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Your Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            title="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-black text-[11px] font-extrabold">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account Button */}
          <button
            onClick={user ? onOpenProfile : onOpenAuth}
            className="p-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2"
            title={user ? `Signed in as ${user.name}` : 'Login / Register'}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/50"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/5 text-zinc-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 glass-panel p-4 flex flex-col gap-3">
          {/* Mobile Search input */}
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-zinc-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 rounded-xl text-left text-sm font-medium ${
                  currentNav === link.id
                    ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/30'
                    : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                onToggleMobileSimulator();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-cyan-400 py-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Phone Simulator</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-purple-400 py-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
