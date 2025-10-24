import { Button, Form } from 'antd';
import Ipv4v6Input from '../ip4v6Input';

const LanSetting = () => {
  const [form] = Form.useForm();

  return (
    <>
      <h3 className='text-lg font-bold mb-2'>LAN设置</h3>
      <div className='relative bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg '>
        {/* <PanelLock /> */}
        <Form
          form={form}
          labelCol={{ className: 'min-w-[120px] text-right' }}
          wrapperCol={{ className: 'flex-1' }}
          labelAlign='right'
          className='grid w-full grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto'
          initialValues={{ ipMethod: 'dhcp' }}
        >
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='IP地址' name='ip' disabled={false} />
          </div>
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='子网掩码' name='ip' disabled={false} />
          </div>
          <div className='flex items-end gap-2'>
            <Button type='primary'>保存</Button>
          </div>
        </Form>
      </div>
    </>
  );
};
export default LanSetting;
