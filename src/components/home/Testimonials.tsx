import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. Alistair Vance',
      role: 'Industrial Audio Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'Being able to rotate and explode the Cyber-Pulse X9 in 3D right in the browser before purchasing gave me complete confidence in its planar magnetic driver alignment. When it arrived, the acoustic purity matched expectations 100%.',
      item: 'Cyber-Pulse X9 ANC',
    },
    {
      name: 'Sophia Sterling',
      role: 'Creative Director & Collector',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'The Quantum Horizon Tourbillon is sheer kinetic poetry. The brushed titanium case finish and the open-worked dial look even more mesmerizing in person than in the 3D studio viewer.',
      item: 'Quantum Tourbillon Chrono',
    },
    {
      name: 'Kenji Takahashi',
      role: 'Techwear Stylist & Designer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'The Velocity V9 sneakers are unlike anything on the market. The nitrogen air-cells deliver trampoline-like propulsion. The AR preview feature let me check how they matched my wardrobe immediately.',
      item: 'Velocity V9 Cyber Sneaker',
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">
          Verified Buyer Experiences
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
          Trusted by 10,000+ Cyberpunk Enthusiasts
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between relative group hover:border-cyan-500/30 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-semibold border border-cyan-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Purchase</span>
                </span>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-cyan-500/40"
              />
              <div>
                <h4 className="font-heading font-bold text-sm text-white">{rev.name}</h4>
                <p className="text-[11px] text-zinc-400">{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
