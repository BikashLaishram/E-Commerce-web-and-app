import * as THREE from 'three';

// Helper to create procedural dial/speaker grill canvas textures
function createGrillTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#111116';
  ctx.fillRect(0, 0, 256, 256);
  
  ctx.fillStyle = '#00E5FF';
  for (let x = 8; x < 256; x += 16) {
    for (let y = 8; y < 256; y += 16) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createWatchDialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Radial gradient background
  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
  grad.addColorStop(0, '#1c1c28');
  grad.addColorStop(0.7, '#0e0e14');
  grad.addColorStop(1, '#050508');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Outer tachymeter circle
  ctx.strokeStyle = '#8B5CF6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(256, 256, 230, 0, Math.PI * 2);
  ctx.stroke();

  // Hour tick marks
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30;
    const isHour = i % 5 === 0;
    const r1 = isHour ? 200 : 215;
    const r2 = 225;
    
    ctx.strokeStyle = isHour ? '#00E5FF' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = isHour ? 4 : 1.5;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(angle) * r1, 256 + Math.sin(angle) * r1);
    ctx.lineTo(256 + Math.cos(angle) * r2, 256 + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Branding
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NEXORA', 256, 170);

  ctx.fillStyle = '#00E5FF';
  ctx.font = '12px sans-serif';
  ctx.fillText('CHRONO QUANTUM 100M', 256, 195);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCarbonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#18181F';
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = '#22222E';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillRect(32, 32, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// 1. Procedural Cyber Headphones
export function buildHeadphoneModel(colorHex: string, explode: number = 0): THREE.Group {
  const root = new THREE.Group();
  const primaryColor = new THREE.Color(colorHex);
  const accentCyan = new THREE.Color('#00E5FF');
  const darkMetal = new THREE.Color('#16161E');

  const shellMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    metalness: 0.85,
    roughness: 0.25,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: darkMetal,
    metalness: 0.9,
    roughness: 0.35,
  });

  const padMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#101015'),
    roughness: 0.9,
    metalness: 0.05,
  });

  const ledMat = new THREE.MeshStandardMaterial({
    color: accentCyan,
    emissive: accentCyan,
    emissiveIntensity: 0.8,
    roughness: 0.1,
  });

  const driverMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#22222D'),
    map: createGrillTexture(),
    metalness: 0.8,
    roughness: 0.3,
  });

  // Headband Arch
  const headbandGeom = new THREE.TorusGeometry(1.5, 0.08, 16, 64, Math.PI * 0.95);
  const headband = new THREE.Mesh(headbandGeom, darkMat);
  headband.rotation.z = -Math.PI * 0.475;
  headband.position.y = 0.5 + explode * 0.3;
  root.add(headband);

  // Headband Soft Cushion
  const cushionGeom = new THREE.TorusGeometry(1.44, 0.12, 16, 48, Math.PI * 0.65);
  const cushion = new THREE.Mesh(cushionGeom, padMat);
  cushion.rotation.z = -Math.PI * 0.325;
  cushion.position.y = 0.5 + explode * 0.2;
  root.add(cushion);

  // Left & Right Ear Units
  [-1, 1].forEach((side) => {
    const earGroup = new THREE.Group();
    const xBase = side * 1.5;
    const xExplode = side * (explode * 0.8);

    // Earcup shell
    const cupGeom = new THREE.CylinderGeometry(0.7, 0.65, 0.35, 32);
    const cup = new THREE.Mesh(cupGeom, shellMat);
    cup.rotation.z = Math.PI / 2;
    cup.position.x = xExplode * 1.2;
    earGroup.add(cup);

    // Glowing LED Ring
    const ringGeom = new THREE.TorusGeometry(0.68, 0.03, 16, 32);
    const ring = new THREE.Mesh(ringGeom, ledMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = cup.position.x + side * 0.05;
    earGroup.add(ring);

    // Driver & acoustic coil
    const driverGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
    const driver = new THREE.Mesh(driverGeom, driverMat);
    driver.rotation.z = Math.PI / 2;
    driver.position.x = xExplode * 0.5;
    earGroup.add(driver);

    // Earpad
    const padGeom = new THREE.TorusGeometry(0.62, 0.18, 16, 32);
    const pad = new THREE.Mesh(padGeom, padMat);
    pad.rotation.y = Math.PI / 2;
    pad.position.x = side * -0.15;
    earGroup.add(pad);

    // Yoke bracket
    const yokeGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16);
    const yoke = new THREE.Mesh(yokeGeom, darkMat);
    yoke.position.set(0, 0.45, 0);
    earGroup.add(yoke);

    earGroup.position.set(xBase, 0, 0);
    root.add(earGroup);
  });

  root.position.y = 0.8;
  return root;
}

// 2. Procedural Cyber Sneaker
export function buildSneakerModel(colorHex: string, explode: number = 0): THREE.Group {
  const root = new THREE.Group();
  const primaryColor = new THREE.Color(colorHex);
  const accentCyan = new THREE.Color('#00E5FF');

  const upperMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    roughness: 0.5,
    metalness: 0.2,
  });

  const soleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFFFFF'),
    roughness: 0.35,
    metalness: 0.1,
  });

  const airBubbleMat = new THREE.MeshPhysicalMaterial({
    color: accentCyan,
    transmission: 0.85,
    opacity: 1,
    transparent: true,
    roughness: 0.1,
    ior: 1.5,
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#181820'),
    roughness: 0.3,
    metalness: 0.8,
    map: createCarbonTexture(),
  });

  const laceMat = new THREE.MeshStandardMaterial({
    color: accentCyan,
    emissive: accentCyan,
    emissiveIntensity: 0.4,
    roughness: 0.6,
  });

  // Outsole / Bottom Tread
  const outsoleGeom = new THREE.BoxGeometry(1.3, 0.18, 3.2);
  const outsole = new THREE.Mesh(outsoleGeom, soleMat);
  outsole.position.y = -0.5 - explode * 0.4;
  root.add(outsole);

  // Air Cushion Midsole
  const airUnitGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.25, 24);
  const airUnit = new THREE.Mesh(airUnitGeom, airBubbleMat);
  airUnit.rotation.z = Math.PI / 2;
  airUnit.position.set(0, -0.35 - explode * 0.2, -0.6);
  root.add(airUnit);

  // Main Shoe Upper Body (aerodynamic sculpted sections)
  const toeUpperGeom = new THREE.SphereGeometry(0.65, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const toeUpper = new THREE.Mesh(toeUpperGeom, upperMat);
  toeUpper.scale.set(0.95, 0.7, 1.4);
  toeUpper.position.set(0, -0.15 + explode * 0.1, 0.6);
  root.add(toeUpper);

  // Rear Heel Section
  const heelGeom = new THREE.CylinderGeometry(0.6, 0.62, 1.1, 24);
  const heel = new THREE.Mesh(heelGeom, upperMat);
  heel.position.set(0, 0.1 + explode * 0.15, -0.8);
  root.add(heel);

  // TPU Heel Stabilizer Cage
  const cageGeom = new THREE.TorusGeometry(0.68, 0.08, 16, 24, Math.PI);
  const cage = new THREE.Mesh(cageGeom, carbonMat);
  cage.rotation.x = Math.PI / 2;
  cage.position.set(0, 0.1, -0.8 - explode * 0.3);
  root.add(cage);

  // Futuristic Laces (Crossed Bars)
  for (let i = 0; i < 4; i++) {
    const laceGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.75, 12);
    const lace = new THREE.Mesh(laceGeom, laceMat);
    lace.rotation.z = Math.PI / 2;
    lace.position.set(0, 0.15 + i * 0.12 + explode * 0.4, 0.3 - i * 0.3);
    root.add(lace);
  }

  // Padded Collar / Ankle Rim
  const collarGeom = new THREE.TorusGeometry(0.55, 0.12, 16, 24);
  const collar = new THREE.Mesh(collarGeom, carbonMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.65 + explode * 0.3, -0.7);
  root.add(collar);

  root.position.y = 0.4;
  return root;
}

// 3. Procedural Quantum Chrono Watch
export function buildWatchModel(colorHex: string, explode: number = 0): THREE.Group {
  const root = new THREE.Group();
  const caseColor = new THREE.Color(colorHex);
  const goldAccent = new THREE.Color('#FFD700');
  const cyanAccent = new THREE.Color('#00E5FF');

  const caseMat = new THREE.MeshStandardMaterial({
    color: caseColor,
    metalness: 0.95,
    roughness: 0.18,
  });

  const bezelMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#121218'),
    metalness: 0.85,
    roughness: 0.2,
  });

  const dialMat = new THREE.MeshStandardMaterial({
    map: createWatchDialTexture(),
    metalness: 0.6,
    roughness: 0.3,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    transmission: 0.95,
    roughness: 0.05,
    ior: 1.6,
    transparent: true,
    opacity: 0.85,
  });

  const handMat = new THREE.MeshStandardMaterial({
    color: cyanAccent,
    emissive: cyanAccent,
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.1,
  });

  const goldGearMat = new THREE.MeshStandardMaterial({
    color: goldAccent,
    metalness: 0.95,
    roughness: 0.2,
  });

  // Watch Case (Brushed octagonal/cylindrical body)
  const caseGeom = new THREE.CylinderGeometry(1.3, 1.3, 0.35, 8);
  const watchCase = new THREE.Mesh(caseGeom, caseMat);
  root.add(watchCase);

  // Bezel ring
  const bezelGeom = new THREE.TorusGeometry(1.28, 0.1, 16, 32);
  const bezel = new THREE.Mesh(bezelGeom, bezelMat);
  bezel.rotation.x = Math.PI / 2;
  bezel.position.y = 0.18 + explode * 0.3;
  root.add(bezel);

  // Watch Dial Face
  const dialGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.05, 32);
  const dial = new THREE.Mesh(dialGeom, dialMat);
  dial.position.y = 0.15;
  root.add(dial);

  // Skeleton Gear Mechanism visible inside
  const gearGeom = new THREE.TorusGeometry(0.35, 0.06, 12, 18);
  const gear = new THREE.Mesh(gearGeom, goldGearMat);
  gear.rotation.x = Math.PI / 2;
  gear.position.set(-0.35, 0.17 + explode * 0.2, 0.2);
  root.add(gear);

  // Watch Hands (Hour & Minute)
  const hourHandGeom = new THREE.BoxGeometry(0.06, 0.03, 0.55);
  const hourHand = new THREE.Mesh(hourHandGeom, handMat);
  hourHand.position.set(0.18, 0.2 + explode * 0.4, 0.12);
  hourHand.rotation.y = 0.8;
  root.add(hourHand);

  const minHandGeom = new THREE.BoxGeometry(0.04, 0.03, 0.85);
  const minHand = new THREE.Mesh(minHandGeom, handMat);
  minHand.position.set(0, 0.22 + explode * 0.45, 0.25);
  minHand.rotation.y = -1.2;
  root.add(minHand);

  // Sapphire Crystal Glass Dome
  const glassGeom = new THREE.CylinderGeometry(1.26, 1.26, 0.06, 32);
  const glass = new THREE.Mesh(glassGeom, glassMat);
  glass.position.y = 0.25 + explode * 0.6;
  root.add(glass);

  // Crown Winder & Chrono Pushers
  const crownGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16);
  const crown = new THREE.Mesh(crownGeom, caseMat);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(1.4 + explode * 0.25, 0, 0);
  root.add(crown);

  // Bracelet Links (Top & Bottom segments)
  [-1, 1].forEach((dir) => {
    for (let link = 0; link < 3; link++) {
      const linkGeom = new THREE.BoxGeometry(0.9, 0.14, 0.4);
      const strapLink = new THREE.Mesh(linkGeom, caseMat);
      strapLink.position.set(0, -0.05, dir * (1.5 + link * 0.45 + explode * 0.2));
      root.add(strapLink);
    }
  });

  root.rotation.x = 0.35;
  return root;
}

// 4. Procedural Apex Cyber Drone
export function buildDroneModel(colorHex: string, explode: number = 0): THREE.Group {
  const root = new THREE.Group();
  const primaryColor = new THREE.Color(colorHex);
  const darkMetal = new THREE.Color('#14141E');
  const cyanLed = new THREE.Color('#00E5FF');

  const bodyMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    metalness: 0.85,
    roughness: 0.25,
  });

  const armMat = new THREE.MeshStandardMaterial({
    color: darkMetal,
    metalness: 0.9,
    roughness: 0.35,
    map: createCarbonTexture(),
  });

  const rotorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0A0A0F'),
    metalness: 0.4,
    roughness: 0.4,
    transparent: true,
    opacity: 0.9,
  });

  const ledMat = new THREE.MeshStandardMaterial({
    color: cyanLed,
    emissive: cyanLed,
    emissiveIntensity: 0.9,
  });

  // Central Aerodynamic Fuselage
  const bodyGeom = new THREE.ConeGeometry(0.9, 1.8, 16);
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.rotation.x = Math.PI / 2;
  body.scale.set(0.9, 1, 0.4);
  body.position.y = explode * 0.3;
  root.add(body);

  // 4 Outrigger Rotor Arms
  const armOffsets = [
    { x: 1.3, z: 1.1, rot: 0.7 },
    { x: -1.3, z: 1.1, rot: -0.7 },
    { x: 1.3, z: -1.1, rot: -0.7 },
    { x: -1.3, z: -1.1, rot: 0.7 },
  ];

  armOffsets.forEach((arm, i) => {
    const armGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 12);
    const armMesh = new THREE.Mesh(armGeom, armMat);
    armMesh.rotation.z = Math.PI / 2;
    armMesh.rotation.y = arm.rot;
    armMesh.position.set(arm.x * 0.5, 0, arm.z * 0.5);
    root.add(armMesh);

    // Motor Hub
    const motorGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.25, 16);
    const motor = new THREE.Mesh(motorGeom, bodyMat);
    motor.position.set(arm.x + (arm.x > 0 ? explode * 0.4 : -explode * 0.4), 0.1, arm.z);
    root.add(motor);

    // Navigation LED on arm
    const ledGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const led = new THREE.Mesh(ledGeom, ledMat);
    led.position.set(arm.x, -0.1, arm.z);
    root.add(led);

    // Propeller Blades
    const propGeom = new THREE.BoxGeometry(1.3, 0.02, 0.14);
    const prop = new THREE.Mesh(propGeom, rotorMat);
    prop.position.set(motor.position.x, 0.25 + explode * 0.3, motor.position.z);
    prop.rotation.y = (i * Math.PI) / 4;
    root.add(prop);
  });

  // 4K Camera Gimbal Lens
  const gimbalGeom = new THREE.SphereGeometry(0.32, 16, 16);
  const gimbal = new THREE.Mesh(gimbalGeom, armMat);
  gimbal.position.set(0, -0.25 - explode * 0.4, 0.8);
  root.add(gimbal);

  const lensGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
  const lens = new THREE.Mesh(lensGeom, ledMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, -0.25 - explode * 0.4, 1.05);
  root.add(lens);

  // Landing Skids
  [-0.6, 0.6].forEach((x) => {
    const skidGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);
    const skid = new THREE.Mesh(skidGeom, armMat);
    skid.rotation.x = Math.PI / 2;
    skid.position.set(x, -0.5 - explode * 0.2, 0);
    root.add(skid);
  });

  root.position.y = 0.2;
  return root;
}

// 5. Procedural Nova Cyber Phone Pro
export function buildPhoneModel(colorHex: string, explode: number = 0): THREE.Group {
  const root = new THREE.Group();
  const chassisColor = new THREE.Color(colorHex);
  const accentCyan = new THREE.Color('#00E5FF');

  const chassisMat = new THREE.MeshStandardMaterial({
    color: chassisColor,
    metalness: 0.95,
    roughness: 0.18,
  });

  const backGlassMat = new THREE.MeshPhysicalMaterial({
    color: chassisColor,
    roughness: 0.25,
    metalness: 0.4,
    clearcoat: 1.0,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#050508'),
    roughness: 0.1,
    metalness: 0.9,
    emissive: new THREE.Color('#101025'),
    emissiveIntensity: 0.3,
  });

  const lensMat = new THREE.MeshStandardMaterial({
    color: accentCyan,
    metalness: 0.95,
    roughness: 0.05,
    emissive: accentCyan,
    emissiveIntensity: 0.4,
  });

  // Titanium Frame
  const frameGeom = new THREE.BoxGeometry(1.6, 3.2, 0.16);
  const frame = new THREE.Mesh(frameGeom, chassisMat);
  root.add(frame);

  // OLED Screen Display
  const screenGeom = new THREE.BoxGeometry(1.52, 3.12, 0.02);
  const screen = new THREE.Mesh(screenGeom, screenMat);
  screen.position.z = 0.09 + explode * 0.3;
  root.add(screen);

  // Frosted Back Glass
  const backGeom = new THREE.BoxGeometry(1.54, 3.14, 0.02);
  const back = new THREE.Mesh(backGeom, backGlassMat);
  back.position.z = -0.09 - explode * 0.3;
  root.add(back);

  // Camera Island Plateau
  const islandGeom = new THREE.BoxGeometry(0.65, 0.7, 0.08);
  const island = new THREE.Mesh(islandGeom, chassisMat);
  island.position.set(-0.35, 1.05, -0.14 - explode * 0.5);
  root.add(island);

  // Triple Camera Lenses
  const lensPositions = [
    { x: -0.45, y: 1.2 },
    { x: -0.45, y: 0.9 },
    { x: -0.22, y: 1.05 },
  ];

  lensPositions.forEach((pos) => {
    const lensGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16);
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(pos.x, pos.y, -0.18 - explode * 0.6);
    root.add(lens);
  });

  root.rotation.x = 0.2;
  return root;
}
