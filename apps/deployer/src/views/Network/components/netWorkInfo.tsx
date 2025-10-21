import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, InputNumber, Select, Space } from 'antd';
import { useState } from 'react';
import PortModules from './portModules';

const IpInput = ({ value = '', onChange }) => {
  const [segments, setSegments] = useState(() => {
    const parts = value?.split('.') || ['', '', '', ''];
    return parts.map((v) => (v === '' ? undefined : Number(v)));
  });

  const handleChange = (val, index) => {
    const newSegs = [...segments];
    newSegs[index] = val;
    setSegments(newSegs);
    onChange?.(newSegs.join('.'));
  };

  return (
    <Space>
      {segments.map((seg, idx) => (
        <InputNumber
          key={idx}
          min={0}
          max={255}
          style={{ width: 70 }}
          value={seg}
          disabled={true}
          onChange={(val) => handleChange(val, idx)}
          controls={false}
        />
      ))}
    </Space>
  );
};

const Ipv4v6Input = ({ label, name, disabled }) => {
  const ipv4Pattern =
    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

  const ipv6Pattern =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return (
    <Form.Item
      className='!mb-0'
      label={label}
      name={name}
      rules={[
        { required: true, message: '请输入IP地址' },
        {
          validator(_, value) {
            if (!value) return Promise.resolve();
            if (ipv4Pattern.test(value) || ipv6Pattern.test(value)) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('请输入正确的 IPv4 或 IPv6 地址'));
          },
        },
      ]}
    >
      <Input placeholder='IPv4 或 IPv6' disabled={disabled} />
    </Form.Item>
  );
};
const NetworkInfo = () => {
  const [form] = Form.useForm();

  // 监听 DHCP 状态
  const ipMethod = Form.useWatch('ipMethod', form);
  const isDhcp = ipMethod === 'dhcp';
  return (
    <Form
      form={form}
      labelCol={{ className: 'min-w-[120px] text-right' }}
      wrapperCol={{ className: 'flex-1' }}
      labelAlign='right'
      className='flex flex-col gap-2 overflow-y-auto'
      initialValues={{ ipMethod: 'dhcp' }}
    >
      <div>
        <h3 className='text-lg font-bold mb-2'>连接设置</h3>
        <div className='bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg grid md:grid-cols-2 xl:grid-cols-3 gap-4 '>
          <Form.Item className='!mb-0' label='连接密码' name='password'>
            <Input.Password placeholder='input password' />
          </Form.Item>
          <Form.Item className='!mb-0' label='加密方式' name='method'>
            <Select options={[{ label: 'WPA2', value: 'wpa2' }]}></Select>
          </Form.Item>
        </div>
      </div>
      <div>
        <h3 className='text-lg font-bold mb-2'>WAN设置</h3>
        <div className='bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg grid md:grid-cols-2 xl:grid-cols-3 gap-4 '>
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
        </div>
      </div>
      <div>
        <h3 className='text-lg font-bold mb-2'>LAN设置</h3>
        <div className='bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg grid md:grid-cols-2 xl:grid-cols-3 gap-4 '>
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='IP地址' name='ip' />
          </div>
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='子网掩码' name='ip' />
          </div>
        </div>
      </div>
      <div>
        <h3 className='text-lg font-bold mb-2'>增加漫游</h3>
        <div className='bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg grid md:grid-cols-2 xl:grid-cols-3 gap-4 '>
          <div className='col-span-full flex items-center gap-2'>
            <Form.Item className='!mb-0' label='扫描信道' name='ipMethod' initialValue='dhcp'>
              <div className='flex items-center gap-2'>
                <Checkbox.Group
                  options={[
                    { label: 1, value: '1' },
                    { label: 2, value: '2' },
                  ]}
                  defaultValue={['1']}
                />
              </div>
            </Form.Item>
          </div>
        </div>
      </div>
      <div>
        <h3 className='text-lg font-bold mb-2 flex items-center justify-between'>
          端口映射
          <Button size='small' type='primary' icon={<PlusOutlined />}>
            新增
          </Button>
        </h3>
        <div className='bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg'>
          <PortModules />
        </div>
      </div>
    </Form>
  );
};

export default NetworkInfo;
