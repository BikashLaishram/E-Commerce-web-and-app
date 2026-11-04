import React from 'react';
import { CategoryType } from '../../types';
import { CATEGORIES_LIST } from '../../data/mockData';
import {
  Sparkles,
  Cpu,
  Smartphone,
  Footprints,
  Watch,
  Gamepad2,
  Laptop,
  Shirt,
  Glasses,
  Home,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: CategoryType) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'Footprints': return <Footprints className="w-5 h-5 text-rose-400" />;
      case 'Watch': return <Watch className="w-5 h-5 text-amber-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-emerald-400" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-blue-400" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-fuchsia-400" />;
      case 'Glasses': return <Glasses className="w-5 h-5 text-teal-400" />;
      case 'Home': return <Home className="w-5 h-5 text-yellow-400" />;
      case 'Heart': return <Heart className="w-5 h-5 text-pink-400" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 block mb-1">
            Browse By Category
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Curated 3D Categories
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {CATEGORIES_LIST.filter((c) => c.name !== 'All').map((cat) => (
          <div
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className="group glass-card p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 hover:bg-white/5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {getIcon(cat.icon)}
              </div>
              <span className="text-[11px] font-mono text-zinc-500">{cat.count} items</span>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                <span>{cat.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
