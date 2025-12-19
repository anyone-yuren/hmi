import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';

function PCDModel({ url }: { url: string }) {
  const points = useLoader(PCDLoader, url) as THREE.Points;
  points.frustumCulled = true; //点云整体出视锥时直接不画
  useEffect(() => {
    const geometry = points.geometry;
    geometry.computeBoundingSphere();

    const material = points.material as THREE.PointsMaterial;

    material.size = 0.02;
    material.sizeAttenuation = false;
    material.fog = false;
    material.toneMapped = false;
    material.transparent = false;
    material.depthWrite = true;
    material.depthTest = true;
    points.frustumCulled = true; //点云整体出视锥时直接不画

    const position = geometry.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(position.count * 3);

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      const t = (y - minY) / (maxY - minY + 1e-6);

      const color = new THREE.Color();
      color.setHSL((1 - t) * 0.6, 1.0, 0.5);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    material.vertexColors = true;
  }, [points]);

  return <primitive object={points} rotation={[Math.PI / 2, Math.PI / 11, -Math.PI / 2]} position={[0, 0.2, 0]} />;
}

export default PCDModel;
