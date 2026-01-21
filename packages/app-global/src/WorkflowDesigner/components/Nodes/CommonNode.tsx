import {
  ApiFilled,
  CodeFilled,
  DatabaseFilled,
  ExperimentFilled,
  RobotFilled,
  ThunderboltFilled,
} from '@ant-design/icons';
import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import { WorkflowNodeData } from '../../types';
import BaseNode from './BaseNode';

const CommonNode = memo((props: NodeProps) => {
  const { type } = props.data as WorkflowNodeData;

  const config = {
    'data-acquisition': { icon: <ExperimentFilled />, color: 'cyan', label: '数据采集' },
    processing: { icon: <CodeFilled />, color: 'blue', label: '处理' },
    control: { icon: <ThunderboltFilled />, color: 'orange', label: '控制' },
    execution: { icon: <RobotFilled />, color: 'purple', label: '执行' },
    integration: { icon: <ApiFilled />, color: 'geekblue', label: '集成' },
    'sub-process': { icon: <DatabaseFilled />, color: 'magenta', label: '子流程' },
  }[type as string] || { icon: <CodeFilled />, color: 'gray', label: '未知' };

  return (
    <BaseNode
      {...props}
      color={config.color}
      icon={<span className={`text-${config.color}-600`}>{config.icon}</span>}
    >
      <div className="flex flex-col gap-1">
        <div className="text-xs text-gray-500">{config.label}</div>
        {/* Render dynamic params summary if needed */}
      </div>
    </BaseNode>
  );
});

export default CommonNode;
