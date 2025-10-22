function X20sModel() {
  const SCALE = 0.001; // 毫米转米

  // 材质配置
  const materials = {
    body: { color: '#fff', metalness: 0.3, roughness: 0.6 },
    frame: { color: '#555', metalness: 0.3, roughness: 0.6 },
    radar: { color: '#888', metalness: 0.3, roughness: 0.5 },
    fork: { color: '#888', metalness: 0.4, roughness: 0.5 },
    beacon: { color: '#ff0000', metalness: 0.3, roughness: 0.6 },
  };

  // 尺寸配置
  const dimensions = {
    body: {
      width: 450 * SCALE,
      height: 700 * SCALE,
      depth: 895 * SCALE,
      position: [0.948 + (450 * SCALE) / 2, (700 * SCALE) / 2, 0] as [number, number, number],
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
    beacon: {
      radius: 0.06,
      height: 0.1,
      offsetY: 0.05,
    },
    forks: {
      length: 1.206,
      height: 0.07,
      width: 0.18,
      offsetX: 0.345,
      offsetY: 0.03,
      positions: [-0.225, 0.225] as [number, number],
    },
  };

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
  const Forks = () => {
    const { length, height, width, offsetX, offsetY, positions } = dimensions.forks;

    return (
      <group position={[0, 0, 0]}>
        {positions.map((zPosition, index) => (
          <mesh key={index} castShadow receiveShadow position={[offsetX, offsetY, zPosition]}>
            <boxGeometry args={[length, height, width]} />
            <Material type='fork' />
          </mesh>
        ))}
      </group>
    );
  };

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <ForkliftBody />
      <Forks />
    </group>
  );
}
export default X20sModel;
