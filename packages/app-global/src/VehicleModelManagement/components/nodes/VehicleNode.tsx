import { Handle, Position } from '@xyflow/react';
import { Card } from 'antd';
import { memo } from 'react';
import { IconifyIcon } from 'ui';
import { VehicleType } from '../../types';

interface VehicleNodeProps {
  data: {
    type: VehicleType;
  };
}

const VehicleNode = memo(({ data }: VehicleNodeProps) => {
  return (
    <Card 
      size="small" 
      className="w-48 border-2 border-blue-500 shadow-lg"
      bodyStyle={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className="text-lg font-bold mb-2">{data.type}</div>
      <IconifyIcon icon="material-symbols-light:forklift" size={48} className="text-blue-500" />
      <div className="text-xs text-gray-500 mt-2">Core Vehicle Model</div>
      
      {/* Source Handles for connecting to parameters */}
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </Card>
  );
});

export default VehicleNode;
