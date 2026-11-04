import React, { useState } from 'react';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import { Product, Model3DType } from '../../types';
import { Sparkles, Layers, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface Interactive3DShowcaseProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenAR: () => void;
}

export const Interactive3DShowcase: React.FC<Interactive3DShowcaseProps> = ({
  products,
  onSelectProduct,
  onOpenAR,
}) => {
  const [selectedModel, setSelectedModel] = useState<Model3DType>('watch');

  const modelTabs: { id: Model3DType; label: string; prodId: string }[] = [
    { id: 'watch', label: 'Tourbillon Caliber', prodId: 'nx-prod-3' },
    { id: 'headphone', label: 'Planar Acoustics', prodId: 'nx-prod-1' },
    { id: 'sneaker', label: 'Air-Cell Kinetic', prodId: 'nx-prod-2' },
    { id: 'drone', label: '8K Gimbal Drone', prodId: 'nx-prod-4' },
    { id: 'phone', label: 'Titanium Phone', prodId: 'nx-prod-5' },
  ];

  const currentProduct = products.find((p) => p.modelType === selectedModel) || products[0];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden glass-card border border-white/10 p-6 sm:p-10 shadow-2xl">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Disassembly Studio</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white">
            Inspect Every Micro-Component in 3D
          </h2>

          <p className="text-zinc-400 text-sm max-w-2xl mt-2">
            Drag the Explode Layers slider below to detach chassis shells, view internal drivers, balance wheels, and acoustic dampers.
          </p>

          {/* Model selection pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 glass-panel rounded-2xl border border-white/10">
            {modelTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedModel(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedModel === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/25'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Product Viewer Container */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <ProductViewer3D
            modelType={selectedModel}
            variants={currentProduct?.variants}
            selectedVariant={currentProduct?.variants[0]}
            onOpenAR={onOpenAR}
            height="520px"
          />
        </div>

        {/* Bottom Product Info and View Link */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-center sm:text-left">
            <h4 className="font-heading font-bold text-white text-base">
              {currentProduct?.name}
            </h4>
            <p className="text-zinc-400 text-xs mt-0.5">{currentProduct?.tagline}</p>
          </div>

          <button
            onClick={() => onSelectProduct(currentProduct)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <span>View Full Specifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
