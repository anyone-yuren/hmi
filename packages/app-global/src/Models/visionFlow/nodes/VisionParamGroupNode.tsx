import { Handle, Position } from '@xyflow/react';
import { Form, Input } from 'antd';

export default function VisionParamGroupNode({ data }: any) {
  const { scene, fields } = data;

  return (
    <div className='w-72 p-4 bg-white/20 border rounded'>
      <div className='font-semibold mb-2'>{scene === 'single' ? '单箱取货参数' : '托盘取货参数'}</div>

      <Form layout='vertical' size='small'>
        {fields.map((f: any) => (
          <Form.Item key={f.key} label={f.label} name={f.key}>
            <Input placeholder={`请输入 ${f.label}`} />
          </Form.Item>
        ))}
      </Form>

      <Handle type='target' position={Position.Left} />
    </div>
  );
}
