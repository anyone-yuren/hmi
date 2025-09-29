import PanelLoading from '@/components/PanelLoading';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Checkbox, Dropdown, Form, InputNumber, Popover, Space, theme, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import YAML from 'js-yaml';
import Konva from 'konva';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { SvgIcon } from 'ui';
import useActiveDevice, { useStrategyListName } from '../../hooks/useActiveDevice';
import { getActiveDevices, getConfig_h7, getDeviceList, updateSafety } from '../../service';
import { extractKeyValue, getRectPoints } from '../../utils';
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
  strategyList: Record<string, Record<string, any>>;
  refreshCurrentObsInfo: (scheme_id: string | null) => void;
}
const DrawerContent = (props: IProps) => {
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
    strategyList,
    refreshCurrentObsInfo,
  } = props;

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

  // 对比currentObsInfo与form.getFieldsValue()，是否有差异
  const isFormChanged = () => {
    const formValues = form.getFieldsValue();
    // 判断rects与currentObsInfo的protect_areas是否有变更 暂时不写
    return (
      Object.keys(formValues).some((key) => formValues[key] !== currentObsInfo[key]) ||
      rects.length !== currentObsInfo.protect_areas?.length
    );
  };

  const { run: update, loading: uploadLoading } = useRequest(updateSafety, {
    manual: true,
    onSuccess: (res) => {
      if (res?.code === 200) {
        toast.success('更新成功', {
          position: 'bottom-center',
        });
        refreshCurrentObsInfo(currentObsInfo.scheme_id, true);
      }
    },
  });

  // 获取可活动机构数据
  const { run: getActiveDevicesRun, data: activeDevices } = useRequest(getActiveDevices);

  const activeDevice = useActiveDevice(activeDevices?.data ?? []);

  const ioInputConfig = useMemo(() => {
    if (!IoResponse?.io_input_config) return;
    const { result: ioAttr, inputConfig, outputConfig } = extractKeyValue(IoResponse);
    // 根据io_sensor_list 过滤ioAttr
    // 只保留 io_sensor_list 里面的 key
    const filtered = ioAttr.filter((item) => {
      if (io_sensor_list.includes(item.key)) {
        return item;
      }
    });
    return { filtered, inputConfig, outputConfig };
  }, [IoResponse, io_sensor_list]);

  useEffect(() => {
    getIoResponse();
    getDevice();
  }, [i18n.language]);

  const strategyListName = useStrategyListName();

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

  // 避障策略数据
  const [propStrategyList, _] = useState(strategyList ?? {});

  const {
    data: deviceList,
    run: getDevice,
    loading: loadingDevice,
  } = useRequest(getDeviceList, {
    manual: true,
  });

  const [initFormValue, setInitalValue] = useState(currentObsInfo ?? {});

  const serviceLanguage = useMemo(() => {
    return i18n.language;
  }, [i18n.language]);

  const memoDeviceList = useMemo(() => {
    if (!deviceList)
      return (
        <div
          className={`group w-full h-20 py-4 cursor-pointer rounded-lg flex flex-row items-center justify-center ${!isDark ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]' : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_0%)]'}
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300`}
          onClick={() => getDevice()}
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
          className='rounded-md p-2 hover:bg-black/20 hover:shadow-lg hover:font-bold transition-all duration-300'
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
  }, [currentObsInfo, deviceList?.data, serviceLanguage, loadingDevice]);

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

          <Checkbox.Group className='grid grid-cols-1  rounded-md' value={currentObsInfo?.strategy_list}>
            {Object.keys(propStrategyList).length === 0 && <p className='text-xs text-gray-500'>暂无数据</p>}
            {Object.keys(propStrategyList).map((item) => {
              return (
                <div
                  key={item}
                  className='group flex items-center justify-between hover:shadow-sm  hover:bg-[#c4c4c46e] rounded-md p-2 animation-all duration-300'
                >
                  <Checkbox
                    style={{ color: token.colorTextBase }}
                    value={propStrategyList[item]?.id}
                    disabled={!currentObsInfo?.strategy_list.includes(propStrategyList[item].id)}
                  >
                    {strategyListName[item]}
                  </Checkbox>
                  <Popover
                    trigger='hover'
                    content={
                      <RenderStrategyTpye
                        data={{ ...propStrategyList[item], name: item, list: propStrategyList[item] }}
                        isDark={isDark}
                        idStrategyEndPathCloseProtection={currentObsInfo?.id_strategy_end_path_close_protection}
                        ioInputConfig={ioInputConfig} // 转换后的IO数据
                        pcSensorList={deviceList?.data ?? []}
                      />
                    }
                    align={{ offset: [-8, -0] }}
                  >
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
              IO信号（输入）
              <ExclamationCircleOutlined className='text-md' />
              <Line1px />
            </p>
          </Tooltip>

          <Checkbox.Group
            className={`grid grid-cols-1 rounded-md relative p-2 bg-black/10 ${isDark && '!bg-white/10'} min-h-10`}
          >
            {loading ? <PanelLoading isDark={isDark} /> : null}
            {!ioInputConfig?.inputConfig?.length && !loading && (
              <div
                className={`group w-full h-20 py-4 rounded-lg flex flex-row items-center justify-center ${!isDark ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]' : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_0%)]'}
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300`}
              >
                <SvgIcon
                  className='group-hover:scale-110 animation-all duration-300'
                  name='servicerror'
                  size={80}
                ></SvgIcon>
                <p className='opacity-60 text-xs' onClick={() => getIoResponse()}>
                  请求失败，请重试！
                </p>
              </div>
            )}
            {ioInputConfig?.inputConfig?.map((item) => {
              if (!currentObsInfo) return;
              return (
                <div
                  key={item?.key}
                  style={{
                    display: currentObsInfo?.io_sensor_list?.includes(item?.key) ? 'flex' : 'none',
                  }}
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
                <p className='text-xs text-nowrap shrink-0'>前方安全停车距离</p>
                <Form.Item
                  className='!mb-0 flex-1'
                  name='forward_stop_distance'
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <InputNumber className='w-full' />
                </Form.Item>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-xs text-nowrap shrink-0'>后方安全停车距离</p>
                <Form.Item
                  className='!mb-0 flex-1'
                  name='backward_stop_distance'
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <InputNumber className='w-full' />
                </Form.Item>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-xs text-nowrap shrink-0'>自旋安全停车距离</p>
                <Form.Item
                  className='!mb-0 flex-1'
                  name='rotate_stop_distance'
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <InputNumber className='w-full' />
                </Form.Item>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-xs text-nowrap shrink-0 min-w-[150px]'>地面滤波</p>
                <Form.Item
                  className='!mb-0 flex-1'
                  name='ground_filter_height'
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <InputNumber className='w-full' />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <Accordion title={<p className='text-md font-bold relative py-2'>点云传感器</p>} defaultOpen={false}>
          <Form.Item className='mb-0' name='pc_sensor_list'>
            <Checkbox.Group className='grid w-full'>
              <div className='flex flex-col gap-2 mt-2'>{memoDeviceList}</div>
              {loadingDevice ? <PanelLoading isDark={isDark} /> : null}
            </Checkbox.Group>
          </Form.Item>
        </Accordion>
      </Form>

      <div className='flex flex-col gap-2'>
        <p className='flex justify-between items-center text-md font-bold relative pb-2'>
          安全保护区域
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
                  <p className='text-sm flex items-center justify-between gap-2'>
                    {isBatchDelete ? <Checkbox value={item.id}>{item.id}</Checkbox> : item.id}
                    <Dropdown
                      menu={{
                        items: activeDevice.map((item) => ({ key: String(item.value), label: item.label })),
                        onClick: (e) => {
                          setRects((prev) =>
                            prev.map((item) =>
                              item.id === selectedId ? { ...item, associated_device: Number(e.key) } : item,
                            ),
                          );
                        },
                        selectedKeys: [item?.associated_device && String(item?.associated_device)],
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          {activeDevice.find((device) => device.value === item.associated_device)?.label ?? '-'}
                          <EllipsisOutlined />
                        </Space>
                      </a>
                    </Dropdown>
                    {/* <Select className='w-1/2' placeholder='关联机构' options={activeDevice}></Select> */}
                    {/* <Tooltip title='关联机构'>
                      <Segmented
                        size={'small'}
                        className='hover:shadow-lg animation-all duration-300'
                        // shape='round'
                        options={[
                          { value: 'light', icon: <WalletOutlined /> },
                          { value: 'dark', icon: <PauseOutlined /> },
                        ]}
                      />
                    </Tooltip> */}
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
          disabled={uploadLoading}
          loading={uploadLoading}
          onClick={async () => {
            await form.validateFields();
            const formValue = form.getFieldsValue();
            const protectAreas = rects.map((item, index) => {
              return {
                id: typeof item.id === 'string' ? Number(item.id) : item.id,
                associated_device: item?.associated_device ?? 1,
                rectangle: getRectPoints(item.x, item.y, item.width, item.height),
              };
            });
            const sendFormData = { ...initFormValue, ...formValue, protect_areas: protectAreas };
            const res = await update({
              ...sendFormData,
            });
            setOpenUpdateObsDrawer(false);
          }}
        >
          修改
        </Button>
        <Button
          variant='outlined'
          color='red'
          onClick={() => {
            const hasChange = isFormChanged();
            if (hasChange) {
              modal.confirm({
                title: '当前数据有变更，是否确认退出',
                okText: '确认',
                onOk: () => {
                  refreshCurrentObsInfo(null);
                  setOpenUpdateObsDrawer(false);
                },
              });
            } else {
              setOpenUpdateObsDrawer(false);
            }
          }}
        >
          取消
        </Button>
      </div>
    </div>
  );
};

export default DrawerContent;
