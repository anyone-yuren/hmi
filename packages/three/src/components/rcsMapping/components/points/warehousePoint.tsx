import { useRcsGlobalStore } from '@gbeata/store';
import { useThree } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import useMapData from '../../hooks/useMapData';
import { convertToMeters, FLOOR_HEIGHT } from '../../utils';
import GoodsLocation from './goodsLocation';
import RenderText from './renderText';

// 平库点
interface IWarehousePointProps {
  mapVertices: IMapPoints[];
}

const WarehousePoint = (props: IWarehousePointProps) => {
  const { mapVertices } = props;
  if (!mapVertices) {
    return null;
  }

  const { setFllowCamera } = useRcsGlobalStore(
    useShallow((state) => ({
      setFllowCamera: state.setFllowCamera,
      // hasGoodLocations: state.hasGoodLocations,
    })),
  );
  // const { cameraPosition } = useCameraAnimations();

  const { getReferencePointPosition } = useMapData();
  // 存储选中点的透明度状态
  const [selectedPoint, setSelectedPoint] = useState(null);

  const { controls } = useThree();

  // console.log(controls, 'controls');
  // console.log(cameraControls, 'cameraControls');

  // 创建共享的几何体和材质，并组装成一个 Mesh 对象
  const baseMesh = useMemo(() => {
    const geometry = new BoxGeometry(0.8, 0.8, 0.8);
    const grayGeometry = new BoxGeometry(1, 0.05, 1);
    const box = new BoxGeometry();
    // return new Mesh(geometry, material); // 返回一个 Mesh 对象
    return { geometry, grayGeometry, box };
  }, []);

  const handleClick = (position, pointId) => {
    // 修改选中点的透明度
    setSelectedPoint(pointId);
    setFllowCamera(false);
    // 处理点击事件
    // eslint-disable-next-line no-new
    controls?.setLookAt(
      position.x + 2,
      position.y + 2,
      position.z + 2,
      position.x,
      position.y,
      position.z,
      true, // 平滑动画
    );
  };

  const grayMaterial = useMemo(() => {
    return new MeshBasicMaterial({ color: '#224caf', transparent: true });
  }, []);

  const material = useMemo(() => new MeshStandardMaterial({ color: '#d0975d', transparent: true }), []);

  // 判断库位是否有货
  // const locationHasGoods = (item, wsState) => {
  //   return !wsState ? item.state === 1 : wsState.State === 1;
  // };

  return (
    <>
      {mapVertices.map((item) => {
        const floor = item?.floor ? item?.floor - 1 : 0;
        const SpacingCoordinates = getReferencePointPosition(item.floor);

        // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
        const position = new Vector3(
          convertToMeters(item.x - SpacingCoordinates.x),
          floor * FLOOR_HEIGHT + 0.5,
          convertToMeters(0 - item.y - SpacingCoordinates.y),
        );

        // 判断当前点是否被选中，如果是，修改透明度
        const opacity = selectedPoint === item.pointId ? 1 : 1;
        const color = selectedPoint === item.pointId ? '#0000ff' : '#d0975d';
        if (item.pointId === 35857) {
          console.log('state', item.state);
        }
        return (
          <group key={item.pointId} position={position} onClick={() => handleClick(position, item.pointId)}>
            <GoodsLocation pointId={item.pointId} geometry={baseMesh.geometry} material={material} state={item.state} />
            <mesh
              geometry={baseMesh.grayGeometry}
              material={grayMaterial}
              position={[0, -0.4, 0]}
              scale={[1, 1, 1]}
            ></mesh>
            {/* {grayMesh} */}
          </group>
        );
      })}
      <RenderText mapVertices={mapVertices}></RenderText>
    </>
  );
};

export default WarehousePoint;
