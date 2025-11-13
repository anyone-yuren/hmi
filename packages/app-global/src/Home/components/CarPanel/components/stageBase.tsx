import { Grid } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useHomeHybirdStore } from '../../../store/hybird';
// interface IProps {
//   agvPosition: {
//     x: number;
//     y: number;
//     angel: number;
//   };
// }
const StageBase = (props) => {
  const { agvPosition } = useHomeHybirdStore(
    useShallow((state) => ({
      agvPosition: state.agvPosition,
    })),
  );

  // const renderCount = useRef(0);
  // renderCount.current++;

  const { camera, controls } = useThree();

  // const directionalLightRef = useRef<DirectionalLight>(null!);
  // useHelper(directionalLightRef, DirectionalLightHelper, 2);

  // useEffect(() => {
  //   if (directionalLightRef.current) {
  //     directionalLightRef.current.target.position.set(
  //       agvPosition.x / 1000,
  //       0,
  //       agvPosition.y / 1000
  //     );
  //     directionalLightRef.current.target.updateMatrixWorld();
  //   }
  // }, []);

  useEffect(() => {
    if (controls) {
      controls.setPosition(0 - agvPosition.x / 1000 + 1, 4, agvPosition.y / 1000 + 4, true);
      controls.setTarget(0 - agvPosition.x / 1000 - 2, 0, agvPosition.y / 1000, true);
    }
  }, [agvPosition]);

  // 设置网格样式
  const gridConfig = {
    cellSize: 1,
    cellThickness: 0.8,
    cellColor: '#808080',
    sectionSize: 2,
    sectionThickness: 1, // 截面厚度
    sectionColor: '#808080',
    fadeDistance: 30, // 视距，多大开始模糊
    fadeStrength: 1, // 模糊强度
  };
  const [showHtml, setShowHtml] = useState(false);

  return (
    <>
      <Grid
        args={[10000, 10000]}
        // position={[agvPosition.x / 1000, -0.1, agvPosition.y / 1000]}
        {...gridConfig}
      />
      {/* {showHtml ? (
        <Html position={[0 - agvPosition.x / 1000, 0, agvPosition.y / 1000]}>
          <div
            style={{
              background: 'rgba(0,0,0,0.5)',
              color: '#0f0',
              padding: '6px 12px',
              borderRadius: 8,
              fontFamily: 'monospace',
              fontSize: 14,
            }}
          >
            <div>Stage渲染次数: {renderCount.current}</div>
            <div>坐标：{JSON.stringify(agvPosition)}</div>
          </div>
        </Html>
      ) : null} */}
      {/* <ambientLight intensity={2.5} /> */}
      {/* 定向光 */}
      {/* <directionalLight
        castShadow
        color='red'
        ref={directionalLightRef}
        intensity={2.5}
        position={(agvPosition.x / 1000, 4, agvPosition.y / 1000)}
        shadow-mapSize={[1024, 1024]}
      ></directionalLight> */}
    </>
  );
};
export default StageBase;
