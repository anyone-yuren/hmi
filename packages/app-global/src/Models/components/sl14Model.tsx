import { Base, Geometry, Subtraction } from '@react-three/csg';
import { useMemo } from 'react';
function Sl14Model(props) {
  const { forksPositionZ = 0, palletVisible = false } = props;
  const SCALE = 0.001; // 毫米转米

  // 材质配置
  const materials = {
    body: { color: '#11d1d1', metalness: 0.3, roughness: 0.6 },
    frame: { color: '#555', metalness: 0.3, roughness: 0.6 },
    radar: { color: '#888', metalness: 0.3, roughness: 0.5 },
    fork: { color: '#888', metalness: 0.4, roughness: 0.5 },
    topPlate: { color: '#555', metalness: 0.3, roughness: 0.6 },
    beacon: { color: '#ff0000', metalness: 0.3, roughness: 0.6 },
    pallet: { color: '#D2B48C', metalness: 0.1, roughness: 0.7 },
  };

  // 创建可复用的材质组件
  const createMaterial = (type) => <meshStandardMaterial {...materials[type]} />;

  // 尺寸计算
  const dimensions = {
    body: {
      width: 523 * SCALE,
      height: 1300 * SCALE,
      depth: 1004 * SCALE,
    },
    mast: {
      height: 2000 * SCALE,
    },
    pallet: {
      width: 1,
      length: 1,
      height: 0.2,
    },
  };

  // 叉车主体
  const ForkliftBody = () => (
    <group position={[0.88, dimensions.body.height / 2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[dimensions.body.width, dimensions.body.height, dimensions.body.depth]} />
        {createMaterial('body')}
      </mesh>

      {/* 雷达杆 */}
      <mesh position={[0, dimensions.body.height / 2 + 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 1, 0.06]} />
        {createMaterial('radar')}
      </mesh>

      {/* 顶部平台 */}
      <mesh position={[0, dimensions.body.height / 2 + 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.02, 0.2]} />
        {createMaterial('topPlate')}
      </mesh>

      {/* 警示灯 */}
      <mesh position={[0, dimensions.body.height / 2 + 1 + 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 32]} />
        {createMaterial('beacon')}
      </mesh>
    </group>
  );

  // 机械臂组件
  const MastAssembly = () => {
    const beamProps = {
      args: [0.15, dimensions.mast.height, 0.15],
      material: createMaterial('frame'),
    };
    const beamArgs: [number, number, number] = [0.15, dimensions.mast.height, 0.15];

    return (
      <group position={[0.62, dimensions.mast.height / 2, 0]}>
        {/* 左侧立柱 */}
        <mesh castShadow receiveShadow position={[-0.15 / 2, 0, -0.4 + 0.15 / 2]}>
          <boxGeometry args={beamArgs} />
          {createMaterial('frame')}
        </mesh>

        {/* 右侧立柱 */}
        <mesh castShadow receiveShadow position={[-0.15 / 2, 0, 0.4 - 0.15 / 2]}>
          <boxGeometry args={beamArgs} />
          {createMaterial('frame')}
        </mesh>

        {/* 顶部横梁 */}
        <mesh castShadow receiveShadow position={[0, dimensions.mast.height / 2, 0]}>
          <boxGeometry args={[0.15, 0.15 / 2, 0.8]} />
          {createMaterial('frame')}
        </mesh>
      </group>
    );
  };

  // 货叉组件
  const Forks = () =>
    useMemo(() => {
      const forkGeometry = <boxGeometry args={[1.206, 0.06, 0.17]} />;

      return (
        <group position={[0, forksPositionZ * SCALE, 0]}>
          {/* 左侧货叉 */}
          <mesh castShadow receiveShadow position={[0.016, 0.03, -0.225]}>
            {forkGeometry}
            {createMaterial('fork')}
          </mesh>

          {/* 右侧货叉 */}
          <mesh castShadow receiveShadow position={[0.016, 0.03, 0.225]}>
            {forkGeometry}
            {createMaterial('fork')}
          </mesh>

          {palletVisible && (
            <mesh key='pallet' castShadow receiveShadow position={[0, 0, 0]}>
              <Geometry>
                <Base>
                  <boxGeometry
                    args={[dimensions?.pallet.length, dimensions?.pallet.height, dimensions?.pallet.width]}
                  />
                </Base>
                <Subtraction position={[0, -0.12, 0]}>
                  <boxGeometry args={[1, 0.3, 0.8]} />
                </Subtraction>
              </Geometry>
              {/* <Material type='pallet' /> */}
              {createMaterial('pallet')}
            </mesh>
          )}
        </group>
      );
    }, [palletVisible]);

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <ForkliftBody />
      <MastAssembly />
      {/* <Forks /> */}
      {Forks}
    </group>
  );
}

export default Sl14Model;
