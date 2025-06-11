import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { memo, Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

// import { points } from './data/points';
const points = []

const parseData = (data) => {
  return data.map((item) => {
    const values = item.split(' ').map(parseFloat);
    return {
      x: values[0],
      y: values[1],
      z: values[2],
      intensity: values[3],
    };
  });
};

const pointsData = parseData(points);

const PointClouds = () => {
  const pointGeometry = useMemo(() => {
    const positions = [];
    const colors = [];
    pointsData.forEach((point) => {
      positions.push(point.x, point.y, point.z);

      // 将强度值映射到颜色（强度越大，颜色越红）
      const { intensity } = point;
      const color = new THREE.Color(1, 1 - intensity / 100, 1 - intensity / 100); // 颜色从蓝色到红色
      colors.push(color.r, color.g, color.b);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, [points]);
  return (
    <>
      <Canvas camera={{ position: [-5, 0, -15], fov: 45 }}>
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <points>
            <bufferGeometry attach='geometry' {...pointGeometry} />
            <pointsMaterial attach='material' size={0.1} vertexColors={true} />
          </points>
        </Suspense>
        <ContactShadows position={[0, -4.5, 0]} scale={20} blur={2} far={4.5} />
        <OrbitControls enablePan={true} enableZoom={true} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI} />
      </Canvas>
    </>
  );
};

export default PointClouds;
