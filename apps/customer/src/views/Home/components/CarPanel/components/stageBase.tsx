// import { useHybirdStore } from "@/components/Pages/Hybrid/store/hybird.store";
import { Grid } from '@react-three/drei';
// interface IProps {
//   agvPosition: {
//     x: number;
//     y: number;
//     angel: number;
//   };
// }
const StageBase = (props) => {
  // const { agvPosition } = useHybirdStore(
  //   useShallow((state) => ({
  //     agvPosition: state.agvPosition,
  //   })),
  // );
  // const { camera, controls } = useThree();

  // useEffect(() => {
  //   if (controls) {
  //     controls.setPosition(
  //       agvPosition.x / 1000 + 1,
  //       4,
  //       agvPosition.y / 1000,
  //       true
  //     );
  //     controls.setTarget(agvPosition.x / 1000, 0, agvPosition.y / 1000, true);
  //   }
  // }, [agvPosition]);

  // 设置网格样式
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.8,
    cellColor: '#808080',
    sectionSize: 2,
    sectionThickness: 1, // 截面厚度
    sectionColor: '#808080',
    fadeDistance: 10, // 视距，多大开始模糊
    fadeStrength: 1,
  };

  return (
    <>
      <Grid
        args={[10000, 10000]}
        // position={[agvPosition.x / 1000, -0.1, agvPosition.y / 1000]}
        {...gridConfig}
      />
      <ambientLight color='yellow' intensity={2.5} />
      {/* 定向光 */}
      {/* <directionalLight
        castShadow
        color="red"
        ref={directionalLightRef}
        intensity={2.5}
        position={(agvPosition.x / 1000, 0, 0 - agvPosition.y / 1000)}
        shadow-mapSize={[1024, 1024]}
      ></directionalLight> */}
    </>
  );
};
export default StageBase;
