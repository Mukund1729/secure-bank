import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import './ThreeDAnimation.css';

const ThreeDAnimation = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const objectsRef = useRef({});
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [fps, setFps] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Memoize THREE objects to avoid recreation
  const threeObjects = useMemo(() => ({
    geometries: {},
    materials: {},
    meshes: [],
  }), []);

  // Handle mouse movement with useCallback
  const handleMouseMove = useCallback((event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    mouseRef.current = { x, y };
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  // Handle window resize with useCallback
  const handleResize = useCallback(() => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  // Create scene with enhanced setup
  const createScene = useCallback(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 30, 100);
    
    return scene;
  }, []);

  // Create camera
  const createCamera = useCallback(() => {
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 6;
    cameraRef.current = camera;
    
    return camera;
  }, []);

  // Create renderer
  const createRenderer = useCallback(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    return renderer;
  }, []);

  // Create particle system with React state management
  const createParticles = useCallback((scene) => {
    const particleCount = 150;
    const posArray = new Float32Array(particleCount * 3);
    const colArray = new Float32Array(particleCount * 3);
    const velocityArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 20;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = (Math.random() - 0.5) * 10;

      colArray[i] = Math.random() * 0.5 + 0.5;
      colArray[i + 1] = Math.random() * 0.5 + 0.3;
      colArray[i + 2] = 1;

      velocityArray[i] = (Math.random() - 0.5) * 0.01;
      velocityArray[i + 1] = (Math.random() - 0.5) * 0.01;
      velocityArray[i + 2] = (Math.random() - 0.5) * 0.01;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
    geometry.userData.velocity = velocityArray;

    const material = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x0099ff,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    return { particles, geometry, material };
  }, []);

  // Create central sphere with glow
  const createCentralSphere = useCallback((scene) => {
    const sphereGeometry = new THREE.IcosahedronGeometry(1.2, 5);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x0084ff,
      emissive: 0x0066ff,
      shininess: 100,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    // Glow sphere
    const glowGeometry = new THREE.IcosahedronGeometry(1.4, 5);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    sphere.add(glowSphere);
    
    return { sphere, glowSphere, sphereGeometry, sphereMaterial, glowMaterial };
  }, []);

  // Create orbiting spheres
  const createOrbitingSpheres = useCallback((scene) => {
    const orbitingSpheres = [];
    const orbitColors = [0x00ffff, 0x00ff88, 0xff00ff];
    
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: orbitColors[i],
        emissive: orbitColors[i],
        shininess: 50,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      const orbitRadius = 2.5 + i * 0.5;
      const angle = (i / 3) * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * orbitRadius;
      mesh.position.y = Math.sin(angle) * orbitRadius;
      mesh.position.z = Math.sin(angle * 0.5) * 0.5;

      orbitingSpheres.push({
        mesh,
        radius: orbitRadius,
        angle,
        speed: 0.005 + i * 0.002,
        zOffset: angle * 0.5,
      });
      
      scene.add(mesh);
    }
    
    return orbitingSpheres;
  }, []);

  // Create torus rings
  const createRings = useCallback((scene) => {
    const rings = [];
    const ringColors = [0x00ffff, 0x00ff88, 0xff00ff, 0xffaa00];
    
    for (let i = 0; i < 4; i++) {
      const ringGeometry = new THREE.TorusGeometry(2 + i * 0.4, 0.06, 16, 100);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: ringColors[i],
        emissive: ringColors[i],
        transparent: true,
        opacity: 0.8,
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.castShadow = true;
      ring.receiveShadow = true;
      
      ring.rotation.x = Math.PI * (0.3 + i * 0.15);
      ring.rotation.y = Math.PI * (0.2 + i * 0.1);
      ring.rotation.z = Math.PI * (0.1 + i * 0.08);
      
      rings.push({
        mesh: ring,
        rotX: 0.0002 + i * 0.00003,
        rotY: 0.0003 + i * 0.00005,
        rotZ: 0.0001 + i * 0.00002,
      });
      
      scene.add(ring);
    }
    
    return rings;
  }, []);

  // Create floating boxes
  const createBoxes = useCallback((scene) => {
    const boxes = [];
    const boxColors = [0x00ffff, 0xff00ff, 0x00ff88, 0xffaa00, 0xff0088];
    
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const material = new THREE.MeshPhongMaterial({
        color: boxColors[i],
        emissive: boxColors[i],
        shininess: 80,
      });
      const box = new THREE.Mesh(geometry, material);
      box.castShadow = true;
      box.receiveShadow = true;
      
      box.position.x = (Math.random() - 0.5) * 12;
      box.position.y = (Math.random() - 0.5) * 12;
      box.position.z = (Math.random() - 0.5) * 6;
      
      box.userData = {
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.015,
        vz: (Math.random() - 0.5) * 0.015,
        rx: (Math.random() - 0.5) * 0.015,
        ry: (Math.random() - 0.5) * 0.015,
        rz: (Math.random() - 0.5) * 0.015,
      };
      
      scene.add(box);
      boxes.push(box);
    }
    
    return boxes;
  }, []);

  // Create lights
  const createLights = useCallback((scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x0084ff, 2, 150);
    pointLight1.position.set(8, 8, 8);
    pointLight1.castShadow = true;
    pointLight1.shadow.mapSize.width = 2048;
    pointLight1.shadow.mapSize.height = 2048;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1.5, 150);
    pointLight2.position.set(-8, -8, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x00ffff, 1, 150);
    pointLight3.position.set(0, 0, 10);
    scene.add(pointLight3);
    
    return { ambientLight, pointLight1, pointLight2, pointLight3 };
  }, []);

  // Main initialization effect
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = createScene();
    const camera = createCamera();
    const renderer = createRenderer();

    const particlesData = createParticles(scene);
    const sphereData = createCentralSphere(scene);
    const orbitingSpheres = createOrbitingSpheres(scene);
    const rings = createRings(scene);
    const boxes = createBoxes(scene);
    createLights(scene);

    objectsRef.current = {
      particlesData,
      sphereData,
      orbitingSpheres,
      rings,
      boxes,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    setIsLoaded(true);

    // Animation loop with FPS counter
    let frameCount = 0;
    let lastTime = performance.now();
    let time = 0;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // FPS calculation
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }

      // Update sphere
      sphereData.sphere.rotation.x += 0.0008;
      sphereData.sphere.rotation.y += 0.0012;
      sphereData.glowSphere.rotation.x -= 0.0005;
      sphereData.glowSphere.rotation.z += 0.0003;

      // Update orbiting spheres
      orbitingSpheres.forEach((orbitSphere) => {
        orbitSphere.angle += orbitSphere.speed;
        orbitSphere.mesh.position.x = Math.cos(orbitSphere.angle) * orbitSphere.radius;
        orbitSphere.mesh.position.y = Math.sin(orbitSphere.angle) * orbitSphere.radius;
        orbitSphere.mesh.position.z = Math.sin(orbitSphere.angle * 2) * 0.3;
        orbitSphere.mesh.rotation.x += 0.01;
        orbitSphere.mesh.rotation.y += 0.015;
      });

      // Update rings
      rings.forEach((ring) => {
        ring.mesh.rotation.x += ring.rotX;
        ring.mesh.rotation.y += ring.rotY;
        ring.mesh.rotation.z += ring.rotZ;
      });

      // Update boxes
      boxes.forEach((box) => {
        box.position.x += box.userData.vx;
        box.position.y += box.userData.vy;
        box.position.z += box.userData.vz;
        box.rotation.x += box.userData.rx;
        box.rotation.y += box.userData.ry;
        box.rotation.z += box.userData.rz;

        if (Math.abs(box.position.x) > 6) box.userData.vx *= -1;
        if (Math.abs(box.position.y) > 6) box.userData.vy *= -1;
        if (Math.abs(box.position.z) > 3) box.userData.vz *= -1;
      });

      // Update particles
      const posArray = particlesData.geometry.attributes.position.array;
      const velArray = particlesData.geometry.userData.velocity;
      
      for (let i = 0; i < posArray.length; i += 3) {
        posArray[i] += velArray[i];
        posArray[i + 1] += velArray[i + 1];
        posArray[i + 2] += velArray[i + 2];

        if (Math.abs(posArray[i]) > 10) velArray[i] *= -1;
        if (Math.abs(posArray[i + 1]) > 10) velArray[i + 1] *= -1;
        if (Math.abs(posArray[i + 2]) > 5) velArray[i + 2] *= -1;
      }
      particlesData.geometry.attributes.position.needsUpdate = true;

      // Camera interaction
      camera.position.x = mouseRef.current.x * 0.5;
      camera.position.y = mouseRef.current.y * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [createScene, createCamera, createRenderer, createParticles, createCentralSphere, createOrbitingSpheres, createRings, createBoxes, createLights, handleMouseMove, handleResize]);

  return (
    <div ref={containerRef} className="three-d-animation">
      {isLoaded && (
        <>
          <div className="animation-overlay" />
          <div className="fps-counter">{fps} FPS</div>
          <div className="mouse-indicator" style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }} />
        </>
      )}
    </div>
  );
};

export default ThreeDAnimation;
