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

const SummonContainer = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const containerOptions = useDict('ContainerState');
  const { trayOptions, load: loadTrayOptions } = useTrayOptions(true);
  const { palletTypeOptions } = usePalletOption({ selectable: true });
  const containerTypeId = Form.useWatch('containerTypeId', form);
  const { options: areaLocationOptions, load: loadAreaLocationOptions, getAreaLocation } = useAreaLocationOptions(true);
  const { data: slotOptions, runAsync: loadSlotOptions } = useRequest(wms.getAreaOptions, {
    manual: true,
  });
  useEffect(() => {
    loadAreaLocationOptions();
    loadTrayOptions();
    loadSlotOptions();
  }, []);
  const { run: applyContainer, loading: bindLoading } = useRequest(wms.applyContainer, {
    manual: true,
    onSuccess: () => {
      // debugger;
      form.resetFields();
      toast.success(t('pdaCommon.bindSuccess'));
    },
  });
  const { run: createSlotToS, loading: slotToSlotLoading } = useRequest(wms.createPointToPointMission, {
    manual: true,
    onSuccess: () => {
      // debugger;
      form.resetFields();
      toast.success(t('pdaCommon.bindSuccess'));
    },
  });

  const onFinish = async (values: any) => {
    const { toSlotId, fromAreaIds, ...rest } = values;
    if (fromAreaIds.length > 1) {
      await createSlotToS({
        ...rest,
        fromSlotId: last(fromAreaIds),
        toSlotId: last(toSlotId),
      });
      return;
    }
    await applyContainer({
      ...rest,
      toSlotId: last(toSlotId),
      fromAreaIds: fromAreaIds,
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
          {t('pda.home.applyContainer')}
        </div>
      }
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item
          label={t('pda.container.toSlotId')}
          name='toSlotId'
          rules={[
            {
              required: true,
              message: t('pdaCommon.pleaseSelect'),
            },
          ]}
        >
          <Cascader
            placeholder={t('pdaCommon.pleaseSelect')}
            showSearch
            options={areaLocationOptions}
            // scannerKey='bindSlotId'
            // onScannerCallback={(code: any) => {
            //   modalRef.current.setFieldValue('slotId', code)
            // }}
          />
        </Form.Item>
        <Form.Item name='fromAreaIds' label={t('pda.container.fromAreaIds')}>
          {/* <Select
            placeholder={t('pdaCommon.pleaseSelect')}
            showSearch
            allowClear
            mode='multiple'
            size='middle'
            style={{ width: `calc(100%)` }}
            maxTagCount='responsive'
            options={filterSlotOptions}
          /> */}
          <Cascader placeholder={t('pdaCommon.pleaseSelect')} showSearch changeOnSelect options={areaLocationOptions} />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues.fromAreaIds !== currentValues.fromAreaIds;
          }}
        >
          {({ getFieldValue }) => {
            const type = getFieldValue('fromAreaIds');

            if (type?.length === 1) {
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
export default SummonContainer;
