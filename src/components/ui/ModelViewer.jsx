import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 15, 0.4);
  color: ${props => props.theme?.colors?.primary || '#00f0ff'};
  font-family: monospace;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  pointer-events: none;
  z-index: 10;
`;

const ErrorOverlay = styled(LoadingOverlay)`
  color: #ff3366;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid ${props => props.theme?.colors?.primary || '#00f0ff'}33;
  border-top-color: ${props => props.theme?.colors?.primary || '#00f0ff'};
  border-radius: 50%;
  margin-bottom: 12px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function ModelViewer({
  modelUrl,
  renderMode = 'original', // 'original' | 'wireframe'
  color = 0xff3366,
  opacity = 0.85,
  interactive = false,
  autoRotate = true,
  rotateSpeed = 0.012,
  floatAnimation = true,
  floatSpeed = 1.5,
  floatIntensity = 0.05,
  scaleFactor = 1.0,
  cameraY = 0.85,
  cameraZ = 2.3,
  onAnimate,
  onLoaded
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const modelGroupRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onAnimateRef = useRef(onAnimate);
  const onLoadedRef = useRef(onLoaded);

  useEffect(() => {
    onAnimateRef.current = onAnimate;
  }, [onAnimate]);

  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  // Core scene initialization & loading
  useEffect(() => {
    if (!modelUrl) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(false); // we set it to true after or handle it locally
    setLoading(true);
    setError(false);

    let scene, camera, renderer, controls, modelGroup, reqId, resizeObserver;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const clock = new THREE.Clock();

    try {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;

      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.set(0, cameraY, cameraZ);

      // Renderer
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight1.position.set(5, 10, 7.5);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.45);
      dirLight2.position.set(-5, 5, -5);
      scene.add(dirLight2);

      // Group Container for model animations
      modelGroup = new THREE.Group();
      scene.add(modelGroup);
      modelGroupRef.current = modelGroup;

      // OrbitControls Setup (Conditional)
      if (interactive) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 15;
        controls.minDistance = 0.8;
        controls.target.set(0, cameraY, 0);
      }

      // Load Model
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          modelRef.current = model;

          // Auto-center and normalize model scale using Bounding Box
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Shift geometry so pivot is at the exact center
          model.position.x += (model.position.x - center.x);
          model.position.y += (model.position.y - center.y);
          model.position.z += (model.position.z - center.z);

          // Standardize height and apply scale modifier
          const maxDim = Math.max(size.x, size.y, size.z);
          const baseScale = 2.15 / maxDim;
          model.scale.setScalar(baseScale * scaleFactor);

          // Apply initial materials & cache original ones
          model.traverse((child) => {
            if (child.isMesh) {
              // Cache original material for hot-swapping
              child.userData.originalMaterial = child.material;

              if (renderMode === 'wireframe') {
                child.material = new THREE.MeshBasicMaterial({
                  color: color,
                  wireframe: true,
                  transparent: true,
                  opacity: opacity
                });
              }
            }
          });

          modelGroup.add(model);
          setLoading(false);

          if (onLoadedRef.current) {
            onLoadedRef.current(model, modelGroup, scene);
          }
        },
        undefined,
        (err) => {
          console.error('Error loading GLB asset:', err);
          setError(true);
          setLoading(false);
        }
      );

      // Animation Loop
      const animate = () => {
        reqId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        if (modelGroup) {
          // Automatic rotation (only if we're not manually interacting with OrbitControls or if requested)
          if (autoRotate) {
            if (controls) {
              // Let OrbitControls handle rotation if dynamic auto-rotate is supported
              controls.autoRotate = true;
              controls.autoRotateSpeed = rotateSpeed * 60; // scaling to degree equivalent
            } else {
              modelGroup.rotation.y += rotateSpeed;
            }
          }

          // Gentle floating height
          if (floatAnimation) {
            modelGroup.position.y = Math.sin(elapsed * floatSpeed) * floatIntensity;
          }
        }

        // Keep OrbitControls updated
        if (controls) {
          controls.update();
        }

        // Custom render tick hook for parents
        if (onAnimateRef.current && modelRef.current) {
          onAnimateRef.current(modelRef.current, modelGroup, elapsed);
        }

        renderer.render(scene, camera);
      };

      animate();

      // Resize observer to auto-adapt rendering aspect ratios
      const handleResize = () => {
        const width = container.clientWidth || 300;
        const height = container.clientHeight || 300;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

    } catch (err) {
      console.error('WebGL Viewer initialization crash:', err);
      setError(true);
      setLoading(false);
    }

    // Cleanup resources
    return () => {
      if (reqId) cancelAnimationFrame(reqId);
      if (resizeObserver) resizeObserver.disconnect();
      if (controls) controls.dispose();
      if (renderer) renderer.dispose();

      const model = modelRef.current;
      if (model) {
        model.traverse((child) => {
          if (child.isMesh) {
            // Clean active materials & geometries
            if (child.geometry) child.geometry.dispose();
            
            // Clean actual material
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }

            // Clean cached original materials
            const cachedMat = child.userData.originalMaterial;
            if (cachedMat && cachedMat !== child.material) {
              if (Array.isArray(cachedMat)) {
                cachedMat.forEach(m => m.dispose());
              } else {
                cachedMat.dispose();
              }
            }
          }
        });
      }
    };
  }, [modelUrl, cameraY, cameraZ, interactive]); // reload when model source or interaction model changes

  // Dynamic hot-updates for visual rendering properties (no GLB reloading)
  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;

    model.traverse((child) => {
      if (child.isMesh) {
        if (renderMode === 'wireframe') {
          // Clean up old material if it was dynamically created
          if (child.material && child.material !== child.userData.originalMaterial) {
            child.material.dispose();
          }

          child.material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: opacity
          });
        } else {
          // Revert to original
          if (child.userData.originalMaterial) {
            // Clean up wireframe material
            if (child.material && child.material !== child.userData.originalMaterial) {
              child.material.dispose();
            }
            child.material = child.userData.originalMaterial;
          }
        }
      }
    });
  }, [color, opacity, renderMode]);

  return (
    <ViewerContainer ref={containerRef}>
      <Canvas ref={canvasRef} />
      {loading && (
        <LoadingOverlay>
          <Spinner />
          Initializing Hologram...
        </LoadingOverlay>
      )}
      {error && <ErrorOverlay>Hologram Feed Offline</ErrorOverlay>}
    </ViewerContainer>
  );
}
