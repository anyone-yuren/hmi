import { Handle, Position } from '@xyflow/react';
import { Card, Form, Input, Switch, InputNumber } from 'antd';
import { memo } from 'react';
import { ParameterGroup, PARAMETER_GROUPS } from '../../types';

interface ParameterNodeProps {
  data: {
    group: ParameterGroup;
  };
}

const ParameterNode = memo(({ data }: ParameterNodeProps) => {
  const label = PARAMETER_GROUPS.find(g => g.key === data.group)?.label || data.group;

  const renderFormItems = () => {
    switch(data.group) {
      case 'basic_id':
        return (
          <>
             <Form.Item label="ID" className="mb-2"><Input size="small" placeholder="Vehicle ID" /></Form.Item>
             <Form.Item label="IP" className="mb-2"><Input size="small" placeholder="192.168.1.x" /></Form.Item>
          </>
        );
      case 'physical':
        return (
          <>
            <Form.Item label="Length" className="mb-2"><InputNumber size="small" className="w-full" /></Form.Item>
            <Form.Item label="Width" className="mb-2"><InputNumber size="small" className="w-full" /></Form.Item>
          </>
        );
      case 'kinematics':
        return (
           <Form.Item label="Max Speed" className="mb-2"><InputNumber size="small" className="w-full" /></Form.Item>
        );
      default:
        return <div className="text-xs text-gray-400">Configure parameters in details panel</div>;
    }
  };

  return (
    <Card 
      size="small" 
      title={label}
      className="w-64 border-green-500 shadow-md"
      headStyle={{ fontSize: '12px', minHeight: '32px' }}
      bodyStyle={{ padding: '8px' }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
      
      <Form layout="vertical" size="small">
        {renderFormItems()}
      </Form>
    </Card>
  );
});

export default ParameterNode;
