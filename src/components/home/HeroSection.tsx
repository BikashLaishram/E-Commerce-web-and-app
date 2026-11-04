import React from 'react';
import { HeroScene3D } from '../3d/HeroScene3D';
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Cpu } from 'lucide-react';
import { Model3DType } from '../../types';

interface HeroSectionProps {
  onExplore: () => void;
  onShopNow: () => void;
  onSelectHeroModel: (model: Model3DType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onShopNow,
  onSelectHeroModel,
}) => {
  return (
    <section className="relative w-full overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-20">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col items-start z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen 3D Animated Commerce</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.08] mb-5">
              Discover the <br />
              <span className="text-gradient-cyber">Future of Shopping.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-lg mb-8 leading-relaxed">
              Experience products like never before. Rotate 360°, inspect exploded mechanics, switch finishes, and preview in real augmented reality before you buy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={onShopNow}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:shadow-cyan-500/40 transition-all duration-300 cursor-pointer group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExplore}
                className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-white font-semibold text-sm border border-white/15 transition-all cursor-pointer"
              >
                Explore Collection
              </button>
            </div>

            {/* Mini Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 w-full">
              <div>
                <span className="block font-heading font-extrabold text-2xl text-white">48ms</span>
                <span className="text-xs text-zinc-500">Spatial Latency</span>
              </div>
              <div>
                <span className="block font-heading font-extrabold text-2xl text-cyan-400">100%</span>
                <span className="text-xs text-zinc-500">True-to-Life 3D</span>
              </div>
              <div>
                <span className="block font-heading font-extrabold text-2xl text-purple-400">4.9★</span>
                <span className="text-xs text-zinc-500">From 10k+ Buyers</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Canvas Column */}
          <div className="lg:col-span-7 relative w-full">
            <HeroScene3D onSelectProduct={onSelectHeroModel} />
          </div>
        </div>

        {/* Feature Badges Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Cpu, title: 'Real-Time 3D Engine', desc: 'Inspect mechanical exploded layers' },
            { icon: Truck, title: 'Global Express Air', desc: 'Free worldwide delivery over $150' },
            { icon: Shield, title: 'Grade-5 Materials', desc: 'Aerospace titanium & carbon fiber' },
            { icon: RotateCcw, title: '30-Day Holographic Return', desc: 'Hassle-free replacement guarantee' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-4 rounded-2xl flex items-center gap-3.5 hover:border-cyan-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{item.title}</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
