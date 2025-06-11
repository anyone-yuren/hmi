import { useRcs2DGlobalStore } from '@gbeata/store';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { BoxGeometry, MeshBasicMaterial, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import useMapData from '../../hooks/useMapData';
import { convertToMeters, FLOOR_HEIGHT } from '../../utils';
import StorageText from './storageText';

// 平库点
interface IWarehousePointProps {
  mapVertices: IMapPoints[];
}

const WarehousePoint = (props: IWarehousePointProps) => {
  const { mapVertices } = props;
  if (!mapVertices) {
    return null;
  }

  const { setFellowCamera, selectStorage, setSelectStorage, setMoveToPosition } = useRcs2DGlobalStore(
    useShallow((state) => ({
      setFellowCamera: state.setFllowCamera,
      setMoveToPosition: state.setMoveToPosition,
      selectStorage: state.selectStorage,
      setSelectStorage: state.setSelectStorage,
    })),
  );

  const { getReferencePointPosition } = useMapData();
  const { controls, camera } = useThree();

  // 创建共享的几何体和材质，并组装成一个 Mesh 对象
  const baseMesh = useMemo(() => {
    const geometry = new BoxGeometry(0.8, 0.1, 0.8);
    return { geometry };
  }, []);

  const handleClick = (position, pointId) => {
    console.log('position', camera, position, pointId);
    // 修改选中点的透明度
    setSelectStorage([pointId]);
    setFellowCamera(false);
    setMoveToPosition({ x: position.x, y: 20, z: position.z });
    // camera.position(new Vector3(position.x, position.y, position.z));
    // 处理点击事件
    // eslint-disable-next-line no-new
    // controls?.setLookAt(
    //   position.x,
    //   position.y + 5,
    //   position.z,
    //   position.x,
    //   position.y,
    //   position.z,
    //   true, // 平滑动画
    // );
  };
  return (
    <>
      {mapVertices?.map((item: any) => {
        const floor = item?.floor ? item?.floor - 1 : 0;
        const SpacingCoordinates = getReferencePointPosition(item.floor);
        const position = new Vector3(
          convertToMeters(item.x - SpacingCoordinates.x),
          floor * FLOOR_HEIGHT + 0.5,
          convertToMeters(0 - item.y - SpacingCoordinates.y),
        );

        const isFull = item?.state === 1;

        // 判断当前点是否被选中，如果是，修改透明度
        const opacity = isFull ? 1 : selectStorage.includes(item.pointId) ? 1 : 0.5;
        const color = selectStorage.includes(item.pointId) ? '#0000ff' : '#d0975d';

        // 创建一个新的材质，透明度根据选中状态动态变化
        const material = new MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
        });

        return (
          <group
            key={item.pointId}
            position={position}
            onClick={() => handleClick(position, item.pointId)}
            receiveShadow
          >
            {/* 使用 Clone 实例化重复的 Mesh */}
            <mesh geometry={baseMesh.geometry} material={material} castShadow receiveShadow />
            <StorageText {...item}></StorageText>
          </group>
        );
      })}
    </>
  );
};

export default WarehousePoint;
