import PanelLoading from '@/components/PanelLoading';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PauseOutlined,
  StopOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Checkbox, Form, Input, Popover, Segmented, Switch, theme, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import YAML from 'js-yaml';
import Konva from 'konva';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { getConfig_h7, getDeviceList } from '../../service';
import { extractKeyValue } from '../../utils';
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
  currentObsInfo: Record<string, any>;
}
const DrawerContent = (props: IProps) => {
  const io_sensor_list = ['obstacle_stop_right', 'pe_charge_input'];
  const { useToken } = theme;
  const { modal } = App.useApp();
  const { token } = useToken();
  const [form] = Form.useForm();
  const { i18n } = useTranslation();
  const {
    data: IoResponse,
    mutate: updateIoResponse,
    run: getIoResponse,
    loading,
  } = useRequest<any, any>(getConfig_h7, {
    manual: true,
    onSuccess: (response) => {
      updateIoResponse(YAML.load(response)); // 倒反天罡
    },
  });

  const ioInputConfig = useMemo(() => {
    if (!IoResponse?.io_input_config) return;

    const ioAttr = extractKeyValue(IoResponse);
    // 根据io_sensor_list 过滤ioAttr
    // 只保留 io_sensor_list 里面的 key
    const filtered = ioAttr.filter((item) => {
      if (io_sensor_list.includes(item.key)) {
        return item;
      }
    });
    return filtered;
  }, [IoResponse, io_sensor_list]);

  useEffect(() => {
    getIoResponse();
  }, [i18n.language]);

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
        min_forkarm_height_to_open_this: 100, //叉臂下方保护区域最小高度
        height_start: 100, //叉臂下方起始保护高度
        forkarm_height_cut: 300, //叉臂下方裁剪高度
        min_distance_to_task_point_close_this: 1000, //叉臂下方保护区域最小距离
        associated_sensor_list: ['tail_lidar', 'perception_3d_lidar'], //关联传感器frame_id
      },
    },
    {
      id: 3,
      name: '放货空间检测',
      data: {
        min_forkarm_height_to_open_this: 100, //放货检测启用高度阈值
        cuboid: [0, 1, 2, 2, 3, 4], //保护区域长方体
        associated_sensor_list: ['tail_lidar', 'perception_3d_lidar'], //关联传感器frame_id
        min_distance_to_task_point_open_this: 1000, //放货检测启用距离目标阈值
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
    currentObsInfo,
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

  const { data: deviceList } = useRequest(getDeviceList);

  const [initFormValue, setInitalValue] = useState(currentObsInfo ?? {});

  const serviceLanguage = useMemo(() => {
    return i18n.language;
  }, [i18n.language]);

  const memoDeviceList = useMemo(() => {
    if (!deviceList)
      return (
        <div
          className={`group w-full h-20 py-4 rounded-lg flex flex-row items-center justify-center ${!isDark ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]' : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_0%)]'}
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300`}
        >
          <SvgIcon className='group-hover:scale-110 animation-all duration-300' name='servicerror' size={80}></SvgIcon>
          <p className='opacity-60 text-xs'>请求失败，请重试！</p>
        </div>
      );
    return deviceList?.data ? (
      deviceList.data.map((item) => (
        <Checkbox
          key={item.name}
          value={item.name}
          style={{ background: token.colorBgContainerDisabled }}
          className='rounded-md flex items-center justify-between p-2 hover:bg-black/20 hover:shadow-lg hover:font-bold transition-all duration-300'
        >
          <p className='text-md'>{serviceLanguage.includes('zh') ? item.ch_name : item.name}</p>
        </Checkbox>
      ))
    ) : (
      <div
        className={`group w-full h-40 py-4 rounded-lg flex flex-col items-center justify-center ${!isDark ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]' : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_0%)]'}
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300`}
      >
        <SvgIcon className='group-hover:scale-110 animation-all duration-300' name='noArea' size={128}></SvgIcon>
        <p className='opacity-60 text-xs'>暂无传感器数据，请添加</p>
      </div>
    );
  }, [currentObsInfo, deviceList?.data, serviceLanguage]);

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
      <Form form={form} initialValues={initFormValue}>
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
          <Tooltip placement='topRight' title='修改关联IO信号，请使用roboToolkit'>
            <p className='text-md font-bold relative py-2 flex justify-between items-center'>
              IO信号
              <ExclamationCircleOutlined className='text-md' />
              <Line1px />
            </p>
          </Tooltip>

          <Checkbox.Group
            className={`grid grid-cols-1 rounded-md relative p-2 bg-black/10 ${isDark && '!bg-white/10'} min-h-10`}
          >
            {loading ? <PanelLoading isDark={isDark} /> : null}
            {!ioInputConfig?.length && !loading && (
              <div
                className={`group w-full h-20 py-4 rounded-lg flex flex-row items-center justify-center ${!isDark ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]' : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_0%)]'}
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300`}
              >
                <SvgIcon
                  className='group-hover:scale-110 animation-all duration-300'
                  name='servicerror'
                  size={80}
                ></SvgIcon>
                <p className='opacity-60 text-xs'>请求失败，请重试！</p>
              </div>
            )}
            {ioInputConfig?.map((item) => {
              return (
                <div
                  key={item.key}
                  className='group flex items-center justify-between hover:shadow-sm  hover:bg-[#c4c4c46e] rounded-md p-2 animation-all duration-300'
                >
                  {item.value}
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
          <Form.Item className='mb-0' name='sensor_enable'>
            <Checkbox.Group className='grid w-full'>
              <div className='flex flex-col gap-2 mt-2'>{memoDeviceList}</div>
            </Checkbox.Group>
          </Form.Item>
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
                      <SvgIcon name='buttomright' className='transform scale-x-[-1] scale-y-[-1]' />
                      <span>
                        (x:{0 - Math.round(item.y)}, y:{0 - Math.round(item.x)})
                      </span>
                    </p>
                    {/* 右下角坐标 */}
                    <p className='text-xs opacity-50 flex gap-2'>
                      <SvgIcon name='buttomright' />
                      <span>
                        (x:{0 - Math.round(item.y + item.height)}, y:{0 - Math.round(item.x + item.width)})
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
        <Button
          type='primary'
          onClick={async () => {
            await form.validateFields();
            const formValue = form.getFieldsValue();
            const sendFormData = { ...initFormValue, ...formValue };
            console.log(sendFormData);
          }}
        >
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
