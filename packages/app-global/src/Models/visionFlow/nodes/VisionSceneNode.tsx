import { Handle, Position } from '@xyflow/react';

export default function VisionSceneNode({ data }: any) {
  return (
    <div className='w-48 p-2 bg-green-500 border rounded'>
      <div className='font-semibold'>{data.scene === 'single' ? '单箱取货' : '托盘取货'}</div>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
}
