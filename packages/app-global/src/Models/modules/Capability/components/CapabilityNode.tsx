import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import type { Node, NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import clsx from 'classnames';
import { memo } from 'react';
import type { CapabilityNodeData } from '../types';

const STATUS_ICON = {
  done: <CheckCircleFilled />,
  ready: <ClockCircleFilled />,
  disabled: <CloseCircleFilled />,
};

export default memo(function CapabilityNode({
  data,
}: NodeProps<Node<CapabilityNodeData>>) {
  const { label, status } = data;
  console.log('status', status);

  return (
    <div
      className={clsx(
        'bg-[#222] shadow-custom-box shadow-green-400 p-2 rounded-md',
        status,
      )}
    >
      {/* 左 */}
      <Handle type='target' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Left} id='left-source' />
      {/* 右 */}
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='target' position={Position.Right} id='right-target' />

      {/* 上 */}
      <Handle type='target' position={Position.Top} id='top' />
      {/* 下 */}
      <Handle type='source' position={Position.Bottom} id='bottom' />

      <span className='title'>{label}</span>
      <span className='icon'>{STATUS_ICON[status]}</span>
    </div>
  );
});
