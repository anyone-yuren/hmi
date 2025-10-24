import { Button, Checkbox, Form } from 'antd';
import Ipv4v6Input from '../ip4v6Input';

const WanSetting = () => {
  const [form] = Form.useForm();
  // 监听 DHCP 状态
  const ipMethod = Form.useWatch('ipMethod', form);
  const isDhcp = ipMethod === 'dhcp';
  return (
    <>
      <h3 className='text-lg font-bold mb-2'>WAN设置</h3>
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
          <div className='col-span-full flex items-center gap-2'>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.ipMethod !== cur.ipMethod}>
              {({ getFieldValue, setFieldValue }) => {
                const checked = getFieldValue('ipMethod') === 'dhcp';
                return (
                  <Form.Item className='!mb-0' label='静态IP地址'>
                    <Checkbox
                      checked={checked}
                      onChange={(e) => setFieldValue('ipMethod', e.target.checked ? 'dhcp' : 'static')}
                    >
                      自动获取IP地址
                    </Checkbox>
                  </Form.Item>
                );
              }}
            </Form.Item>
          </div>
          {/* <div className='flex gap-2 items-center'>
                       <span className='min-w-20 text-right'>WAN IP</span>
                       <IpInput value='192.168.20.110' onChange={() => {}} />
                     </div> */}
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='IP地址' name='ip' disabled={isDhcp} />
          </div>
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='子网掩码' name='ip' disabled={isDhcp} />
          </div>
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='默认网关' name='ip' disabled={isDhcp} />
          </div>
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='首选DNS' name='ip' disabled={isDhcp} />
          </div>
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='备用DNS' name='ip' disabled={isDhcp} />
          </div>
          <div className='flex items-end gap-2'>
            <Button type='primary'>保存</Button>
          </div>
        </Form>
      </div>
    </>
  );
};
export default WanSetting;
