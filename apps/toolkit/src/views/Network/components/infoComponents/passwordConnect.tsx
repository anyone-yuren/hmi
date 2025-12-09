import PanelLock from '@/components/lockPanel';
import { useRequest } from 'ahooks';
import { Button, Checkbox, Form, Input, InputNumber, Select, Switch, message } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getRoamingInfo, postConnectAp } from '../../services';

const PasswordConnect = (props) => {
  const { t } = useTranslation();
  const { selectNetwork, currentAp } = props;
  const [form] = Form.useForm();

  const { data: roamingData } = useRequest(getRoamingInfo);

  const initValues = useMemo(() => {
    return {
      encryption: '-',
      turbo_roam: true,
      rssi_threshold: -75,
    };
  }, [selectNetwork]);

  useEffect(() => {
    if (roamingData?.data) {
      form.setFieldsValue(roamingData?.data);
    }
  }, [roamingData?.data]);

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

  const renderOption = useMemo(() => {
    if (selectNetwork?.hwmode === '2.4G') {
      return option24g;
    }
    return options;
  }, [selectNetwork, currentAp]);

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
      <h3 className='text-lg font-bold mb-2'>{t('deployer.network.connectSetting')}</h3>
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
            label={t('deployer.network.password')}
            name='password'
            rules={[{ required: true, message: t('deployer.network.pleaseSettingPassword') }]}
          >
            <Input.Password placeholder={t('deployer.network.pleaseSettingPassword')} />
          </Form.Item>

          {/* 加密方式 */}
          <Form.Item
            className='!mb-0'
            label={t('deployer.network.encryptionMethod')}
            name='encryption'
            rules={[{ required: true, message: t('deployer.network.pleaseSelectEncryptionMethod') }]}
          >
            <Select
              placeholder={t('deployer.network.pleaseSelectEncryptionMethod')}
              options={[
                { label: t('deployer.network.noEncryption'), value: '-' },
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
            label={t('deployer.network.encryptionAlgorithm')}
            name='method'
            rules={[{ required: true, message: t('deployer.network.pleaseSelectEncryptionAlgorithm') }]}
          >
            <Select
              placeholder={t('deployer.network.pleaseSelectEncryptionAlgorithm')}
              options={[
                { label: 'AEC', value: 'AEC' },
                { label: 'TKIP/AES', value: 'TKIP/AES' },
              ]}
            />
          </Form.Item>

          {/* 信道 */}
          <Form.Item
            className='!mb-0 col-span-full'
            label={t('deployer.network.channel')}
            name='turbo_freqlist'
            rules={[{ required: true, message: t('deployer.network.pleaseSelectAtLeastOneChannel') }]}
          >
            <Checkbox.Group options={renderOption} />
          </Form.Item>

          {/* 漫游开关 */}
          <Form.Item
            className='!mb-0'
            label={t('deployer.network.roamSwitch')}
            name='turbo_roam'
            valuePropName='checked'
            rules={[{ required: true, message: t('deployer.network.pleaseSelectRoamSwitch') }]}
          >
            <Switch />
          </Form.Item>

          {/* 漫游阈值 */}
          <Form.Item
            className='!mb-0'
            label={t('deployer.network.roamThreshold')}
            name='rssi_threshold'
            rules={[{ required: true, message: t('deployer.network.pleaseInputRoamThreshold') }]}
          >
            <InputNumber min={-97} max={-45} placeholder={t('deployer.network.pleaseInputRoamThreshold')} />
          </Form.Item>

          {/* 按钮 */}
          <div className='flex items-end gap-2'>
            <Button type='primary' loading={loading} onClick={submit}>
              {t('common.save')}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default PasswordConnect;
