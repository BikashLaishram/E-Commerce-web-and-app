import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import { X, Camera, RefreshCw, Smartphone, Check, Sparkles, Sliders } from 'lucide-react';

interface ARPreviewModalProps {
  product: Product;
  onClose: () => void;
}

export const ARPreviewModal: React.FC<ARPreviewModalProps> = ({ product, onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    // Attempt camera access for real AR pass-through
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        }
      } catch (err) {
        // Fallback to stylized room background
        setCameraActive(false);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setIsPhotoCaptured(true);
    setTimeout(() => setIsPhotoCaptured(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg">
      <div className="relative w-full max-w-2xl h-[85vh] rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl flex flex-col bg-black">
        {/* Background: Real Video feed or Simulated Room Environment */}
        <div className="absolute inset-0 z-0">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black relative">
              {/* Simulated Room Grid Lines for AR visual perception */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#00E5FF_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF_1px,transparent_1px)] bg-[size:3rem_3rem]" />
              <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-32 rounded-full border border-cyan-500/30 bg-cyan-500/10 blur-[1px] transform rotateX(60deg)" />
            </div>
          )}
        </div>

        {/* Shutter Flash Animation */}
        {isPhotoCaptured && (
          <div className="absolute inset-0 z-40 bg-white animate-fade-out pointer-events-none" />
        )}

        {/* Header Strip */}
        <div className="relative z-10 p-4 flex items-center justify-between glass-panel border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wide">
              AR Spatial Mode • Plane Locked (1:1 Scale)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Model Floating Layer in AR */}
        <div className="relative z-10 flex-1 w-full flex items-center justify-center p-4">
          <div
            className="w-full h-full max-w-lg transition-transform duration-200"
            style={{
              transform: `scale(${scale}) rotateY(${rotation}deg)`,
            }}
          >
            <ProductViewer3D
              modelType={product.modelType}
              variants={product.variants}
              selectedVariant={product.variants[0]}
              height="100%"
              autoRotateDefault={false}
            />
          </div>

          {/* Holographic floor reticle */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
            <div className="w-44 h-16 rounded-full border-2 border-cyan-400/40 border-dashed animate-spin-slow flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-cyan-400/40" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400/80 mt-1 uppercase tracking-widest">
              Ground Anchor
            </span>
          </div>
        </div>

        {/* AR Control Dock */}
        <div className="relative z-10 p-4 glass-panel border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-zinc-400 whitespace-nowrap text-[11px]">Size Scale</span>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-white text-[11px]">{Math.round(scale * 100)}%</span>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <span className="text-zinc-400 whitespace-nowrap text-[11px]">Orbit</span>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <span className="font-mono text-white text-[11px]">{rotation}°</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-zinc-400">
              {cameraActive ? 'Using environment camera' : 'Simulated studio AR pass-through'}
            </div>

            <button
              onClick={handleCapture}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Snapshot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
