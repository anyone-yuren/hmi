import {
  CloseSquareOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  MinusSquareOutlined,
  PauseOutlined,
  StopOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { App, Checkbox, ConfigProvider, Input, Segmented, theme, Tooltip } from 'antd';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { SvgIcon } from 'ui';
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
}
const DrawerContent = (props: IProps) => {
  const { useToken } = theme;
  const { modal } = App.useApp();
  const { token } = useToken();
  const { rects, setSelectedId, selectedId, stage, size, setReRenderLineGrid, reRenderLineGrid, setRects } = props;
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
      },
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorText: '#000',
            colorTextSecondary: '#000',
          },
        }}
      >
        <div className='flex flex-col gap-2'>
          <p className='text-md font-bold relative pb-2'>
            避障策略
            <Line1px />
          </p>

          <Checkbox.Group className='grid grid-cols-2 bg-[#f5f5f5] p-2 rounded-md'>
            <div className='group flex items-center justify-between hover:shadow-sm hover:-translate-y-0.5 hover:bg-[#e3e3e3] rounded-md p-2 animation-all duration-300'>
              <Checkbox value='1'>避障策略1</Checkbox>
              <InfoCircleOutlined className='opacity-20 group-hover:opacity-100 animation-all duration-500 cursor-pointer hover:text-teal-500 hover:shadow-lg' />
            </div>
            <div className='group flex items-center justify-between hover:shadow-sm hover:-translate-y-0.5 hover:bg-[#e3e3e3] rounded-md p-2 animation-all duration-300'>
              <Checkbox value='2'>避障策略2</Checkbox>
              <InfoCircleOutlined className='opacity-20 group-hover:opacity-100 animation-all duration-500 cursor-pointer hover:text-teal-500 hover:shadow-lg' />
            </div>
            <div className='group flex items-center justify-between hover:shadow-sm hover:-translate-y-0.5 hover:bg-[#e3e3e3] rounded-md p-2 animation-all duration-300'>
              <Checkbox value='3'>避障策略3</Checkbox>
              <InfoCircleOutlined className='opacity-20 group-hover:opacity-100 animation-all duration-500 cursor-pointer hover:text-teal-500 hover:shadow-lg' />
            </div>
            <div className='group flex items-center justify-between hover:shadow-sm hover:-translate-y-0.5 hover:bg-[#e3e3e3] rounded-md p-2 animation-all duration-300'>
              <Checkbox value='4'>避障策略4</Checkbox>
              <InfoCircleOutlined className='opacity-20 group-hover:opacity-100 animation-all duration-500 cursor-pointer hover:text-teal-500 hover:shadow-lg' />
            </div>
            <div className='group flex items-center justify-between hover:shadow-sm hover:-translate-y-0.5 hover:bg-[#e3e3e3] rounded-md p-2 animation-all duration-300'>
              <Checkbox value='5'>避障策略5</Checkbox>
              <InfoCircleOutlined className='opacity-20 group-hover:opacity-100 animation-all duration-500 cursor-pointer hover:text-teal-500 hover:shadow-lg' />
            </div>
          </Checkbox.Group>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2'>
            <p className='text-md font-bold relative pb-2'>
              停车距离
              <Line1px />
            </p>
            <div className='flex flex-row gap-2 items-center'>
              <p className='text-xs text-nowrap'>前进</p>
              <Input type='number' />
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <p className='text-xs flex-1 text-nowrap'>后退</p>
              <Input type='number' />
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <p className='text-xs text-nowrap'>自旋</p>
              <Input type='number' />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-md font-bold relative pb-2'>
            传感器控制
            <Line1px />
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='flex justify-between items-center text-md font-bold relative pb-2'>
            避障区域列表
            {!isBatchDelete ? (
              <MinusSquareOutlined
                className='cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 animation-all duration-300'
                onClick={() => setIsBatchDelete(true)}
              />
            ) : (
              <div className='flex items-center gap-2'>
                {checkedList.length ? (
                  <DeleteOutlined
                    className='border border-yellow-400 cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 animation-all duration-300'
                    style={{
                      color: token.colorWarning,
                      fontSize: '12px',
                    }}
                    onClick={handleBatchDelete}
                  />
                ) : (
                  <StopOutlined className='opacity-60 cursor-not-allowed' />
                )}
                <CloseSquareOutlined
                  className='cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 animation-all duration-300'
                  style={
                    {
                      // color: token.colorError,
                    }
                  }
                  onClick={() => setIsBatchDelete(false)}
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
                    className={`w-full bg-[#F7F8FA] rounded-md flex flex-col gap-2 justify-between p-4 hover:bg-[#E8EAF0] hover:shadow-lg hover:-translate-y-1 hover:font-bold  animation-all duration-300 cursor-pointer ${isSelected ? 'shadow-lg bg-[#E8EAF0] -translate-y-1 font-bold' : ''}`}
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
                      <p className='text-xs opacity-50'>宽度 {Math.round(item.width)} (mm)</p>
                      <p className='text-xs opacity-50'>高度 {Math.round(item.height)} (mm)</p>
                      <p className='text-xs opacity-50'>位置x {Math.round(item.x)} (mm)</p>
                      <p className='text-xs opacity-50'>位置y {Math.round(item.y)} (mm)</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className='w-full h-40 py-4 rounded-lg flex flex-col items-center justify-center bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300'
              >
                <SvgIcon name='noArea' size={128}></SvgIcon>
                <p className='opacity-60 text-xs'>暂无区域数据，请添加</p>
              </div>
            )}
          </Checkbox.Group>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default DrawerContent;
