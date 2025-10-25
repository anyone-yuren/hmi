import PanelLock from '@/components/lockPanel';
import { useRequest } from 'ahooks';
import { Button, Checkbox, Form, Input, InputNumber, Select, Switch, message } from 'antd';
import { useMemo } from 'react';
import { postConnectAp } from '../../services';

const PasswordConnect = (props) => {
  const { selectNetwork, currentAp } = props;
  const [form] = Form.useForm();

  const initValues = useMemo(() => {
    return {
      encryption: '-',
      turbo_roam: true,
      rssi_threshold: -70,
    };
  }, [currentAp]);

  const { runAsync: connectAp, loading } = useRequest(postConnectAp, {
    manual: true,
  });

  // 监听 DHCP 状态（预留扩展）
  const ipMethod = Form.useWatch('ipMethod', form);
  const isDhcp = ipMethod === 'dhcp';

  // 信道选项
  const options = [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165].map((v) => ({
    label: v,
    value: v,
  }));

  // 2.4G 选项（暂未使用）
  const option24g = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((v) => ({
    label: v,
    value: v,
  }));

  /** ✅ 提交函数 */
  const submit = async () => {
    try {
      // 1️⃣ 校验表单
      const values = await form.validateFields();

      // 2️⃣ 合并参数
      const payload = {
        ssid: selectNetwork?.ssid || '',
        hwmode: selectNetwork?.hwmode || '5G',
        ...values,
        rssi_threshold: Number(values.rssi_threshold),
      };

      // 3️⃣ 调用接口
      await connectAp(payload);

      // 4️⃣ 成功提示
      message.success('连接参数保存成功');
    } catch (err) {
      if (err?.errorFields) {
        message.warning('请填写所有必填项');
      } else {
        message.error('保存失败，请重试');
      }
    }
  };

  return (
    <>
      <h3 className='text-lg font-bold mb-2'>连接设置</h3>
      <div className='relative bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg'>
        {selectNetwork?.ssid || (currentAp && currentAp.ssid) ? null : <PanelLock />}
        <Form
          form={form}
          labelCol={{ className: 'min-w-[120px] text-right' }}
          wrapperCol={{ className: 'flex-1' }}
          labelAlign='right'
          className='grid w-full grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto'
          initialValues={initValues}
        >
          {/* 密码 */}
          <Form.Item
            className='!mb-0'
            label='连接密码'
            name='password'
            rules={[{ required: true, message: '请输入连接密码' }]}
          >
            <Input.Password placeholder='请输入连接密码' />
          </Form.Item>

          {/* 加密方式 */}
          <Form.Item
            className='!mb-0'
            label='加密方式'
            name='encryption'
            rules={[{ required: true, message: '请选择加密方式' }]}
          >
            <Select
              placeholder='请选择加密方式'
              options={[
                { label: '不加密', value: '-' },
                { label: 'WPA2', value: 'WPA2' },
                { label: 'WPA/WPA2', value: 'WPA/WPA2' },
                { label: 'WPA3', value: 'WPA3' },
                { label: 'WPA2/WPA3', value: 'WPA2/WPA3' },
              ]}
            />
          </Form.Item>

          {/* 加密算法 */}
          <Form.Item
            className='!mb-0'
            label='加密算法'
            name='method'
            rules={[{ required: true, message: '请选择加密算法' }]}
          >
            <Select
              placeholder='请选择加密算法'
              options={[
                { label: 'AEC', value: 'AEC' },
                { label: 'TKIP/AES', value: 'TKIP/AES' },
              ]}
            />
          </Form.Item>

          {/* 信道 */}
          <Form.Item
            className='!mb-0 col-span-full'
            label='信道'
            name='turbo_freqlist'
            rules={[{ required: true, message: '请选择至少一个信道' }]}
          >
            <Checkbox.Group options={options} />
          </Form.Item>

          {/* 漫游开关 */}
          <Form.Item
            className='!mb-0'
            label='漫游开关'
            name='turbo_roam'
            valuePropName='checked'
            rules={[{ required: true, message: '请选择是否启用漫游' }]}
          >
            <Switch />
          </Form.Item>

          {/* 漫游阈值 */}
          <Form.Item
            className='!mb-0'
            label='漫游阈值'
            name='rssi_threshold'
            rules={[{ required: true, message: '请输入漫游阈值' }]}
          >
            <InputNumber min={-97} max={-45} placeholder='请输入漫游阈值' />
          </Form.Item>

          {/* 按钮 */}
          <div className='flex items-end gap-2'>
            <Button type='primary' loading={loading} onClick={submit}>
              保存
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default PasswordConnect;
