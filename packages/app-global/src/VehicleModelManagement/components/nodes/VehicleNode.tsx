import { Handle, Position } from '@xyflow/react';
import { Card } from 'antd';
import { memo } from 'react';
import K16Img from '../../../assets/vehicles/MW_K16.png';
import O20Img from '../../../assets/vehicles/MW_O20.png';
import R16Img from '../../../assets/vehicles/MW_R16.png';
import SE15Img from '../../../assets/vehicles/MW_SE15.png';
import SL14Img from '../../../assets/vehicles/MW_SL14.png';
import X20Img from '../../../assets/vehicles/MW_X20.png';
import { VehicleType } from '../../types';

interface VehicleNodeProps {
  data: {
    type: VehicleType;
  };
}

const VEHICLE_IMAGES: Record<string, string> = {
  x20: X20Img,
  SE15: SE15Img,
  SE14: SL14Img,
  K16: K16Img,
  O20: O20Img,
  R16: R16Img,
};

const VehicleNode = memo(({ data }: VehicleNodeProps) => {
  const imageSrc = VEHICLE_IMAGES[data.type] || X20Img;

  return (
    <Card
      size='small'
      className='w-48 shadow-lg'
      style={{ borderColor: '#00d1d1', borderWidth: '2px' }}
      bodyStyle={{
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className='text-lg font-bold mb-2'>{data.type}</div>
      <img
        src={imageSrc}
        alt={data.type}
        className='w-32 h-auto object-contain'
      />
      <div className='text-xs text-gray-500 mt-2'>核心车型节点</div>

      {/* Source Handles for connecting to parameters */}
      <Handle
        type='source'
        position={Position.Right}
        id='right'
        style={{ background: '#00d1d1' }}
      />
      <Handle
        type='source'
        position={Position.Left}
        id='left'
        style={{ background: '#00d1d1' }}
      />
      <Handle
        type='source'
        position={Position.Top}
        id='top'
        style={{ background: '#00d1d1' }}
      />
      <Handle
        type='source'
        position={Position.Bottom}
        id='bottom'
        style={{ background: '#00d1d1' }}
      />
    </Card>
  );
});

export default VehicleNode;
