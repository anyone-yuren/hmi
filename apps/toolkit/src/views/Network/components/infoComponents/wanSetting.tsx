import PanelLock from '@/components/lockPanel';
import PanelLoading from '@/components/PanelLoading';
import { useRequest } from 'ahooks';
import { Button, Form } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getWanInfo, postWanNet } from '../../services';
import Ipv4v6Input from '../ip4v6Input';

const WanSetting = (props) => {
  const { t } = useTranslation();
  const { selectNetwork, currentAp } = props;
  const [form] = Form.useForm();
  const { data: wanInfo, loading } = useRequest(getWanInfo);
  const { run: updateWan, loading: uploadLoading } = useRequest(postWanNet, {
    manual: true,
    onSuccess: (res) => {
      if (res?.code === 200) {
        toast.success('LAN设置成功', {
          position: 'bottom-center',
        });
      }
    },
  });

  const initValues = useMemo(() => wanInfo?.data, [wanInfo]);

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue(initValues);
    }
  }, [initValues, form]);

  const onSubmit = async () => {
    const values = await form.validateFields();
    await updateWan({ ...values, proto: 'static' });
  };

  return (
    <>
      <h3 className='text-lg font-bold mb-2'>{t('deployer.network.wanSetting')}</h3>
      <div className='relative bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg '>
        {loading ? <PanelLoading isDark={true} /> : null}
        {selectNetwork?.ssid || (currentAp && currentAp.ssid) ? null : <PanelLock />}
        <Form
          form={form}
          labelCol={{ className: 'min-w-[120px] text-right' }}
          wrapperCol={{ className: 'flex-1' }}
          labelAlign='right'
          className='grid w-full grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto'
          initialValues={{ proto: 'dhcp' }}
        >
          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.proto !== cur.proto}>
            {({ getFieldValue, setFieldValue }) => {
              const isDhcp = getFieldValue('proto') === 'dhcp';
              return (
                <>
                  {/* <div className='col-span-full flex items-center gap-2'>
                    <Form.Item className='!mb-0' label='静态IP地址' name={'proto'}>
                      <Checkbox
                        checked={isDhcp}
                        onChange={(e) => {
                          setFieldValue('proto', e.target.checked ? 'dhcp' : 'static');
                        }}
                      >
                        自动获取IP地址
                      </Checkbox>
                    </Form.Item>
                  </div> */}

                  <Ipv4v6Input label={t('deployer.network.ipAddress')} name='ipaddr' disabled={false} />
                  <Ipv4v6Input label={t('deployer.network.subnetMask')} name='netmask' disabled={false} />
                  <Ipv4v6Input label={t('deployer.network.defaultGateway')} name='gateway' disabled={false} />
                  <Ipv4v6Input label={t('deployer.network.primaryDns')} name='first_dns' disabled={false} />
                  <Ipv4v6Input
                    label={t('deployer.network.secondaryDns')}
                    name='second_dns'
                    disabled={false}
                    required={false}
                  />
                </>
              );
            }}
          </Form.Item>

          <div className='flex items-end gap-2'>
            <Button
              type='primary'
              htmlType='submit'
              loading={uploadLoading}
              disabled={uploadLoading}
              onClick={onSubmit}
            >
              {t('common.save')}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default WanSetting;
