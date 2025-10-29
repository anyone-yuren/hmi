import { useMemo } from 'react';

function Fork15lift(props) {
  const { forkHeight, headerRadar } = props;
  const SCALE = 0.001; // 毫米转米

  // 材质配置
  const materials = {
    body: { color: '#11d1d1', metalness: 0.3, roughness: 0.6 },
    frame: { color: '#555', metalness: 0.3, roughness: 0.6 },
    radar: { color: '#888', metalness: 0.3, roughness: 0.5 },
    fork: { color: '#888', metalness: 0.4, roughness: 0.5 },
    topPlate: { color: '#555', metalness: 0.3, roughness: 0.6 },
    beacon: { color: '#ff0000', metalness: 0.3, roughness: 0.6 },
    wheel: { color: '#ff0', metalness: 0.4, roughness: 0.5 },
    yyStrut: { color: '#ffffff', metalness: 0.3, roughness: 0.6 },
  };

  // 创建可复用的材质组件
  const createMaterial = (type) => <meshStandardMaterial {...materials[type]} />;
  // 尺寸配置
  const dimensions = {
    body: {
      size: 1100 * SCALE,
      position: [(1100 * SCALE) / 2, (1100 * SCALE) / 2, 0] as [number, number, number],
    },
    mast: {
      height: 2040 * SCALE,
      beam: {
        width: 0.15,
        depth: 0.15,
      },
      crossbeam: {
        width: 0.15,
        height: 0.15 / 2,
        depth: 0.8,
      },
    },
    forks: {
      length: 1.1,
      height: 0.06,
      width: 0.13,
      spacing: 0.305,
      offset: 0.016,
      verticalOffset: 0.03,
    },
    pallet: {
      width: 1,
      length: 1,
      height: 0.2,
    },
    radar: {
      width: 0.06,
      height: 1,
      depth: 0.06,
    },
    topPlate: {
      width: 0.2,
      height: 0.02,
      depth: 0.2,
    },
    beacon: {
      radius: 0.06,
      height: 0.1,
    },
    wheels: {
      radius: 0.11,
      width: 0.12,
      positions: [-0.465, 0.465] as [number, number],
    },
  };

  // 创建材质组件
  const Material = ({ type }: { type: keyof typeof materials }) => <meshStandardMaterial {...materials[type]} />;

  // 叉车主体组件
  const ForkliftBody = useMemo(() => {
    if (!headerRadar?.z) return null;
    const { size, position } = dimensions.body;
    const halfHeight = size / 2;

    return (
      <group position={position}>
        {/* 主体 */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[size, size, size]} />
          <Material type='body' />
        </mesh>

        {/* 雷达杆 */}
        <group position={[0, headerRadar?.z / 2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[dimensions.radar.width, headerRadar?.z - size, dimensions.radar.depth]} />
            <Material type='radar' />
          </mesh>

          {/* 顶部平台 */}
          <mesh position={[0, (headerRadar?.z - size) / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[dimensions.topPlate.width, dimensions.topPlate.height, dimensions.topPlate.depth]} />
            <Material type='topPlate' />
          </mesh>

          {/* 警示灯 */}
          <mesh position={[0, (headerRadar?.z - size) / 2 + 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry
              args={[dimensions.beacon.radius, dimensions.beacon.radius, dimensions.beacon.height, 32]}
            />
            <Material type='beacon' />
          </mesh>
        </group>
      </group>
    );
  }, [headerRadar]);

  // 机械臂组件
  const MastAssembly = () => {
    const { height, beam, crossbeam } = dimensions.mast;
    const halfHeight = height / 2;
    const beamPositions: [number, number, number][] = [
      [-beam.width / 2, 0, -0.4 + beam.depth / 2],
      [-beam.width / 2, 0, 0.4 - beam.depth / 2],
    ];

    return (
      <group position={[0, halfHeight, 0]}>
        {/* 立柱 */}
        {beamPositions.map((position, index) => (
          <group position={position}>
            <mesh key={index} castShadow receiveShadow>
              <boxGeometry args={[beam.width, height, beam.depth]} />
              <Material type='frame' />
            </mesh>
            {/* 液压杆 */}
            {forkHeight * SCALE > dimensions.mast.height ? (
              <group position={[0, dimensions.mast.height / 2 + (forkHeight * SCALE - dimensions.mast.height) / 2, 0]}>
                <mesh castShadow receiveShadow position={[0, 0, index === 0 ? -0.05 : 0.05]}>
                  <cylinderGeometry args={[0.02, 0.02, forkHeight * SCALE - dimensions.mast.height + 0.15 / 2, 32]} />
                  {createMaterial('yyStrut')}
                </mesh>
                <mesh castShadow receiveShadow position={[0, 0, index === 0 ? 0.05 : -0.05]}>
                  <boxGeometry args={[0.1, forkHeight * SCALE - dimensions.mast.height + 0.15 / 2, 0.05]} />
                  {createMaterial('frame')}
                </mesh>
              </group>
            ) : null}
          </group>
        ))}

        {/* 顶部横梁 */}
        <mesh
          castShadow
          receiveShadow
          position={[
            0,
            forkHeight * SCALE > dimensions.mast.height
              ? forkHeight * SCALE + 0.15 / 2 - dimensions.mast.height / 2
              : dimensions.mast.height / 2,
            0,
          ]}
        >
          <boxGeometry args={[crossbeam.width, crossbeam.height, crossbeam.depth]} />
          <Material type='frame' />
        </mesh>

        {/* 轮子 */}
        <Wheels />
      </group>
    );
  };

  // 轮子组件
  const Wheels = () => {
    const { radius, width, positions } = dimensions.wheels;
    const wheelY = -dimensions.mast.height / 2 + radius;

    return (
      <group position={[-0.12, wheelY, 0]}>
        {positions.map((zPosition, index) => (
          <mesh key={index} position={[0, 0, zPosition]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[radius, radius, width, 32]} />
            <Material type='wheel' />
          </mesh>
        ))}
      </group>
    );
  };

  // 货叉组件
  const Forks = useMemo(() => {
    const { length, height, width, spacing, offset, verticalOffset } = dimensions.forks;
    const forkPositions: [number, number, number][] = [
      [offset, verticalOffset, -spacing],
      [offset, verticalOffset, spacing],
    ];
    return (
      <group position={[-(1130 * SCALE) / 2, forkHeight * SCALE, 0]}>
        {forkPositions.map((position, index) => (
          <mesh key={index} castShadow receiveShadow position={position}>
            <boxGeometry args={[length, height, width]} />
            <Material type='fork' />
          </mesh>
        ))}
      </group>
    );
  }, [forkHeight]);

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      {ForkliftBody}
      <MastAssembly />
      {/* <Forks /> */}
      {Forks}
    </group>
  );
}
export default Fork15lift;
