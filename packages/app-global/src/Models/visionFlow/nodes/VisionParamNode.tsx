import { Input } from 'antd';

export default function VisionParamNode({ data }: any) {
  return (
    <div className='w-48 p-2 bg-white/20 border rounded'>
      <div className='text-sm font-medium mb-1'>
        {data.scene} · {data.label}
      </div>

      <div className='nodrag'>
        <Input placeholder={`配置 ${data.label}`} />
      </div>
    </div>
  );
}
