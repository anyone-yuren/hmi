import {
  ApiFilled,
  CodeFilled,
  DatabaseFilled,
  ExperimentFilled,
  NodeExpandOutlined,
  PartitionOutlined,
  RobotFilled,
  ThunderboltFilled,
} from '@ant-design/icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { memo } from 'react';
import { WorkflowNodeData } from '../../types';
import BaseNode from './BaseNode';

const CommonNode = memo((props: NodeProps) => {
  const { type } = props.data as WorkflowNodeData;

  const config: Record<
    string,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    'data-acquisition': {
      icon: <ExperimentFilled />,
      color: 'cyan',
      label: '数据采集',
    },
    processing: { icon: <CodeFilled />, color: 'blue', label: '处理' },
    control: { icon: <ThunderboltFilled />, color: 'orange', label: '控制' },
    execution: { icon: <RobotFilled />, color: 'purple', label: '执行' },
    integration: { icon: <ApiFilled />, color: 'geekblue', label: '集成' },
    'sub-process': {
      icon: <DatabaseFilled />,
      color: 'magenta',
      label: '子流程',
    },
    condition: {
      icon: <NodeExpandOutlined />,
      color: 'gold',
      label: '条件分支',
    },
    classifier: {
      icon: <PartitionOutlined />,
      color: 'volcano',
      label: '分类器',
    },
  };

  const nodeConfig = config[type as string] || {
    icon: <CodeFilled />,
    color: 'gray',
    label: '未知',
  };

  return (
    <BaseNode
      {...props}
      color={nodeConfig.color}
      icon={
        <span className={`text-${nodeConfig.color}-600`}>
          {nodeConfig.icon}
        </span>
      }
      // If it's a classifier, we handle source handles manually
      isEnd={type === 'classifier'}
    >
      <div className='flex flex-col gap-1'>
        <div className='text-xs text-gray-500'>{nodeConfig.label}</div>

        {/* Special rendering for Classifier */}
        {type === 'classifier' && (
          <div className='relative mt-2 flex flex-col gap-2 min-h-[40px]'>
            {/* We render custom source handles for classifier */}
            <div className='flex items-center justify-end relative h-5'>
              <span className='text-[10px] text-gray-400 mr-2'>Class A</span>
              <Handle
                type='source'
                position={Position.Right}
                id='source-a'
                className='!h-2 !w-2 !bg-volcano-500 !border-none'
                style={{ top: '50%' }}
              />
            </div>
            <div className='flex items-center justify-end relative h-5'>
              <span className='text-[10px] text-gray-400 mr-2'>Class B</span>
              <Handle
                type='source'
                position={Position.Right}
                id='source-b'
                className='!h-2 !w-2 !bg-volcano-500 !border-none'
                style={{ top: '50%' }}
              />
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
});

export default CommonNode;
