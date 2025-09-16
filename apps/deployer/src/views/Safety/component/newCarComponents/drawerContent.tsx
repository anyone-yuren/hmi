import {
  ArrowRightOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PauseOutlined,
  StopOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { App, Button, Checkbox, Form, Input, Popover, Segmented, Switch, theme, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { SvgIcon } from 'ui';
import Accordion from './accrodion';
import RenderStrategyTpye from './renderStrategyTpye';
export const Line1px = () => {
  return (
    <div className='w-full h-px bg-gradient-to-r from-white/0 via-[#e3e3e3] to-white/0 absolute bottom-0 left-0'></div>
  );
};

interface IProps {
  rects: Array<{ id: string; x: number; y: number; width: number; height: number }>;
  setRects: (rects: Array<{ id: string; x: number; y: number; width: number; height: number }>) => void;
  setSelectedId: (id: string) => void;
  selectedId: string | null;
  stage: Konva.Stage | null;
  size?: { width: number; height: number } | null;
  setReRenderLineGrid: (value: boolean) => void;
  reRenderLineGrid: boolean;
  setOpenUpdateObsDrawer: (value: boolean) => void;
  isDark: boolean;
}
const DrawerContent = (props: IProps) => {
  const { useToken } = theme;
  const { modal } = App.useApp();
  const { token } = useToken();
  const [form] = Form.useForm();
  const setting = {};
  const strategyTpye = [
    {
      id: 1,
      name: '直线保持',
      data: {
        steer_angle_tolerance: 15, //舵轮打角判定阈值
      },
    },
    {
      id: 2,
      name: '叉臂下方区域保护',
      data: {
        // 叉臂下方区域保护
        rectangle: [0, 1, 2, 3], //叉臂下方保护区域
        height_start: 100, //叉臂下方起始保护高度
        forkarm_height_cut: 300, //叉臂下方裁剪高度
        associated_sensor_list: ['tail_lidar', 'perception_3d_lidar'], //关联传感器frame_id
      },
    },
    {
      id: 3,
      name: '放货空间检测',
      data: {
        cuboid: [0, 1, 2, 2, 3, 4], //保护区域长方体
        associated_sensor_list: ['tail_lidar', 'perception_3d_lidar'], //关联传感器frame_id
        min_distance_to_task_point_open_this: 1000,
      },
    },
    {
      id: 4,
      name: '取货防护',
      data: {
        rectangle: [0, 1, 2, 3],
        associated_sensor_list: ['tail_lidar', 'perception_3d_lidar'], //关联传感器frame_id
        min_distance_to_task_point_open_this: 1000, //使能取货叉尖保护距离
      },
    },
    {
      id: 5,
      name: '末端路线自适应最小避障距离',
      data: {
        forward_min_protect_distance: 150, //前进最小避障距离
        backward_min_protect_distance: 100, //后退最小避障距离
      },
    },
    {
      id: 6,
      name: '顶部安全防护',
      data: {
        empty_load_protect_rectangle: [0, 1, 2, 3], //空载防护区域
        full_load_protect_rectangle: [0, 1, 2, 3], //负载防护区域
        associated_sensor_list: ['top_lidar'], //关联传感器frame_id
      },
    },
    {
      id: 7,
      name: '屏蔽门架光电避障功能',
      data: {
        fork_forward_protect_distance: 1000, //叉臂前移超限屏蔽光电避障
        fork_lateral_move_protect_distance: 0, //叉臂横移超限屏蔽光电避障
        associated_io_sensor_list: ['pe_tip_left', 'pe_tip_right'], //关联IO
      },
    },
    {
      id: 8,
      name: '末端路线屏蔽叉尖避障功能',
      data: {
        pick_cargo_pe_close_distance: 400, //屏蔽光电避障功能（取货）
        place_cargo_pe_close_distance: 400, //屏蔽光电避障功能（放货）
        pick_cargo_pc_close_distance: 400, //屏蔽点云避障功能（取货）
        place_cargo_pc_close_distance: 400, //屏蔽点云避障功能（放货）
        associated_io_sensor_list: ['pe_tip_left', 'pe_tip_right'], //关联IO
        associated_pc_sensor_list: ['tip_camera', 'perception_3d_lidar'], //关联传感器frame_id
      },
    },
  ];
  const {
    rects,
    setSelectedId,
    selectedId,
    stage,
    size,
    setReRenderLineGrid,
    reRenderLineGrid,
    setRects,
    setOpenUpdateObsDrawer,
    isDark,
  } = props;
  const [selectRect, setSelectRect] = useState<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  // 保存每个 item 的 ref
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // 是否开启批量删除
  const [isBatchDelete, setIsBatchDelete] = useState(false);
  // 多选的值
  const [checkedList, setCheckedList] = useState<string[]>([]);

  // 滚动到选中的 item
  useEffect(() => {
    if (selectedId) {
      const item = itemRefs.current[selectedId];
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (selectRect && stage && size) {
      const rectCenterX = selectRect.x + selectRect.width / 2;
      const rectCenterY = selectRect.y + selectRect.height / 2;

      // 舞台缩放
      const scale = stage.scaleX(); // 假设 x 和 y 的 scale 一样
      const stageCenterX = size.width / 2;
      const stageCenterY = size.height / 2;

      // 计算新的舞台位置
      const newX = stageCenterX - rectCenterX * scale;
      const newY = stageCenterY - rectCenterY * scale;

      new Konva.Tween({
        node: stage,
        duration: 0.5,
        x: newX,
        y: newY,
        easing: Konva.Easings.EaseInOut,
        onFinish: () => setReRenderLineGrid(!reRenderLineGrid),
      }).play();
    }
  }, [selectRect, stage, size]);

  // 批量删除
  const handleBatchDelete = () => {
    modal.confirm({
      title: '确认删除？',
      okText: '确认',
      onOk: () => {
        setRects(rects.filter((item) => !checkedList.includes(item.id)));
        setCheckedList([]);
        setIsBatchDelete(false);
      },
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* <ConfigProvider
        theme={{
          // algorithm: theme.defaultAlgorithm,
          token: {
            colorText: '#000',
            colorTextSecondary: '#000',
          },
        }}
      > */}
      <Form form={form}>
        <div className='flex flex-col gap-2'>
          <Tooltip placement='topRight' title='修改避障策略参数，请使用roboToolkit'>
            <p className='text-md font-bold relative pb-2 flex justify-between items-center'>
              避障策略
              <ExclamationCircleOutlined className='text-md' />
              <Line1px />
            </p>
          </Tooltip>

          <Checkbox.Group className='grid grid-cols-1  rounded-md' value={['2', '3']}>
            {strategyTpye.length === 0 && <p className='text-xs text-gray-500'>暂无数据</p>}
            {strategyTpye.map((item) => {
              return (
                <div
                  key={item.id}
                  className='group flex items-center justify-between hover:shadow-sm  hover:bg-[#c4c4c46e] rounded-md p-2 animation-all duration-300'
                >
                  <Checkbox
                    style={{ color: token.colorTextBase }}
                    value={item.id.toString()}
                    disabled={![2, 3].includes(item.id)}
                  >
                    {item.name}
                  </Checkbox>
                  <Popover trigger='hover' content={<RenderStrategyTpye data={item} />} align={{ offset: [-8, -0] }}>
                    <InfoCircleOutlined className='opacity-20 group-hover:opacity-100 animation-all duration-500 cursor-pointer hover:text-teal-500 hover:shadow-lg' />
                  </Popover>
                </div>
              );
            })}
          </Checkbox.Group>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2'>
            <p className='text-md font-bold relative py-2'>
              停车距离
              <Line1px />
            </p>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2'>
                <p className='text-xs text-nowrap shrink-0'>前进停车距离</p>
                <Form.Item
                  className='!mb-0 flex-1'
                  name='forward_stop_distance'
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <Input type='number' />
                </Form.Item>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-xs text-nowrap shrink-0'>后退停车距离</p>
                <Form.Item
                  className='!mb-0 flex-1'
                  name='backward_stop_distance'
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <Input type='number' />
                </Form.Item>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-xs text-nowrap shrink-0'>自旋</p>
                <Form.Item
                  className='!mb-0 flex-1'
                  name='spin_stop_distance'
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <Input type='number' />
                </Form.Item>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-xs text-nowrap shrink-0 min-w-[150px]'>离地高度</p>
                <Form.Item
                  className='!mb-0 flex-1'
                  name='ground_filter_height'
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <Input type='number' />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <Accordion title={<p className='text-md font-bold relative py-2'>点云传感器</p>} defaultOpen={false}>
          <div className='flex flex-col gap-2'>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className='rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器1</p>
              <Switch />
            </div>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className='rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器2</p>
              <Switch />
            </div>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className=' rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器3</p>
              <Switch />
            </div>
          </div>
        </Accordion>
        <Accordion title={<p className='text-md font-bold relative py-2'>IO信号</p>} defaultOpen={false}>
          <div className='flex flex-col gap-2'>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className='rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器1</p>
              <Switch />
            </div>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className='rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器2</p>
              <Switch />
            </div>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className=' rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器3</p>
              <Switch />
            </div>
          </div>
        </Accordion>
        <Accordion title={<p className='text-md font-bold relative py-2'>CE雷达信号</p>} defaultOpen={false}>
          <div className='flex flex-col gap-2'>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className='rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器1</p>
              <Switch />
            </div>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className='rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器2</p>
              <Switch />
            </div>
            <div
              style={{
                background: token.colorBgContainerDisabled,
              }}
              className=' rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg  hover:font-bold  animation-all duration-300 '
            >
              <p className='text-md'>传感器3</p>
              <Switch />
            </div>
          </div>
        </Accordion>
      </Form>

      <div className='flex flex-col gap-2'>
        <p className='flex justify-between items-center text-md font-bold relative pb-2'>
          保护区域列表
          {!isBatchDelete ? (
            <MinusCircleOutlined
              className={`${rects.length ? '' : 'hidden'} text-lg cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 animation-all duration-300`}
              onClick={() => setIsBatchDelete(true)}
            />
          ) : (
            <div className='flex items-center gap-2'>
              {checkedList.length ? (
                <motion.div
                  initial={{ opacity: 0, scale: 1.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <DeleteOutlined
                    className='border p-[2px] text-md rounded-full border-red-600 cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 transition-all duration-300'
                    style={{
                      color: token.colorErrorActive,
                    }}
                    onClick={handleBatchDelete}
                  />
                </motion.div>
              ) : (
                <StopOutlined className='opacity-60 text-lg cursor-not-allowed' />
              )}
              <CloseCircleOutlined
                className='cursor-pointer opacity-60 text-lg hover:opacity-100 hover:scale-125 animation-all duration-300'
                style={
                  {
                    // color: token.colorError,
                  }
                }
                onClick={() => {
                  setIsBatchDelete(false);
                  setCheckedList([]);
                }}
              />
            </div>
          )}
          <Line1px />
        </p>
        <Checkbox.Group className='flex flex-col gap-2' value={checkedList} onChange={setCheckedList}>
          {rects?.length ? (
            rects.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[item.id] = el)}
                  style={{
                    borderColor: isSelected ? token.colorPrimary : token.colorBorder,
                    background: isSelected ? token.colorFillContentHover : token.colorBgContainerDisabled,
                    color: token.colorTextBase,
                  }}
                  className={`group w-full bg-[#F7F8FA] rounded-md flex flex-col gap-2 justify-between p-4 hover:bg-[#E8EAF0] hover:shadow-lg  hover:font-bold  animation-all duration-300 cursor-pointer ${isSelected ? 'shadow-lg bg-[#E8EAF0]  font-bold' : ''}`}
                  onClick={() => {
                    setSelectedId(item.id);
                    setSelectRect(item);
                  }}
                >
                  <p className='text-sm flex items-center justify-between'>
                    {isBatchDelete ? <Checkbox value={item.id}>{item.id}</Checkbox> : item.id}
                    <Tooltip title='关联机构'>
                      <Segmented
                        size={'small'}
                        className='hover:shadow-lg animation-all duration-300'
                        // shape='round'
                        options={[
                          { value: 'light', icon: <WalletOutlined /> },
                          { value: 'dark', icon: <PauseOutlined /> },
                        ]}
                      />
                    </Tooltip>
                  </p>
                  <div className='w-full rounded-md grid-cols-2 grid gap-2'>
                    {/* 左上角坐标 */}
                    <p className='text-xs opacity-50 flex gap-2 animation-all duration-300 border-r border-dashed hover:border-[#333]'>
                      <ArrowUpOutlined className='-rotate-45' />
                      <span>
                        (x:{Math.round(item.x)}, y:{Math.round(item.y)})
                      </span>
                    </p>
                    {/* 右下角坐标 */}
                    <p className='text-xs opacity-50 flex gap-2'>
                      <ArrowRightOutlined className='rotate-45' />
                      <span>
                        (x:{Math.round(item.x + item.width)}, y:{Math.round(item.y + item.height)})
                      </span>
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className={`group w-full h-40 py-4 rounded-lg flex flex-col items-center justify-center ${!isDark ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]' : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_0%)]'}
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300`}
            >
              <SvgIcon className='group-hover:scale-110 animation-all duration-300' name='noArea' size={128}></SvgIcon>
              <p className='opacity-60 text-xs'>暂无区域数据，请添加</p>
            </div>
          )}
        </Checkbox.Group>
      </div>
      {/* </ConfigProvider> */}
      <div
        className='w-full h-12 p-2 border-t absolute bottom-0 left-0 flex items-center justify-end gap-2'
        style={{ background: token.colorBgContainer, borderColor: token.colorBorder }}
      >
        <Button type='primary' onClick={() => form.validateFields()}>
          修改
        </Button>
        <Button
          variant='outlined'
          color='red'
          onClick={() => {
            setOpenUpdateObsDrawer(false);
          }}
        >
          取消
        </Button>
      </div>
    </div>
  );
};

export default DrawerContent;
