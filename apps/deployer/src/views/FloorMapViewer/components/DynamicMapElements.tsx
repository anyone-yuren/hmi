import { memo } from 'react';
import { Group, Layer } from 'react-konva';
import Agv from '../../Hybrid/components/agv';
import PointsCloudDiagV1 from '../../Hybrid/components/pointsCloudDiagV1';
import { useViewerWs } from '../hooks/useViewerWs';

const DynamicMapElements = () => {
  // 在这个独立组件中执行 WebSocket 订阅，避免触发父组件重绘
  useViewerWs();

  return (
    <>
      <Layer>
      <Group>
        <Agv />
      </Group>
      </Layer>
      <PointsCloudDiagV1 alignment={'slam'} />
    </>
  );
};

export default memo(DynamicMapElements);
