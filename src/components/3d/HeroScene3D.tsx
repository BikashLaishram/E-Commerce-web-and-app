import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildHeadphoneModel, buildSneakerModel, buildWatchModel, buildDroneModel } from './ProceduralModels';
import { Model3DType } from '../../types';
import { Sparkles, RotateCw, ZoomIn, Eye, ShieldCheck, Zap } from 'lucide-react';

interface HeroScene3DProps {
  onSelectProduct?: (modelType: Model3DType) => void;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({ onSelectProduct }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<Model3DType>('headphone');
  const [activeColor, setActiveColor] = useState<string>('#8B5CF6');
  const [isRotating, setIsRotating] = useState(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.15, y: -0.4 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Detect software GL
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

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Balanced Lighting Rig
    const warmKeyLight = new THREE.DirectionalLight('#FFF3E0', 2.8);
    warmKeyLight.position.set(4, 6, 4);
    warmKeyLight.castShadow = !isSoftwareGl;
    if (warmKeyLight.shadow) {
      warmKeyLight.shadow.mapSize.width = 1024;
      warmKeyLight.shadow.mapSize.height = 1024;
      warmKeyLight.shadow.bias = -0.0005;
      warmKeyLight.shadow.normalBias = 0.02;
    }
    scene.add(warmKeyLight);

    const coolFillLight = new THREE.DirectionalLight('#80D8FF', 1.4);
    coolFillLight.position.set(-4, -2, -3);
    scene.add(coolFillLight);

    const hemiLight = new THREE.HemisphereLight('#8B5CF6', '#0B0B0F', 1.0);
    scene.add(hemiLight);

    // Ground Contact Shadow plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.5;
    scene.add(shadowPlane);

    // Floating Cyber Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00E5FF,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Root Group for switching models
    const rootModelGroup = new THREE.Group();
    scene.add(rootModelGroup);
    modelGroupRef.current = rootModelGroup;

    // Build initial model
    loadModel('headphone', '#8B5CF6');

    // Pointer events for interactive 3D rotation & hover tilt
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - prevMouseRef.current.x;
        const deltaY = e.clientY - prevMouseRef.current.y;
        targetRotationRef.current.y += deltaX * 0.008;
        targetRotationRef.current.x += deltaY * 0.008;
        targetRotationRef.current.x = Math.max(-0.6, Math.min(0.6, targetRotationRef.current.x));
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      } else {
        const rect = container.getBoundingClientRect();
        mousePosRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mousePosRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize handler
    const onResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop with exponential damping
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (rootModelGroup) {
        // Floating gentle bobbing
        rootModelGroup.position.y = Math.sin(time * 1.5) * 0.08;

        if (isRotating && !isDraggingRef.current) {
          targetRotationRef.current.y += delta * 0.4;
        }

        // Parallax mouse tilt
        const mouseTiltX = mousePosRef.current.y * 0.15;
        const mouseTiltY = mousePosRef.current.x * 0.25;

        // Exponential damping
        rootModelGroup.rotation.x = THREE.MathUtils.damp(
          rootModelGroup.rotation.x,
          targetRotationRef.current.x + mouseTiltX,
          6,
          delta
        );
        rootModelGroup.rotation.y = THREE.MathUtils.damp(
          rootModelGroup.rotation.y,
          targetRotationRef.current.y + mouseTiltY,
          6,
          delta
        );
      }

      // Rotate subtle background particles
      particles.rotation.y = time * 0.04;
      particles.rotation.x = Math.sin(time * 0.02) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const loadModel = (modelType: Model3DType, color: string) => {
    if (!modelGroupRef.current) return;
    // Clear old children
    while (modelGroupRef.current.children.length > 0) {
      const obj = modelGroupRef.current.children[0];
      modelGroupRef.current.remove(obj);
    }

    let model: THREE.Group;
    switch (modelType) {
      case 'headphone':
        model = buildHeadphoneModel(color, 0);
        break;
      case 'sneaker':
        model = buildSneakerModel(color, 0);
        break;
      case 'watch':
        model = buildWatchModel(color, 0);
        break;
      case 'drone':
        model = buildDroneModel(color, 0);
        break;
      default:
        model = buildHeadphoneModel(color, 0);
    }

    modelGroupRef.current.add(model);
  };

  const handleModelChange = (type: Model3DType) => {
    setActiveModel(type);
    loadModel(type, activeColor);
    onSelectProduct?.(type);
  };

  const handleColorChange = (hex: string) => {
    setActiveColor(hex);
    loadModel(activeModel, hex);
  };

  const models: { id: Model3DType; label: string; tag: string }[] = [
    { id: 'headphone', label: 'Audio Pro X', tag: 'Acoustic Cyber' },
    { id: 'sneaker', label: 'Velocity V9', tag: 'Air-Cell Sole' },
    { id: 'watch', label: 'Chrono Horizon', tag: 'Titanium Tourbillon' },
    { id: 'drone', label: 'Apex Stealth', tag: '4K Carbon Fiber' },
  ];

  const colors = [
    { name: 'Cyber Violet', hex: '#8B5CF6' },
    { name: 'Neon Cyan', hex: '#00E5FF' },
    { name: 'Obsidian Black', hex: '#1C1C26' },
    { name: 'Solar Amber', hex: '#F59E0B' },
  ];

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] select-none flex items-center justify-center">
      {/* 3D Canvas Mount */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing" 
        title="Click and drag to rotate 3D product"
      />

      {/* Floating 3D Device Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-cyan-400 border border-cyan-500/30">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive 3D Engine • 60 FPS</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 text-[11px] text-purple-300 border border-purple-500/20 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Drag to orbit • Mouse reactive</span>
        </div>
      </div>

      {/* Hero Interactive Dock (Bottom-Center, Non-obstructive) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-[620px]">
        <div className="glass-panel p-2.5 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-2 border border-white/10">
          {/* Model Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModelChange(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeModel === m.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Color Finish Picker */}
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1.5 rounded-xl">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => handleColorChange(c.hex)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  activeColor === c.hex ? 'scale-125 ring-2 ring-cyan-400' : 'hover:scale-110 opacity-70'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          {/* Auto rotate toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg transition-colors ${
              isRotating ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-zinc-400 bg-black/40'
            }`}
            title={isRotating ? 'Pause rotation' : 'Start auto-spin'}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
