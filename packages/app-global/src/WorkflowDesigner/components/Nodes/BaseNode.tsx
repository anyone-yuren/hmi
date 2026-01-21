import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  EllipsisOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Dropdown, MenuProps } from 'antd';
import clsx from 'classnames';
import React, { memo } from 'react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { WorkflowNodeData } from '../../types';

interface BaseNodeProps extends NodeProps<any> {
  data: WorkflowNodeData;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  isStart?: boolean;
  isEnd?: boolean;
}

const BaseNode = memo(({ id, data, selected, children, icon, color = 'blue', isStart, isEnd }: BaseNodeProps) => {
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const selectNode = useWorkflowStore((state) => state.selectNode);

  const statusIcon = {
    pending: <ClockCircleFilled className="text-gray-400" />,
    running: <LoadingOutlined className="text-blue-500" />,
    success: <CheckCircleFilled className="text-green-500" />,
    failure: <CloseCircleFilled className="text-red-500" />,
  }[data.status || 'pending'];

  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      label: '删除节点',
      danger: true,
      onClick: () => deleteNode(id),
    },
  ];

  const handleConnectClick = (e: React.MouseEvent, type: 'source' | 'target') => {
    // Only handle source clicks for auto-connect
    if (type === 'source') {
      // Trigger a custom event that Canvas listens to, or call a store action
      // Since Canvas is where the menu logic lives, we can dispatch a custom DOM event
      // or simply rely on the fact that clicking a handle is a distinct user intent.
      // A simple way is to dispatch a custom event on the window.
      const event = new CustomEvent('workflow:handle-click', {
        detail: { nodeId: id, x: e.clientX, y: e.clientY }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div
      className={clsx(
        'min-w-[200px] rounded-lg border-2 bg-[#2a2a2a] shadow-md transition-all',
        selected ? 'border-blue-500 shadow-lg' : data.isValid === false ? 'border-red-500' : 'border-gray-600',
        'hover:border-blue-400'
      )}
    >
      {/* Header */}
      <div className={clsx('flex items-center justify-between rounded-t-lg px-3 py-2', `bg-${color}-900/30 border-b border-gray-700`)}>
        <div className="flex items-center gap-2">
          {icon || <PlayCircleOutlined className="text-gray-400" />}
          <span className="font-medium text-gray-200">{data.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {statusIcon}
          {!isStart && !isEnd && (
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <div className="cursor-pointer rounded p-1 hover:bg-gray-700 text-gray-400">
                <EllipsisOutlined />
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 text-sm text-gray-400">
        {data.description && <div className="mb-2 text-xs text-gray-500">{data.description}</div>}
        {children}
      </div>

      {/* Handles */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !bg-gray-400 hover:!bg-blue-500 border-none"
        />
      )}
      {!isEnd && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !bg-gray-400 hover:!bg-blue-500 border-none cursor-pointer"
          onClick={(e) => handleConnectClick(e, 'source')}
        />
      )}
    </div>
  );
});

export default BaseNode;
