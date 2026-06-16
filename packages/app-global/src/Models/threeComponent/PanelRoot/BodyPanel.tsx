import { Collapse, Form, InputNumber, Select } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../../store/editorStore';

interface BodyPanelProps {
  useTabFilter?: boolean;
}

const BodyPanel = ({ useTabFilter = false }: BodyPanelProps) => {
  const [form] = Form.useForm();
  const { panelTab } = useEditorStore(
    useShallow((state) => ({
      panelTab: state.panelTab,
    })),
  );

  const getItems = () => {
    const allItems = [
      {
        key: '1',
        label: '通用',
        children: (
          <Form.Item
            label='底盘控制频率'
            name='control_frequency'
            initialValue={50}
          >
            <InputNumber className='w-full' />
          </Form.Item>
        ),
      },
      {
        key: '2',
        label: '叉分',
        children: <div className='text-gray-400 text-xs'>暂无参数</div>,
      },
      {
        key: '3',
        label: '全向车',
        children: (
          <div className='flex flex-col gap-2'>
            <Form.Item
              label='全向车类型'
              name='omni_type'
              initialValue='mecanum'
            >
              <Select
                options={[
                  { label: '麦克纳姆轮', value: 'mecanum' },
                  { label: '全向轮', value: 'omni' },
                ]}
              />
            </Form.Item>
          </div>
        ),
      },
      {
        key: '4',
        label: '双舵',
        children: <div className='text-gray-400 text-xs'>暂无参数</div>,
      },
      {
        key: '5',
        label: '单舵',
        children: <div className='text-gray-400 text-xs'>暂无参数</div>,
      },
    ];

    if (useTabFilter && panelTab) {
      return allItems.filter((item) => item.key === panelTab);
    }
    return allItems;
  };

  return (
    <div
      className='bg-[#1f1f1f] rounded-lg p-2 text-white'
      style={{ minWidth: 240 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Form form={form} layout='vertical' size='small'>
        <Collapse
          items={getItems()}
          defaultActiveKey={useTabFilter && panelTab ? [panelTab] : ['1']}
          activeKey={useTabFilter && panelTab ? [panelTab] : undefined}
        />
      </Form>
    </div>
  );
};

export default BodyPanel;
