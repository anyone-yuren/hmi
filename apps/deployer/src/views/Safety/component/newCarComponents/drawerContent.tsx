import { ConfigProvider, Input, Select, Switch, theme } from 'antd';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
export const Line1px = () => {
  return (
    <div className='w-full h-px bg-gradient-to-r from-white/0 via-[#e3e3e3] to-white/0 absolute bottom-0 left-0'></div>
  );
};

interface IProps {
  rects: Array<{ id: string; x: number; y: number; width: number; height: number }>;
  setSelectedId: (id: string) => void;
  selectedId: string | null;
  stage: Konva.Stage | null;
  size?: { width: number; height: number } | null;
  setReRenderLineGrid: (value: boolean) => void;
  reRenderLineGrid: boolean;
}
const DrawerContent = (props: IProps) => {
  const { rects, setSelectedId, selectedId, stage, size, setReRenderLineGrid, reRenderLineGrid } = props;
  const [selectRect, setSelectRect] = useState<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  // 保存每个 item 的 ref
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
          <Select
            options={[
              {
                label: '避障策略1',
                value: '1',
              },
              {
                label: '避障策略2',
                value: '2',
              },
            ]}
          />
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
          <div className='flex flex-col gap-2'>
            <div className='bg-black/10 rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
              <p className='text-md'>传感器1</p>
              <Switch />
            </div>
            <div className='bg-black/10 rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
              <p className='text-md'>传感器2</p>
              <Switch />
            </div>
            <div className='bg-black/10 rounded-md flex items-center justify-between p-2 cursor-pointer hover:bg-black/20 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
              <p className='text-md'>传感器3</p>
              <Switch />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-md font-bold relative pb-2'>
            避障区域列表
            <Line1px />
          </p>
          <div className='flex flex-col gap-2'>
            {rects.map((item) => {
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
                  <p className='text-sm'>{item.id}</p>
                  <div className='w-full rounded-md grid-cols-2 grid gap-2'>
                    <p className='text-xs opacity-50'>宽度 {Math.round(item.width)} (mm)</p>
                    <p className='text-xs opacity-50'>高度 {Math.round(item.height)} (mm)</p>
                    <p className='text-xs opacity-50'>位置x {Math.round(item.x)} (mm)</p>
                    <p className='text-xs opacity-50'>位置y {Math.round(item.y)} (mm)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default DrawerContent;
