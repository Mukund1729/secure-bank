import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeDAnimation.css';

const FinancialSphere3D = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 220;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060d1f);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    containerRef.current.appendChild(renderer.domElement);

    // Wireframe sphere (data mesh)
    const wireGeometry = new THREE.SphereGeometry(1.65, 32, 32);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x1f2937,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const wireSphere = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireSphere);

    // Soft glow ring behind sphere
    const glowGeometry = new THREE.RingGeometry(1.9, 2.4, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
    });
    const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
    glowRing.rotation.x = Math.PI / 2;
    scene.add(glowRing);

    // Teal & violet light trails (financial flows)
    const trailsGroup = new THREE.Group();
    const trailConfigs = [
      { color: '#2DD4BF', radius: 2.15, speed: 0.004 },
      { color: '#7C3AED', radius: 2.35, speed: 0.003 },
      { color: '#38BDF8', radius: 2.25, speed: 0.0025 },
    ];

    const trails = trailConfigs.map((cfg, idx) => {
      const points = [];
      const turns = 1.5 + idx * 0.2;
      for (let i = 0; i <= 200; i++) {
        const t = (i / 200) * Math.PI * 2 * turns;
        const x = Math.cos(t) * cfg.radius;
        const y = Math.sin(t * 0.7) * 0.75;
        const z = Math.sin(t) * cfg.radius * 0.85;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 260, 0.025, 8, true);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(geometry, material);
      trailsGroup.add(mesh);
      return { mesh, speed: cfg.speed * (idx % 2 === 0 ? 1 : -1) };
    });

    scene.add(trailsGroup);

    // Soft lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.32);
    scene.add(ambient);

    const tealLight = new THREE.PointLight(0x2dd4bf, 1.1, 30);
    tealLight.position.set(-4, 3.5, 7);
    scene.add(tealLight);

    const violetLight = new THREE.PointLight(0x7c3aed, 0.95, 28);
    violetLight.position.set(4, -2.5, 5);
    scene.add(violetLight);

    let t = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      t += 0.005;

      // Slow, elegant rotations
      wireSphere.rotation.y += 0.0025;
      wireSphere.rotation.x += 0.0012;
      trailsGroup.rotation.y += 0.0015;
      trailsGroup.rotation.x = 0.25 + Math.sin(t * 0.2) * 0.03;

      glowRing.rotation.z += 0.0008;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="three-d-animation three-d-animation--compact" />;
};

export default FinancialSphere3D;
