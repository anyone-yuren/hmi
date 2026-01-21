import { StopFilled } from '@ant-design/icons';
import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import BaseNode from './BaseNode';

const EndNode = memo((props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      color="red"
      icon={<StopFilled className="text-red-600" />}
      isEnd
    >
      <div className="text-xs text-gray-500">流程结束</div>
    </BaseNode>
  );
});

export default EndNode;
