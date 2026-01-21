import { PlayCircleFilled } from '@ant-design/icons';
import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import BaseNode from './BaseNode';

const StartNode = memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      color="green"
      icon={<PlayCircleFilled className="text-green-600" />}
      isStart
    >
      <div className="text-xs text-gray-500">流程开始</div>
    </BaseNode>
  );
});

export default StartNode;
