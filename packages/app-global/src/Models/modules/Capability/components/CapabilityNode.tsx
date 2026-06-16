import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import type { Node, NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { Popover } from 'antd';
import clsx from 'classnames';
import { memo } from 'react';
import type { CapabilityNodeData } from '../types';

const STATUS_ICON = {
  done: <CheckCircleFilled className='text-green-400' />,
  ready: <ClockCircleFilled />,
  disabled: <CloseCircleFilled />,
};

export default memo(function CapabilityNode({
  data,
}: NodeProps<Node<CapabilityNodeData>>) {
  const { label, status, hasChildren, expanded, onToggleExpand } = data;
  const content = (
    <div>
      <p>状态: {status}</p>
      <p>名称: {label}</p>
    </div>
  );

  return (
    <Popover
      content={content}
      title='基本信息'
      trigger='click'
      placement={expanded ? 'top' : 'right'}
    >
      <div
        className={clsx(
          'bg-[#222] shadow-custom-box p-2 rounded-md relative group min-w-[120px] text-center',
          {
            'shadow-[#00d1d1] !bg-[#00d1d1]/20': status === 'done',
            'shadow-gray-800': status !== 'done',
          },
        )}
      >
        {/* 左 */}
        <Handle
          type='target'
          position={Position.Left}
          id='left'
          isConnectable={false}
        />
        <Handle
          type='source'
          position={Position.Left}
          id='left-source'
          isConnectable={false}
        />
        {/* 右 */}
        <Handle
          type='source'
          position={Position.Right}
          id='right'
          isConnectable={false}
        />
        <Handle
          type='target'
          position={Position.Right}
          id='right-target'
          isConnectable={false}
        />

        {/* 上 */}
        <Handle
          type='target'
          position={Position.Top}
          id='top'
          isConnectable={false}
        />
        {/* 下 */}
        <Handle
          type='source'
          position={Position.Bottom}
          id='bottom'
          isConnectable={false}
        />

        <span className='title mr-2'>{label}</span>
        <span className='icon'>{STATUS_ICON[status]}</span>

        {hasChildren && (
          <div
            className='absolute -bottom-6 left-1/2 -translate-x-1/2 cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity'
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand?.(!expanded);
            }}
          >
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </div>
        )}
      </div>
    </Popover>
  );
});
