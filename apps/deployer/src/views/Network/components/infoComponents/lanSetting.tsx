import PanelLoading from '@/components/PanelLoading';
import { useRequest } from 'ahooks';
import { Button, Form } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { getLanInfo, postLanNet } from '../../services';
import Ipv4v6Input from '../ip4v6Input';

const LanSetting = () => {
  const [form] = Form.useForm();
  const { data: lanInfo, loading, run } = useRequest(getLanInfo);
  const innitValues = useMemo(() => {
    if (lanInfo && lanInfo?.data) {
      return lanInfo.data;
    }
  }, [lanInfo]);

  useEffect(() => {
    if (innitValues) {
      form.setFieldsValue(innitValues);
    }
  }, [innitValues, form]);

  const { loading: updateLoading, run: updateRun } = useRequest(postLanNet, {
    manual: true,
    onSuccess: (res) => {
      if (res?.code === 200) {
        toast.success('LAN设置成功', {
          position: 'bottom-center',
        });
      }
    },
  });

  const onSubmit = async () => {
    const values = await form.validateFields();
    await updateRun(values);
  };

  return (
    <>
      <h3 className='text-lg font-bold mb-2'>LAN设置</h3>
      <div className='relative bg-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-teal-400/20 hover:bg-white/5 shadow-lg '>
        {/* <PanelLock /> */}
        {loading ? <PanelLoading loading={loading} isDark={true} /> : null}
        <Form
          form={form}
          labelCol={{ className: 'min-w-[120px] text-right' }}
          wrapperCol={{ className: 'flex-1' }}
          labelAlign='right'
          className='grid w-full grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto'
          initialValues={innitValues}
        >
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='IP地址' name='ipaddr' disabled={false} />
          </div>
          <div className='flex gap-2 items-center'>
            <Ipv4v6Input label='子网掩码' name='netmask' disabled={false} />
          </div>
          <div className='flex  gap-2'>
            <Button
              type='primary'
              loading={updateLoading}
              disabled={updateLoading}
              onClick={() => {
                onSubmit();
              }}
            >
              保存
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};
export default LanSetting;
