import React, { useState } from 'react';
import { User } from '../../types';
import { NexoraAPIService } from '../../services/api';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setStatusMessage('Password reset link sent to your email.');
      return;
    }

    const user = NexoraAPIService.login(email, email.includes('admin') ? 'admin' : 'customer');
    onSuccess(user);
    onClose();
  };

  const handleQuickDemo = (role: 'customer' | 'admin') => {
    const user = NexoraAPIService.login(
      role === 'admin' ? 'admin@nexora.io' : 'alex@nexora.io',
      role
    );
    onSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-card rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] mb-3 shadow-lg shadow-purple-600/30">
            <div className="w-full h-full bg-[#0B0B0F] rounded-[14px] flex items-center justify-center">
              <span className="font-heading font-black text-cyan-300 text-lg">NX</span>
            </div>
          </div>
          <h2 className="font-heading font-black text-2xl text-white">
            {mode === 'login' ? 'Sign in to NEXORA' : mode === 'register' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Access 3D saved wishlists, track spatial orders, and manage devices.
          </p>
        </div>

        {/* Quick Demo Login Presets */}
        <div className="mb-6 p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block text-center">
            Instant Demo Sign-in
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('customer')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Customer Demo</span>
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Vance"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@nexora.io"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-zinc-400">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-purple-400 hover:text-purple-300 text-[11px]"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {statusMessage && (
            <p className="text-xs text-cyan-300 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/30">
              {statusMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer mt-2"
          >
            <span>{mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
