import { Collapse, Form, InputNumber, Slider } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';
import { useEditorStore } from '../../store/editorStore';

interface ForkPanelProps {
  useTabFilter?: boolean;
}

const ForkPanel = ({ useTabFilter = false }: ForkPanelProps) => {
  const [form] = Form.useForm();
  const { forkParams, setForkParams } = useModelStore(
    useShallow((state) => ({
      forkParams: state.forkParams,
      setForkParams: state.setForkParams,
    })),
  );

  const { panelTab } = useEditorStore(
    useShallow((state) => ({
      panelTab: state.panelTab,
    })),
  );

  const getItems = () => {
    const allItems = [
      {
        key: '1',
        label: '前移',
        children: (
          <>
            <Form.Item
              label='速度'
              name='move_speed'
              initialValue={forkParams.liftSpeed}
            >
              <Slider
                min={0}
                max={5}
                step={0.1}
                value={forkParams.liftSpeed}
                onChange={(v) => setForkParams({ liftSpeed: v })}
              />
            </Form.Item>
            <Form.Item
              label='前移调速区间'
              name='lift_speed_interval'
              initialValue={forkParams.liftSpeed}
            >
              <InputNumber className='w-full' />
            </Form.Item>
            <Form.Item
              label='后移调速区间'
              name='drop_speed_interval'
              initialValue={forkParams.dropSpeedInterval}
            >
              <InputNumber className='w-full' />
            </Form.Item>
          </>
        ),
      },
      {
        key: '2',
        label: '横移',
        children: (
          <div className='flex flex-col gap-2'>
            <Form.Item
              label='速度'
              name='side_speed'
              initialValue={forkParams.dropSpeed}
            >
              <InputNumber
                className='w-full'
                min={0}
                max={5}
                step={0.1}
                value={forkParams.dropSpeed}
                onChange={(v) => setForkParams({ dropSpeed: v || 0 })}
              />
            </Form.Item>
          </div>
        ),
      },
      {
        key: '3',
        label: '俯仰',
        children: <div className='text-gray-400 text-xs'>暂无参数</div>,
      },
      {
        key: '4',
        label: '横滚',
        children: <div className='text-gray-400 text-xs'>暂无参数</div>,
      },
      {
        key: '5',
        label: '升降',
        children: (
          <div className='flex flex-col gap-2'>
            <Form.Item
              label='速度'
              name='lift_speed'
              initialValue={forkParams.liftIntervalSpeed}
            >
              <Slider
                min={0}
                max={5}
                step={0.1}
                value={forkParams.liftIntervalSpeed}
                onChange={(v) => setForkParams({ liftIntervalSpeed: v })}
              />
            </Form.Item>
          </div>
        ),
      },
      {
        key: '6',
        label: '叉间距',
        children: (
          <div className='flex flex-col gap-2'>
            <Form.Item
              label='间距'
              name='fork_interval'
              initialValue={forkParams.dropIntervalSpeed}
            >
              <InputNumber
                className='w-full'
                min={0}
                max={5}
                step={0.1}
                value={forkParams.dropIntervalSpeed}
                onChange={(v) => setForkParams({ dropIntervalSpeed: v || 0 })}
              />
            </Form.Item>
          </div>
        ),
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
      <Form
        form={form}
        // layout='vertical'
        size='small'
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
      >
        <Collapse
          items={getItems()}
          defaultActiveKey={useTabFilter && panelTab ? [panelTab] : ['1']}
          activeKey={useTabFilter && panelTab ? [panelTab] : undefined}
        />
      </Form>
    </div>
  );
};

export default ForkPanel;
