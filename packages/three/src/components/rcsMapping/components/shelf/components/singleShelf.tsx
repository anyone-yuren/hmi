import { Box } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

import useMapData from '../../../hooks/useMapData';
import { convertToMeters, FLOOR_HEIGHT } from '../../../utils';

import type { ThreeElements } from '@react-three/fiber';

const locationSize = new THREE.Vector3(1, 1, 1); // 货架位置大小
const shelfRackDiameter = 0.1; // 货架杠子的直径

interface IShelf {
  layout: {
    col: number;
    layer: number;
  };
  groupProps?: ThreeElements['group'];
  floor: number;
}

const Rack = ({
  geometry,
  position,
  rotation,
}: {
  geometry: THREE.Geometry;
  position: THREE.Vector3;
  rotation?: THREE.Euler;
}) => (
  <mesh
    castShadow
    geometry={geometry}
    material={new THREE.MeshPhongMaterial({ color: 'white' })}
    position={position}
    rotation={rotation}
  />
);

function SingleShelf(props: IShelf) {
  const {
    layout: { col, layer },
    groupProps,
    floor,
  } = props;

  const { position } = groupProps;
  const { getReferencePointPosition } = useMapData();
  const SpacingCoordinates = getReferencePointPosition(floor);

  // UseMemo to cache position and geometries
  const shelfPosition = useMemo(() => {
    return new THREE.Vector3(
      convertToMeters(position.x - SpacingCoordinates.x),
      (floor - 1) * FLOOR_HEIGHT,
      convertToMeters(0 - position.z - SpacingCoordinates.y),
    );
  }, [position, SpacingCoordinates, floor]);

  const lenX = locationSize.x + shelfRackDiameter;
  const lenY = (layer + 1) * (locationSize.y + shelfRackDiameter);
  const lenZ = locationSize.z * col + (col + 1) * shelfRackDiameter;

  const rowXShelfRackGeometry = useMemo(
    () => new THREE.BoxGeometry(locationSize.z, shelfRackDiameter, shelfRackDiameter),
    [],
  );
  const rowZShelfRackGeometry = useMemo(() => new THREE.BoxGeometry(shelfRackDiameter, shelfRackDiameter, lenZ), []);
  const colShelfRackGeometry = useMemo(() => new THREE.BoxGeometry(shelfRackDiameter, lenY, shelfRackDiameter), []);

  // Render vertical rack corners
  const renderCorners = () => {
    const cornerPositions = [
      [-lenX / 2, lenY / 2, -lenZ / 2],
      [lenX / 2, lenY / 2, lenZ / 2],
      [-lenX / 2, lenY / 2, lenZ / 2],
      [lenX / 2, lenY / 2, -lenZ / 2],
    ];

    return cornerPositions.map((pos, idx) => (
      <Rack key={`corner-${idx}`} geometry={colShelfRackGeometry} position={new THREE.Vector3(...pos)} />
    ));
  };

  // Render horizontal rack layers (rowZShelfRackGeometry)
  const renderHorizontalRacks = () => {
    return new Array(layer).fill(1).map((_, index) => {
      const posY = (locationSize.y + shelfRackDiameter) * (index + 1);
      return (
        <>
          <Rack
            key={`rowZ-left-${index}`}
            geometry={rowZShelfRackGeometry}
            position={new THREE.Vector3(-lenX / 2, posY, 0)}
          />
          <Rack
            key={`rowZ-right-${index}`}
            geometry={rowZShelfRackGeometry}
            position={new THREE.Vector3(lenX / 2, posY, 0)}
          />
        </>
      );
    });
  };

  // Render the shelves based on columns (rowXShelfRackGeometry)
  const renderColumnRacks = () => {
    return new Array(layer).fill(1).map((_, layerIndex) =>
      new Array(col + 1).fill(1).map((_, colIndex) => {
        const posY = (locationSize.y + shelfRackDiameter) * (layerIndex + 1);
        const posZ = -lenZ / 2 + colIndex * (shelfRackDiameter + locationSize.z) + shelfRackDiameter / 2;
        return (
          <>
            <Rack
              key={`rowX-${layerIndex}-${colIndex}-2`}
              geometry={rowXShelfRackGeometry}
              position={new THREE.Vector3(0, posY, posZ)}
            />
            {colIndex !== 0 ? (
              <Box
                receiveShadow
                castShadow
                args={[0.8, 0.8, 0.8]}
                key={`rowX-${layerIndex}-${colIndex}-1`}
                material={new THREE.MeshStandardMaterial({ color: 'white' })}
                geometry={new THREE.BoxGeometry(locationSize.x, shelfRackDiameter, locationSize.z)}
                position={new THREE.Vector3(0, posY + 0.5, posZ - 0.5)}
              />
            ) : null}
          </>
        );
      }),
    );
  };

  return (
    <group {...groupProps} position={shelfPosition}>
      {/* 四只脚 */}
      {renderCorners()}
      {/* 上下层 */}
      {renderHorizontalRacks()}
      {/* 每一层的每一列 */}
      {renderColumnRacks()}
    </group>
  );
}

export default SingleShelf;
