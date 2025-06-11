import useAreaLocationOptions from '@/hooks/useAreaLocationOptions';
import { LeftOutlined } from '@ant-design/icons';
import { useTrayOptions } from '@gbeata/hooks';
import { useRequest } from 'ahooks';
import { Button, Card, Cascader, Form, Radio, Select } from 'antd';
import { wms } from 'apis';
import { last } from 'ramda';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const OutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { trayOptions, load: loadTrayOptions } = useTrayOptions(true);
  const { options: areaLocationOptions, load: loadAreaLocationOptions, getAreaLocation } = useAreaLocationOptions(true);
  useEffect(() => {
    loadAreaLocationOptions();
    loadTrayOptions();
  }, []);
  const { run: applyContainer, loading: bindLoading } = useRequest(wms.containerUnbind, {
    manual: true,
    onSuccess: () => {
      form.resetFields();
      toast.success(t('pdaCommon.bindSuccess'));
    },
  });
  const { run: applySlot, loading: slotUnbindLoading } = useRequest(wms.slotUnbind, {
    manual: true,
    onSuccess: () => {
      form.resetFields();
      toast.success(t('pdaCommon.bindSuccess'));
    },
  });
  const onFinish = async (values: any) => {
    const { containerId, type, fromSlotId } = values;
    debugger;
    if (type === 'pear') {
      await applyContainer(containerId);
      return;
    }
    if (type === 'apple') {
      await applySlot(last(fromSlotId));
      return;
    }
  };
  return (
    <Card
      className='m-4 mt-0'
      title={
        <div className='flex gap-2'>
          <LeftOutlined
            onClick={() => {
              navigate(-1);
            }}
          />{' '}
          {t('pda.home.unBind')}
        </div>
      }
    >
      <Form form={form} layout='vertical' onFinish={onFinish} initialValues={{ type: 'apple' }}>
        <Form.Item label={t('pda.unbind.type')} name='type'>
          <Radio.Group>
            <Radio value='apple'> {t('pda.unbind.slot')} </Radio>
            <Radio value='pear'> {t('pda.unbind.container')} </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues.type !== currentValues.type;
          }}
        >
          {({ getFieldValue }) => {
            const type = getFieldValue('type');
            if (type === 'pear') {
              return (
                <Form.Item
                  label={t('pdaCommon.container')}
                  name='containerId'
                  rules={[
                    {
                      required: true,
                      message: t('pdaCommon.pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    placeholder={t('pdaCommon.pleaseSelect')}
                    showSearch
                    allowClear
                    // options={trayOptions?.filter((e: any) => {
                    //   if (!containerTypeId) {
                    //     return true;
                    //   }
                    //   return e.containerTypeId === containerTypeId;
                    // })}
                    options={trayOptions}
                    optionFilterProp='label'
                  />
                </Form.Item>
              );
            }
            if (type === 'apple') {
              return (
                <Form.Item
                  label={t('pdaCommon.location')}
                  name='fromSlotId'
                  rules={[
                    {
                      required: true,
                      message: t('pdaCommon.pleaseSelect'),
                    },
                  ]}
                >
                  <Cascader placeholder={t('pdaCommon.pleaseSelect')} showSearch options={areaLocationOptions} />
                </Form.Item>
              );
            }
            return null;
          }}
        </Form.Item>

        <Form.Item label={null}>
          <Button type='primary' block htmlType='submit' loading={bindLoading}>
            {t('pdaCommon.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default OutPage;
