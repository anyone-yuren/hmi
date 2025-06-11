import useAreaLocationOptions from '@/hooks/useAreaLocationOptions';
import { LeftOutlined } from '@ant-design/icons';
import { useDict, usePalletOption, useTrayOptions } from '@gbeata/hooks';
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
  const containerOptions = useDict('ContainerState');
  const containerTypeId = Form.useWatch('containerTypeId', form);
  const { trayOptions, load: loadTrayOptions } = useTrayOptions(true);
  const { palletTypeOptions } = usePalletOption({ selectable: true });
  const {
    options: areaLocationOptions,
    load: loadAreaLocationOptions,
    getAreaLocation,
    getContainerState,
  } = useAreaLocationOptions(true);
  useEffect(() => {
    loadAreaLocationOptions();
    loadTrayOptions();
  }, []);
  const { run: applyContainer, loading: bindLoading } = useRequest(wms.apply2Storage, {
    manual: true,
    onSuccess: () => {
      form.resetFields();
      toast.success(t('pdaCommon.bindSuccess'));
    },
  });
  const onFinish = async (values: any) => {
    const { fromSlotId, ...rest } = values;
    await applyContainer({
      ...rest,
      fromSlotId: last(fromSlotId),
    });
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
          {t('pda.home.applyIn')}
        </div>
      }
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item
          label={t('pda.applyIn.fromSlotId')}
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

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues.fromSlotId !== currentValues.fromSlotId;
          }}
        >
          {({ getFieldValue }) => {
            const fromSlotId = getFieldValue('fromSlotId');
            if (!fromSlotId) {
              return null;
            }
            const containerState = getContainerState(last(fromSlotId));

            if (containerState === null) {
              return (
                <>
                  <Form.Item
                    name='containerState'
                    label={t('pda.home.containerState')}
                    rules={[{ required: true, message: t('pdaCommon.pleaseSelect') }]}
                  >
                    <Radio.Group>
                      {containerOptions?.map((item: (typeof containerOptions)[0]) => {
                        const { label, value } = item;
                        return (
                          <Radio key={value} value={value}>
                            {label}
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name='containerTypeId' label={t('pda.task.containerType')}>
                    <Select
                      placeholder={t('pdaCommon.pleaseSelect')}
                      showSearch
                      allowClear
                      options={palletTypeOptions}
                      optionFilterProp='label'
                    />
                  </Form.Item>
                  <Form.Item name='containerId' label={t('pda.task.container')}>
                    <Select
                      placeholder={t('pdaCommon.pleaseSelect')}
                      showSearch
                      allowClear
                      optionFilterProp='label'
                      options={trayOptions?.filter((e: any) => {
                        if (!containerTypeId) {
                          return true;
                        }
                        return e.containerTypeId === containerTypeId;
                      })}
                    />
                  </Form.Item>
                </>
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
