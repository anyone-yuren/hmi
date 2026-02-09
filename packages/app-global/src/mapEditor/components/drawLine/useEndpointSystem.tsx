import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from 'three-mesh-bvh';

// Extend BufferGeometry
(THREE.BufferGeometry.prototype as any).computeBoundsTree = computeBoundsTree;
(THREE.BufferGeometry.prototype as any).disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export interface LineData {
  id: number;
  start: THREE.Vector3;
  end: THREE.Vector3;
  points: THREE.Vector3[];
  startPointId: string;
  endPointId: string;
}

const ENDPOINT_RADIUS = 0.025; // Scaled down from 0.15
const PICKING_RADIUS = 0.15; // Reduced for tighter snap boundary

export const useEndpointSystem = (
  lineList: LineData[],
  pickingRadius = PICKING_RADIUS,
) => {
  const { gl, scene, camera, size } = useThree();

  // 1. Extract Unique Points
  const { uniquePoints, pointIdMap } = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    lineList.forEach((line) => {
      const start =
        line.start instanceof THREE.Vector3
          ? line.start
          : new THREE.Vector3(
              (line.start as any).x,
              (line.start as any).y,
              (line.start as any).z || 0,
            );
      const end =
        line.end instanceof THREE.Vector3
          ? line.end
          : new THREE.Vector3(
              (line.end as any).x,
              (line.end as any).y,
              (line.end as any).z || 0,
            );
      map.set(line.startPointId, start);
      map.set(line.endPointId, end);
    });

    const points = Array.from(map.entries());
    return {
      uniquePoints: points,
      pointIdMap: points.map((p) => p[0]),
    };
  }, [lineList]);

  // 2. Spatial Index (BVH) for Snapping
  const { bvhGeometry } = useMemo(() => {
    if (uniquePoints.length === 0) return { bvhGeometry: null };

    const triPositions: number[] = [];
    const pointIndices: number[] = [];
    const size = 0.05;

    uniquePoints.forEach(([id, pos], index) => {
      triPositions.push(pos.x, pos.y + size, pos.z);
      triPositions.push(pos.x - size, pos.y - size, pos.z);
      triPositions.push(pos.x + size, pos.y - size, pos.z);
      pointIndices.push(index, index, index);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(triPositions, 3),
    );
    geometry.setAttribute(
      'pointIndex',
      new THREE.Float32BufferAttribute(pointIndices, 1),
    );
    (geometry as any).computeBoundsTree();

    return { bvhGeometry: geometry };
  }, [uniquePoints]);

  const findSnapPoint = (pos: THREE.Vector3, snapDistance = 0.2) => {
    if (!bvhGeometry || !(bvhGeometry as any).boundsTree) return null;

    const target: any = {};
    const result = (bvhGeometry as any).boundsTree.closestPointToPoint(
      pos,
      target,
      snapDistance,
    );

    if (result && result.distance < snapDistance) {
      if (result.faceIndex !== undefined) {
        const indexAttr = bvhGeometry.index;
        const vertIndex = indexAttr
          ? indexAttr.getX(result.faceIndex * 3)
          : result.faceIndex * 3;
        const pointIndexAttr = bvhGeometry.getAttribute('pointIndex');
        if (pointIndexAttr) {
          const idIndex = pointIndexAttr.getX(vertIndex);
          const id = pointIdMap[idIndex];
          const originalPos = uniquePoints[idIndex][1];
          return { pos: originalPos, id };
        }
      }
    }
    return null;
  };

  // 3. Visuals (InstancedMesh) & 4. GPU Picking
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Create Picking Mesh separately
  const pickingMesh = useMemo(() => {
    if (uniquePoints.length === 0) return null;
    // Use larger radius for picking
    const geom = new THREE.SphereGeometry(pickingRadius, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ vertexColors: true });
    const mesh = new THREE.InstancedMesh(geom, mat, uniquePoints.length);
    return mesh;
  }, [uniquePoints.length, pickingRadius]);

  const pickingScene = useMemo(() => {
    const s = new THREE.Scene();
    if (pickingMesh) s.add(pickingMesh);
    return s;
  }, [pickingMesh]);

  const pickingTarget = useMemo(() => new THREE.WebGLRenderTarget(1, 1), []);

  // Update Instances
  useEffect(() => {
    // Ensure meshRef.current is valid before trying to update
    if (!meshRef.current) return;

    if (uniquePoints.length === 0) {
      // Even if empty, we might need to update/clear?
      // InstancedMesh with 0 count might not render, but let's be safe.
      return;
    }

    if (!pickingMesh) return;

    const tempObj = new THREE.Object3D();
    const color = new THREE.Color();

    uniquePoints.forEach(([id, pos], i) => {
      tempObj.position.copy(pos);
      tempObj.updateMatrix();

      // Visual Mesh
      meshRef.current!.setMatrixAt(i, tempObj.matrix);

      // Picking Mesh
      pickingMesh.setMatrixAt(i, tempObj.matrix);
      // Encode ID in color: i+1 (0 is background)
      color.setHex(i + 1);
      pickingMesh.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    pickingMesh.instanceMatrix.needsUpdate = true;
    if (pickingMesh.instanceColor) pickingMesh.instanceColor.needsUpdate = true;
  }, [uniquePoints, pickingMesh, uniquePoints.length]); // Added uniquePoints.length to be explicit

  // GPU Picking Function
  const getHoveredIdFromGPU = (pointer: THREE.Vector2) => {
    if (!pickingMesh || uniquePoints.length === 0) return null;

    // Pointer is -1 to 1. Convert to pixel coords.
    // three.js pointer: x [-1, 1], y [-1, 1] (up is positive)
    // view offset x, y origin is top-left usually?
    // camera.setViewOffset(fullW, fullH, x, y, w, h)
    // x, y is offset of the sub-camera.

    // Convert pointer to window coordinates (0,0 is top-left for setViewOffset usually? No, let's check docs)
    // Actually setViewOffset is for Tiled Rendering.
    // A standard trick for picking is:
    // x = ( pointer.x + 1 ) * width / 2;
    // y = ( - pointer.y + 1 ) * height / 2; (Top-left origin)

    const px = ((pointer.x + 1) / 2) * size.width;
    const py = ((-pointer.y + 1) / 2) * size.height; // Window coords top-left

    const prevTarget = gl.getRenderTarget();
    gl.setRenderTarget(pickingTarget);
    gl.setClearColor(0x000000, 0);
    gl.clear();

    // Use camera.setViewOffset to render just 1 pixel
    const originalView = (camera as any).view
      ? { ...(camera as any).view }
      : null;

    // setViewOffset(fullWidth, fullHeight, x, y, width, height)
    camera.setViewOffset(size.width, size.height, px, py, 1, 1);

    gl.render(pickingScene, camera);

    // Read pixel
    const pixelBuffer = new Uint8Array(4);
    gl.readRenderTargetPixels(pickingTarget, 0, 0, 1, 1, pixelBuffer);

    // Restore camera
    camera.clearViewOffset();
    if (originalView && originalView.enabled) {
      camera.setViewOffset(
        originalView.fullWidth,
        originalView.fullHeight,
        originalView.offsetX,
        originalView.offsetY,
        originalView.width,
        originalView.height,
      );
    }

    gl.setRenderTarget(prevTarget);

    const idIndex =
      (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];

    if (idIndex > 0 && idIndex <= uniquePoints.length) {
      const id = pointIdMap[idIndex - 1];
      const pos = uniquePoints[idIndex - 1][1];
      return { id, pos };
    }
    return null;
  };

  // Component to render
  const EndpointRender = useMemo(() => {
    return () => (
      <>
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, uniquePoints.length]}
          frustumCulled={false}
          renderOrder={999}
        >
          <sphereGeometry args={[ENDPOINT_RADIUS, 16, 16]} />
          <meshBasicMaterial color='#ffffff' depthTest={false} />
        </instancedMesh>
      </>
    );
  }, [uniquePoints.length]);

  return {
    EndpointRender,
    findSnapPoint,
    getHoveredIdFromGPU,
    uniquePoints,
  };
};
