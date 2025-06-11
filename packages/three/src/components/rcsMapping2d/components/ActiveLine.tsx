import { useRcs2DGlobalStore } from '@gbeata/store';
import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import { CatmullRomCurve3, LineBasicMaterial, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import useMapData from '../hooks/useMapData';
import { convertToMeters, FLOOR_HEIGHT } from '../utils';

const ActiveLine = () => {
  const { getReferencePointPosition } = useMapData();
  const { activeFloor: floor, activeLines } = useRcs2DGlobalStore(
    useShallow((state) => ({
      activeFloor: state.activeFloor,
      activeLines: state.activeLines,
    })),
  );
  // 共享材质，区分前进和后退的箭头颜色
  const sharedMaterials = useMemo(
    () => ({
      line: new LineBasicMaterial({ color: 0xff0000, linewidth: 100 }), // 红色
    }),
    [],
  );

  // 计算曲线
  const curves = useMemo(() => {
    return activeLines
      .filter((edge) => (floor === -1 ? true : edge.floor === floor))
      .filter((edge) => (floor === -1 ? true : !edge.isVirtual))
      .map((edge) => {
        const edgeFloor = edge?.floor ? edge.floor - 1 : 0;
        const SpacingCoordinates = getReferencePointPosition(edge.floor);

        const controlPoints = edge.controlPoint.map((point) => {
          const position = new Vector3(
            convertToMeters(point.x - SpacingCoordinates.x),
            edgeFloor * FLOOR_HEIGHT + 0.025,
            convertToMeters(0 - point.y - SpacingCoordinates.y),
          );
          return position;
        });
        const curve = new CatmullRomCurve3(controlPoints);
        return { curve, edgeId: edge.edgeId, directionType: edge.directionType, floor: edgeFloor };
      });
  }, [activeLines, floor]);
  // 预创建箭头几何体

  // 预创建箭头材质（优化：避免重复创建材质）
  const lines = useMemo(() => {
    return curves.map(({ curve }, index) => {
      const points = curve.getPoints(20);
      return (
        <group key={index}>
          <Line points={points} lineWidth={5} color={'red'} />
        </group>
      );
    });
  }, [curves, sharedMaterials]);

  return <>{lines}</>;
};

export default ActiveLine;
