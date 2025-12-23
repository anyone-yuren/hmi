import { Handle, Position } from '@xyflow/react';
import { Checkbox } from 'antd';
import { useVisionFlowStore } from '../store/visionFlowStore';

export default function VisionSceneSelectNode() {
  const scenes = useVisionFlowStore((s) => s.scenes);
  const setScenes = useVisionFlowStore((s) => s.setScenes);

  return (
    <div className='w-64 p-2 bg-blue-500 border rounded'>
      <div className='font-semibold mb-2'>选择场景（可多选）</div>

      <div className='nodrag'>
        <Checkbox.Group
          value={scenes}
          onChange={(v) => setScenes(v as any)}
          options={[
            { label: '单箱取货', value: 'single' },
            { label: '托盘取货', value: 'pallet' },
          ]}
        />
      </div>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
}
