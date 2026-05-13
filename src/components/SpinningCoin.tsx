"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  Clock,
  CylinderGeometry,
  DirectionalLight,
  FrontSide,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from "three";

/** Radians per second around Y — one place to tune spin speed (time-based, not per-frame). */
export const SPINNING_COIN_ROTATION_RAD_PER_SEC = 1.15;

interface SpinningCoinProps {
  frontImage: string;
  size?: number;
  /** Angular velocity in radians per second (not per animation frame). */
  rotationSpeed?: number;
  edgeColor?: string;
  coinThickness?: number;
}

export function SpinningCoin({
  frontImage,
  size = 152,
  rotationSpeed = SPINNING_COIN_ROTATION_RAD_PER_SEC,
  edgeColor = "#d4af37",
  coinThickness = 0.18,
}: SpinningCoinProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.outputColorSpace = SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const light = new AmbientLight("#ffffff", 1.5);
    scene.add(light);
    const keyLight = new DirectionalLight("#ffffff", 1.1);
    keyLight.position.set(2, 1.5, 3);
    scene.add(keyLight);

    const geometry = new CylinderGeometry(1, 1, coinThickness, 96, 1, false);
    geometry.rotateX(Math.PI / 2);

    const loader = new TextureLoader();
    const frontTexture = loader.load(frontImage);
    frontTexture.colorSpace = SRGBColorSpace;
    /* Cylinder cap UVs are laid out rotated vs. a flat image; center pivot for upright art */
    frontTexture.center.set(0.5, 0.5);
    frontTexture.rotation = -Math.PI / 2;
    frontTexture.wrapT = RepeatWrapping;
    frontTexture.repeat.y = -1;
    frontTexture.offset.y = 1;

    const backTexture = loader.load(frontImage);
    backTexture.colorSpace = SRGBColorSpace;
    backTexture.wrapS = RepeatWrapping;
    backTexture.wrapT = RepeatWrapping;
    backTexture.repeat.set(-1, -1);
    backTexture.offset.set(1, 1);
    backTexture.center.set(0.5, 0.5);
    backTexture.rotation = -Math.PI / 2;

    const edgeMaterial = new MeshStandardMaterial({ color: edgeColor });
    const frontMaterial = new MeshStandardMaterial({
      map: frontTexture,
      side: FrontSide,
    });
    const backMaterial = new MeshStandardMaterial({
      map: backTexture,
      side: FrontSide,
    });

    const coin = new Mesh(geometry, [edgeMaterial, frontMaterial, backMaterial]);
    scene.add(coin);

    let frameId = 0;
    const clock = new Clock();

    const animate = () => {
      coin.rotation.y += rotationSpeed * clock.getDelta();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      scene.remove(coin);
      geometry.dispose();
      edgeMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      frontTexture.dispose();
      backTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [coinThickness, edgeColor, frontImage, rotationSpeed, size]);

  return (
    <div
      ref={containerRef}
      className="shrink-0 rounded-full"
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    />
  );
}
