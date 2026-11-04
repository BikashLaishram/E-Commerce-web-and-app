import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildHeadphoneModel,
  buildSneakerModel,
  buildWatchModel,
  buildDroneModel,
  buildPhoneModel,
} from './ProceduralModels';
import { Model3DType, ProductVariant } from '../../types';
import {
  RotateCw,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Layers,
  Camera,
  Compass,
  Sparkles,
  Smartphone,
  Eye,
  Sun,
} from 'lucide-react';

interface ProductViewer3DProps {
  modelType: Model3DType;
  variants?: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantChange?: (variant: ProductVariant) => void;
  onOpenAR?: () => void;
  height?: string;
  autoRotateDefault?: boolean;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({
  modelType,
  variants = [],
  selectedVariant,
  onVariantChange,
  onOpenAR,
  height = '500px',
  autoRotateDefault = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState<string>(
    selectedVariant?.colorHex || '#8B5CF6'
  );
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [isRotating, setIsRotating] = useState(autoRotateDefault);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.2, y: 0.4 });
  const targetZoomRef = useRef(4.8);
  const currentZoomRef = useRef(4.8);

  // Sync color when external variant changes
  useEffect(() => {
    if (selectedVariant?.colorHex) {
      setCurrentColor(selectedVariant.colorHex);
      rebuildModel(modelType, selectedVariant.colorHex, explodeFactor, isWireframe);
    }
  }, [selectedVariant]);

  const rebuildModel = (
    type: Model3DType,
    color: string,
    explode: number,
    wireframe: boolean
  ) => {
    if (!modelRootRef.current) return;
    while (modelRootRef.current.children.length > 0) {
      modelRootRef.current.remove(modelRootRef.current.children[0]);
    }

    let model: THREE.Group;
    switch (type) {
      case 'headphone':
        model = buildHeadphoneModel(color, explode);
        break;
      case 'sneaker':
        model = buildSneakerModel(color, explode);
        break;
      case 'watch':
        model = buildWatchModel(color, explode);
        break;
      case 'drone':
        model = buildDroneModel(color, explode);
        break;
      case 'phone':
        model = buildPhoneModel(color, explode);
        break;
      default:
        model = buildHeadphoneModel(color, explode);
    }

    if (wireframe) {
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              if ('wireframe' in m) (m as THREE.MeshStandardMaterial).wireframe = true;
            });
          } else if (mesh.material && 'wireframe' in mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).wireframe = true;
          }
        }
      });
    }

    modelRootRef.current.add(model);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight || 500;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.3, currentZoomRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting
    const keyLight = new THREE.DirectionalLight('#FFF5EB', 3.0);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#80D8FF', 1.8);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight('#8B5CF6', '#0B0B0F', 1.0);
    scene.add(fillLight);

    // Ground Shadow Plate
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.6;
    scene.add(shadowPlane);

    // Model group
    const rootModelGroup = new THREE.Group();
    scene.add(rootModelGroup);
    modelRootRef.current = rootModelGroup;

    rebuildModel(modelType, currentColor, explodeFactor, isWireframe);

    // Drag to rotate and zoom interaction
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      targetRotationRef.current.y += deltaX * 0.009;
      targetRotationRef.current.x += deltaY * 0.009;
      targetRotationRef.current.x = Math.max(-1.1, Math.min(1.1, targetRotationRef.current.x));
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoomRef.current = Math.max(2.8, Math.min(8.0, targetZoomRef.current + e.deltaY * 0.004));
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Render loop with smooth damping
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotating && !isDraggingRef.current) {
        targetRotationRef.current.y += delta * 0.35;
      }

      if (rootModelGroup) {
        rootModelGroup.rotation.x = THREE.MathUtils.damp(
          rootModelGroup.rotation.x,
          targetRotationRef.current.x,
          8,
          delta
        );
        rootModelGroup.rotation.y = THREE.MathUtils.damp(
          rootModelGroup.rotation.y,
          targetRotationRef.current.y,
          8,
          delta
        );
      }

      if (cameraRef.current) {
        currentZoomRef.current = THREE.MathUtils.damp(
          currentZoomRef.current,
          targetZoomRef.current,
          8,
          delta
        );
        cameraRef.current.position.z = currentZoomRef.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [modelType]);

  const handleExplodeChange = (val: number) => {
    setExplodeFactor(val);
    rebuildModel(modelType, currentColor, val, isWireframe);
  };

  const handleWireframeToggle = () => {
    const next = !isWireframe;
    setIsWireframe(next);
    rebuildModel(modelType, currentColor, explodeFactor, next);
  };

  const handleColorChange = (hex: string) => {
    setCurrentColor(hex);
    rebuildModel(modelType, hex, explodeFactor, isWireframe);
    if (variants.length > 0 && onVariantChange) {
      const match = variants.find((v) => v.colorHex.toLowerCase() === hex.toLowerCase());
      if (match) onVariantChange(match);
    }
  };

  const setCameraPreset = (angle: 'front' | 'side' | 'iso' | 'top' | 'close') => {
    switch (angle) {
      case 'front':
        targetRotationRef.current = { x: 0, y: 0 };
        targetZoomRef.current = 4.8;
        break;
      case 'side':
        targetRotationRef.current = { x: 0, y: Math.PI / 2 };
        targetZoomRef.current = 4.8;
        break;
      case 'iso':
        targetRotationRef.current = { x: 0.35, y: 0.65 };
        targetZoomRef.current = 4.8;
        break;
      case 'top':
        targetRotationRef.current = { x: Math.PI / 2 - 0.1, y: 0 };
        targetZoomRef.current = 5.2;
        break;
      case 'close':
        targetRotationRef.current = { x: 0.2, y: 0.4 };
        targetZoomRef.current = 3.2;
        break;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.parentElement?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#15151F] to-[#0A0A0E] border border-white/10 select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* 3D Canvas Viewport (Unobstructed Center) */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Drag to rotate • Scroll to zoom"
      />

      {/* Top Left Spec Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/10 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>360° Studio Viewer</span>
        </span>
        {explodeFactor > 0 && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Exploded {Math.round(explodeFactor * 100)}%
          </span>
        )}
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {onOpenAR && (
          <button
            onClick={onOpenAR}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-semibold backdrop-blur-md transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
            title="View in your room with AR"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>AR Preview</span>
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Three.js Skill Directive) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-[760px] transition-all duration-300 ease-out ${
          isDockCollapsed ? 'translate-y-[calc(100%-36px)] opacity-90' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Toggle Dock Header / Zen Mode Trigger */}
        <div className="flex justify-center mb-1.5">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="px-3 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[11px] font-medium border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                <span>Hide Controls (Zen Mode)</span>
              </>
            )}
          </button>
        </div>

        {/* Unified Glass Dock */}
        <div className="glass-panel p-3.5 rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-3">
          {/* Top row: Presets + Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            {/* Camera angle presets */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl">
              <span className="text-[10px] text-zinc-400 px-1 font-mono uppercase">Views</span>
              <button
                onClick={() => setCameraPreset('front')}
                className="px-2 py-1 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Front
              </button>
              <button
                onClick={() => setCameraPreset('iso')}
                className="px-2 py-1 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Iso
              </button>
              <button
                onClick={() => setCameraPreset('side')}
                className="px-2 py-1 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Side
              </button>
              <button
                onClick={() => setCameraPreset('top')}
                className="px-2 py-1 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Top
              </button>
              <button
                onClick={() => setCameraPreset('close')}
                className="px-2 py-1 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Detail
              </button>
            </div>

            {/* Quick toggles: Auto-rotate & Wireframe */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isRotating
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-black/40 text-zinc-400 hover:text-white'
                }`}
                title="Toggle continuous rotation"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
                <span>Auto Spin</span>
              </button>

              <button
                onClick={handleWireframeToggle}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isWireframe
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-black/40 text-zinc-400 hover:text-white'
                }`}
                title="Toggle wireframe topology"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Wireframe</span>
              </button>
            </div>
          </div>

          {/* Bottom row: Exploded View Slider + Finish Swatches */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            {/* Exploded Disassembly Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Explode Layers</span>
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodeFactor}
                onChange={(e) => handleExplodeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Variant / Color Swatches */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400 mr-1">Finish:</span>
              {(variants.length > 0
                ? variants.map((v) => ({ name: v.name, hex: v.colorHex }))
                : [
                    { name: 'Cyber Violet', hex: '#8B5CF6' },
                    { name: 'Neon Cyan', hex: '#00E5FF' },
                    { name: 'Obsidian Black', hex: '#1C1C26' },
                    { name: 'Pure Platinum', hex: '#E2E8F0' },
                    { name: 'Solar Amber', hex: '#F59E0B' },
                  ]
              ).map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleColorChange(color.hex)}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                    currentColor.toLowerCase() === color.hex.toLowerCase()
                      ? 'scale-125 ring-2 ring-cyan-400 ring-offset-2 ring-offset-black'
                      : 'hover:scale-110 opacity-75'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
