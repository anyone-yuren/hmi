import { useMemo } from 'react';

function X20Model(props) {
  const { headerRadar, forkHeight = 0 } = props;

  const SCALE = 0.001; // 毫米转米

  // 材质配置
  const materials = {
    body: { color: '#fff', metalness: 0.3, roughness: 0.6 },
    frame: { color: '#555', metalness: 0.3, roughness: 0.6 },
    radar: { color: '#888', metalness: 0.3, roughness: 0.5 },
    fork: {
      color: '#888',
      metalness: 0.4,
      roughness: 0.5,
      depthWrite: false,
    },
    beacon: { color: '#ff0000', metalness: 0.3, roughness: 0.6 },
    pallet: { color: '#D2B48C', metalness: 0.1, roughness: 0.7, depthWrite: false, opacity: 0.9, transparent: true },
    goods: { color: '#00d1d1', metalness: 0.1, roughness: 0.7 },
  };

  // 尺寸配置
  const dimensions = useMemo(() => {
    if (headerRadar?.z) {
      return {
        body: {
          width: 450 * SCALE,
          height: 700 * SCALE,
          depth: 780 * SCALE,
          position: [0.852 + (450 * SCALE) / 2, (700 * SCALE) / 2, 0] as [number, number, number],
        },
        radar: {
          width: 0.07,
          height: headerRadar?.z - 0.7,
          depth: 0.07,
          offsetY: (headerRadar?.z - 0.7) / 2,
        },
        topPlatform: {
          width: 0.2,
          height: 0.02,
          depth: 0.2,
        },
        // 雷达警示灯
        beacon: {
          radius: 0.06,
          height: 0.1,
          offsetY: 0.05,
        },
        forks: {
          length: 1.13,
          height: 0.07,
          width: 0.18,
          offsetX: 0.287,
          offsetY: 0.03,
          positions: [-0.225, 0.225] as [number, number],
        },
      };
    } else {
      return {
        body: {
          width: 450 * SCALE,
          height: 700 * SCALE,
          depth: 780 * SCALE,
          position: [0.852 + (450 * SCALE) / 2, (700 * SCALE) / 2, 0] as [number, number, number],
        },
        radar: {
          width: 0.07,
          height: 1.4,
          depth: 0.07,
          offsetY: 0.7,
        },
        topPlatform: {
          width: 0.2,
          height: 0.02,
          depth: 0.2,
        },
        // 雷达警示灯
        beacon: {
          radius: 0.06,
          height: 0.1,
          offsetY: 0.05,
        },
        forks: {
          length: 1.13,
          height: 0.07,
          width: 0.18,
          offsetX: 0.287,
          offsetY: 0.03,
          positions: [-0.225, 0.225] as [number, number],
        },
      };
    }
  }, [headerRadar]);

  // 创建材质组件
  const Material = ({ type }: { type: keyof typeof materials }) => <meshStandardMaterial {...materials[type]} />;

  // 叉车主体组件
  const ForkliftBody = () => {
    const { width, height, depth, position } = dimensions.body;
    const halfHeight = height / 2;

    return (
      <group position={position}>
        {/* 主体 */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <Material type='body' />
        </mesh>

        {/* 雷达杆 */}
        <mesh position={[0, halfHeight + dimensions.radar.offsetY, 0]} castShadow receiveShadow>
          <boxGeometry args={[dimensions.radar.width, dimensions.radar.height, dimensions.radar.depth]} />
          <Material type='radar' />
        </mesh>

        {/* 顶部平台和警示灯 */}
        <TopPlatform />
      </group>
    );
  };

  // 顶部平台组件
  const TopPlatform = () => {
    const halfBodyHeight = dimensions.body.height / 2;

    return (
      <group position={[0, halfBodyHeight + dimensions.radar.height / 2 + dimensions.radar.offsetY, 0]}>
        {/* 平台 */}
        <mesh castShadow receiveShadow>
          <boxGeometry
            args={[dimensions.topPlatform.width, dimensions.topPlatform.height, dimensions.topPlatform.depth]}
          />
          <Material type='frame' />
        </mesh>

        {/* 警示灯 */}
        <mesh position={[0, dimensions.beacon.offsetY, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[dimensions.beacon.radius, dimensions.beacon.radius, dimensions.beacon.height, 32]} />
          <Material type='beacon' />
        </mesh>
      </group>
    );
  };

  // 货叉组件
  const Forks = useMemo(() => {
    const { length, height, width, offsetX, offsetY, positions } = dimensions.forks;

    return (
      <group position={[0, forkHeight * SCALE, 0]}>
        {positions.map((zPosition, index) => (
          <mesh key={index} castShadow receiveShadow position={[offsetX, offsetY, zPosition]}>
            <boxGeometry args={[length, height, width]} />
            <Material type='fork' />
          </mesh>
        ))}
      </group>
    );
  }, [forkHeight]);

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <ForkliftBody />
      {/* <Forks /> */}
      {Forks}
    </group>
  );
}
export default X20Model;
