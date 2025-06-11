import { useRcsGlobalStore } from '@gbeata/store';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import { theme } from 'antd';
import useMapData from '../../hooks/useMapData';
import useSlotSocket from '../../hooks/useSlotSocket';
import { convertToMeters } from '../../utils';
import GoodsLocation from './goodsLocation';
import { useWmsPoints } from './useWmsPoints';

// 平库点
interface IWarehousePointProps {
  mapVertices: IMapPoints[];
}

const WmsPoints = (props: IWarehousePointProps) => {
  const { token } = theme.useToken();
  const { mapVertices } = props;

  const { points, refreshPoints, updatePointStates } = useWmsPoints();

  useEffect(() => {
    refreshPoints();
  }, []);
  if (!mapVertices) {
    return null;
  }
  const { eventData } = useSlotSocket();
  useEffect(() => {
    if (eventData) {
      updatePointStates(eventData);
    }
  }, [eventData]);

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
    const geometry = new BoxGeometry(0.6, 0.6, 0.75);
    const grayGeometry = new BoxGeometry(0.6, 0.05, 0.75);
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
      position.x,
      position.y + 2,
      position.z,
      position.x,
      position.y,
      position.z,
      true, // 平滑动画
    );
  };

  const grayMaterial = useMemo(() => {
    return new MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0.75, depthWrite: true });
  }, []);

  const material = useMemo(() => new MeshStandardMaterial({ color: '#d0975d', transparent: true }), []);

  // 判断库位是否有货
  // const locationHasGoods = (item, wsState) => {
  //   return !wsState ? item.state === 1 : wsState.State === 1;
  // };

  return (
    <>
      {points?.map((item) => {
        const floor = item?.layer ? item?.layer - 1 : 0;
        // const SpacingCoordinates = getReferencePointPosition(item.floor);
        const SpacingCoordinates = { x: 0, y: 0 };

        // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
        const position = new Vector3(
          convertToMeters(item.x - SpacingCoordinates.x),
          floor * 1 + 0.5,
          convertToMeters(0 - item.y - SpacingCoordinates.y),
        );

        return (
          <group key={item.locationCode} position={position} onClick={() => handleClick(position, item.locationCode)}>
            <GoodsLocation
              pointId={item.locationCode}
              geometry={baseMesh.geometry}
              material={material}
              state={item.state}
            />
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
      {/* <RenderText mapVertices={points}></RenderText> */}
    </>
  );
};

export default WmsPoints;
