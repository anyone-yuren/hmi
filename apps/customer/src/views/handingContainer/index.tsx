import ScannerCascader from '@/components/ScannerCascader';
import useAreaLocationOptions from '@/hooks/useAreaLocationOptions';
import { LeftOutlined } from '@ant-design/icons';
import { useDict, usePalletOption, useTrayOptions } from '@gbeata/hooks';
import { useRequest } from 'ahooks';
import { Button, Card, Form, InputNumber, Select, Switch } from 'antd';
import { wms } from 'apis';
import { last } from 'ramda';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SummonContainer = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const containerOptions = useDict('ContainerState');
  const { trayOptions, load: loadTrayOptions } = useTrayOptions(true);
  const { palletTypeOptions } = usePalletOption({ selectable: true });
  const containerTypeId = Form.useWatch('containerTypeId', form);
  const {
    options: areaLocationOptions,
    load: loadAreaLocationOptions,
    getContainerState,
  } = useAreaLocationOptions(true);

  useEffect(() => {
    loadAreaLocationOptions();
    loadTrayOptions();
  }, []);
  const { run: applyContainer, loading: bindLoading } = useRequest(wms.slot2slot, {
    manual: true,
    onSuccess: () => {
      // debugger;
      form.resetFields();
      toast.success(t('pdaCommon.applySuccess'));
    },
  });
  const onFinish = async (values: any) => {
    const { toSlotId, fromSlotId, ...rest } = values;
    debugger;
    await applyContainer({
      ...rest,
      fromSlotId: last(fromSlotId),
      toSlotId: last(toSlotId),
      containerState: 0,
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
          {t('pda.home.ApplySlotToSlot')}
        </div>
      }
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item
          name='fromSlotId'
          label={t('pda.applyIn.fromSlotId')}
          rules={[{ required: true, message: t('padCommon.pleaseSelect') }]}
        >
          <ScannerCascader
            placeholder={t('pdaCommon.pleaseSelect')}
            showSearch
            // options={filterSlotOptions}
            options={areaLocationOptions}
            // scannerKey='bindSlotId'
            // onScannerCallback={(code: any) => {
            //   modalRef.current.setFieldValue('slotId', code)
            // }}
          />
        </Form.Item>
        <Form.Item
          name='toSlotId'
          label={t('pda.container.toSlotId')}
          rules={[{ required: true, message: t('padCommon.pleaseSelect') }]}
        >
          <ScannerCascader
            placeholder={t('pdaCommon.pleaseSelect')}
            showSearch
            // options={filterSlotOptions}
            options={areaLocationOptions}
            changeOnSelect
            // scannerKey='bindSlotId'
            // onScannerCallback={(code: any) => {
            //   modalRef.current.setFieldValue('slotId', code)
            // }}
          />
        </Form.Item>
        <Form.Item
          label={t('pdaCommon.priority')}
          name='priority'
          rules={[{ required: true, message: t('pdaCommon.pleaseSelect') }]}
        >
          <InputNumber min={0} step={1} placeholder={t('pdaCommon.pleaseEnter')} style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item
          label={t('pda.home.isAutomatic')}
          name='isAutomatic'
          rules={[{ required: true, message: t('pdaCommon.pleaseSelect') }]}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues.fromSlotId !== currentValues.fromSlotId;
          }}
        >
          {({ getFieldValue, setFieldValue }) => {
            const fromSlotId = getFieldValue('fromSlotId');
            if (!fromSlotId) {
              return null;
            }
            const containerState = getContainerState(last(fromSlotId));
            if (containerState !== null) return null;
            return (
              <Form.Item noStyle>
                <Form.Item
                  label={t('pda.home.autoBind')}
                  name='autoBind'
                  rules={[{ required: true, message: t('pdaCommon.pleaseSelect') }]}
                >
                  <Switch />
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
                <Form.Item name='containerId' label={t('pda.home.containerId')}>
                  <Select
                    placeholder={t('pdaCommon.pleaseSelect')}
                    showSearch
                    allowClear
                    options={trayOptions?.filter((e: any) => {
                      if (!containerTypeId) {
                        return true;
                      }
                      return e.containerTypeId === containerTypeId;
                    })}
                    optionFilterProp='label'
                  />
                </Form.Item>
              </Form.Item>
            );
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
export default SummonContainer;
