import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Tag } from 'antd';
import React, { memo, useState } from 'react';
import { EventNodeParams } from '../../types';

// Map types to readable text/colors
const TYPE_MAP: Record<string, { label: string; color: string }> = {
  ENTRY_POINT: { label: '入库点', color: 'blue' },
  EXIT_POINT: { label: '出库点', color: 'cyan' },
  STORAGE_POINT: { label: '库位点', color: 'purple' },
  VISION: { label: '视觉', color: 'orange' },
  ACTUATOR: { label: '执行', color: 'green' },
  CHARGE: { label: '充电', color: 'lime' },
};

const SUB_TYPE_MAP: Record<string, string> = {
  SHELF_STATUS_CHECK: '货架检测',
  PALLET_POSTURE_RECOGNITION: '托盘识别',
  LIFT_UP: '升',
  LIFT_DOWN: '降',
};

const CustomNode = ({ data, isConnectable, id }: NodeProps) => {
  const params = data.params as EventNodeParams | undefined;
  const isStart = data.isStart;
  const isEnd = data.isEnd;
  const hasError = data.error as boolean;
  const onAddNode = data.onAddNode as ((id: string) => void) | undefined;
  const onDeleteNode = data.onDeleteNode as ((id: string) => void) | undefined;

  const [hovered, setHovered] = useState(false);

  if (isStart) {
    return (
      <div
        className='relative px-4 py-2 shadow-md rounded-md bg-[#1e293b] border-2 border-blue-500 text-white font-bold text-center min-w-[100px]'
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        开始
        <Handle
          type='source'
          position={Position.Right}
          isConnectable={isConnectable}
          className='opacity-0 w-4 h-4 !bg-blue-500'
        />
        {onAddNode && (
          <div
            className={`absolute -right-5 top-1/2 -translate-y-1/2 cursor-pointer text-blue-500 hover:text-blue-400 z-50 bg-[#0f172a] rounded-full transition-opacity duration-200 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onAddNode(id);
            }}
          >
            <PlusCircleOutlined style={{ fontSize: 24 }} />
          </div>
        )}
      </div>
    );
  }

  if (isEnd) {
    return (
      <div className='px-4 py-2 shadow-md rounded-md bg-[#1e293b] border-2 border-green-500 text-white font-bold text-center min-w-[100px]'>
        <Handle
          type='target'
          position={Position.Left}
          isConnectable={isConnectable}
          className='!bg-green-500'
        />
        结束
      </div>
    );
  }

  return (
    <div
      className={`relative px-3 py-2 shadow-lg rounded-md bg-[#1e293b] border text-white min-w-[180px] transition-colors ${
        hasError ? 'border-red-500 animate-pulse' : 'border-[#334155]'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {onDeleteNode && hovered && (
        <div
          className='absolute -top-2 -right-2 cursor-pointer text-gray-400 hover:text-red-500 z-50 bg-[#0f172a] rounded-full'
          onClick={(e) => {
            e.stopPropagation();
            onDeleteNode(id);
          }}
        >
          <CloseCircleOutlined style={{ fontSize: 16 }} />
        </div>
      )}

      <Handle
        type='target'
        position={Position.Left}
        isConnectable={isConnectable}
        className='!bg-[#64748b]'
      />

      <div className='font-bold border-b border-[#334155] pb-1 mb-2 text-sm text-center'>
        {data.label as React.ReactNode}
      </div>

      <div className='flex flex-col gap-1 text-xs'>
        {params?.pointType && (
          <div className='flex justify-between items-center'>
            <span className='text-gray-400'>位置:</span>
            <Tag
              color={TYPE_MAP[params.pointType]?.color}
              className='mr-0 scale-90 origin-right'
            >
              {TYPE_MAP[params.pointType]?.label}
            </Tag>
          </div>
        )}

        {params?.eventType && (
          <div className='flex justify-between items-center'>
            <span className='text-gray-400'>事件:</span>
            <Tag
              color={TYPE_MAP[params.eventType]?.color}
              className='mr-0 scale-90 origin-right'
            >
              {TYPE_MAP[params.eventType]?.label}
            </Tag>
          </div>
        )}

        {params?.subType && (
          <div className='flex justify-between items-center'>
            <span className='text-gray-400'>动作:</span>
            <span className='text-white font-mono bg-[#334155] px-1 rounded'>
              {SUB_TYPE_MAP[params.subType] || params.subType}
            </span>
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Right}
        isConnectable={isConnectable}
        className='opacity-0 w-4 h-4 !bg-[#64748b]'
      />

      {onAddNode && (
        <div
          className={`absolute -right-5 top-1/2 -translate-y-1/2 cursor-pointer text-blue-500 hover:text-blue-400 z-50 bg-[#0f172a] rounded-full transition-opacity duration-200 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onAddNode(id);
          }}
        >
          <PlusCircleOutlined style={{ fontSize: 24 }} />
        </div>
      )}
    </div>
  );
};

export default memo(CustomNode);
