import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  NodeIndexOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Input, InputNumber, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import { FilterStrategy, SensorItem } from '../types/sensor';

interface SensorFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  sensors: SensorItem[];
  onToggleVisible: (id: string, checked: boolean) => void;
  onAddStrategy: (
    sensorId: string,
    strategy: Omit<FilterStrategy, 'id'>,
  ) => void;
  onDeleteStrategy: (sensorId: string, filterId: string) => void;
}

export const SensorFilterDrawer: React.FC<SensorFilterDrawerProps> = ({
  open,
  onClose,
  sensors,
  onToggleVisible,
  onAddStrategy,
  onDeleteStrategy,
}) => {
  // 控制哪个传感器正在内嵌编辑新增
  const [editingSensorId, setEditingSensorId] = useState<string | null>(null);

  // 内嵌表单的临时独立受控状态
  const [strategyName, setStrategyName] = useState('');
  const [heightVal, setHeightVal] = useState<number>(0);
  const [angleVal, setAngleVal] = useState<number>(0);
  const [verticalVal, setVerticalDist] = useState<number>(0);
  const [horizontalVal, setHorizontalDist] = useState<number>(0);

  const handleOpenInlineAdd = (sensorId: string) => {
    setEditingSensorId(sensorId);
    setStrategyName('');
    setHeightVal(0);
    setAngleVal(0);
    setVerticalDist(0);
    setHorizontalDist(0);
  };

  const handleInlineSubmit = (sensorId: string) => {
    if (!strategyName.trim()) return;
    onAddStrategy(sensorId, {
      name: strategyName,
      height: heightVal,
      angle: angleVal,
      verticalDist: verticalVal,
      horizontalDist: horizontalVal,
    });
    setEditingSensorId(null);
  };

  return (
    <Drawer
      title={
        <span className='text-zinc-200 font-bold tracking-wider flex items-center gap-2'>
          <NodeIndexOutlined className='text-emerald-400' />{' '}
          传感器外设与点云网络控制
        </span>
      }
      placement='right'
      width={360}
      onClose={onClose}
      open={open}
      styles={{
        body: { padding: 16, backgroundColor: '#18181b', color: '#f4f4f5' },
        header: {
          backgroundColor: '#27272a',
          borderBottom: '1px solid #3f3f46',
        },
      }}
      mask={false} // ⭐ 关键：去除遮罩层，允许用户在抽屉打开时自由拖拽旋转 3D Canvas
      style={{ boxShadow: '-5px 0 25px rgba(0,0,0,0.5)' }}
    >
      <div className='space-y-4'>
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className='bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl'
          >
            {/* 头部信息与显示开关 */}
            <div className='flex items-center justify-between border-b border-zinc-800 pb-3 mb-3'>
              <div>
                <span className='text-zinc-100 font-medium block text-xs'>
                  {sensor.name}
                </span>
                <span className='inline-block px-2 py-0.5 mt-1 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded text-[10px] uppercase font-mono'>
                  {sensor.type}
                </span>
              </div>
              <div className='flex items-center space-x-2 bg-zinc-950/60 px-3 py-1.5 rounded-lg border border-zinc-800'>
                <span className='text-zinc-400 text-xs'>显示点云</span>
                <Switch
                  checked={sensor.showPointCloud}
                  onChange={(checked) => onToggleVisible(sensor.id, checked)}
                  size='small'
                />
              </div>
            </div>

            {/* 标定策略操作栏 */}
            <div className='flex justify-between items-center mb-2'>
              <span className='text-zinc-400 text-xs font-bold'>
                已挂载滤波策略 ({sensor.filters.length})
              </span>
              {editingSensorId !== sensor.id && (
                <Button
                  type='primary'
                  size='small'
                  ghost
                  className='border-emerald-500/50 text-emerald-400 text-xs'
                  icon={<PlusOutlined />}
                  onClick={() => handleOpenInlineAdd(sensor.id)}
                ></Button>
              )}
            </div>

            {/* 🔥 增量注入：无遮挡内嵌式直接新增表单面板 */}
            {editingSensorId === sensor.id && (
              <div className='bg-zinc-950/90 p-3 rounded-lg border border-emerald-500/30 mb-3 space-y-2.5 animate-fade-in animate-duration-200'>
                <div>
                  <div className='text-zinc-500 text-[10px] mb-1'>
                    滤波策略名称
                  </div>
                  <Input
                    size='small'
                    value={strategyName}
                    onChange={(e) =>
                      setStrategyName((targetValue) => e.target.value)
                    }
                    placeholder='如: 前叉高程过滤'
                    className='bg-zinc-800 border-zinc-700 text-zinc-200 text-xs'
                  />
                </div>
                <div className='grid grid-cols-2 gap-2 font-mono'>
                  <div>
                    <div className='text-zinc-500 text-[10px]'>
                      高度限制 (m)
                    </div>
                    <InputNumber
                      size='small'
                      className='w-full text-xs'
                      step={0.1}
                      value={heightVal}
                      onChange={(v) => setHeightVal(v || 0)}
                    />
                  </div>
                  <div>
                    <div className='text-zinc-500 text-[10px]'>
                      过滤角度 (°)
                    </div>
                    <InputNumber
                      size='small'
                      className='w-full text-xs'
                      step={1}
                      value={angleVal}
                      onChange={(v) => setAngleVal(v || 0)}
                    />
                  </div>
                  <div>
                    <div className='text-zinc-500 text-[10px]'>
                      纵向距离 (m)
                    </div>
                    <InputNumber
                      size='small'
                      className='w-full text-xs'
                      step={0.5}
                      value={verticalVal}
                      onChange={(v) => setVerticalDist(v || 0)}
                    />
                  </div>
                  <div>
                    <div className='text-zinc-500 text-[10px]'>
                      横向距离 (m)
                    </div>
                    <InputNumber
                      size='small'
                      className='w-full text-xs'
                      step={0.5}
                      value={horizontalVal}
                      onChange={(v) => setHorizontalDist(v || 0)}
                    />
                  </div>
                </div>
                <div className='flex justify-end space-x-2 pt-1'>
                  <Button
                    size='small'
                    icon={<CloseOutlined />}
                    onClick={() => setEditingSensorId(null)}
                    className='text-xs'
                  >
                    取消
                  </Button>
                  <Button
                    size='small'
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={!strategyName.trim()}
                    onClick={() => handleInlineSubmit(sensor.id)}
                    className='text-xs bg-emerald-600 border-emerald-600 hover:bg-emerald-500'
                  >
                    确定
                  </Button>
                </div>
              </div>
            )}

            {/* 动态滤波列表面板与删除操作 */}
            {sensor.filters.length === 0 ? (
              <div className='text-center py-3 text-zinc-600 border border-dashed border-zinc-800 rounded-lg text-xs'>
                暂无现场滤波标定
              </div>
            ) : (
              <div className='space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar'>
                {sensor.filters.map((filter) => (
                  <div
                    key={filter.id}
                    className='group bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800 text-[11px] relative hover:border-zinc-700 transition-colors'
                  >
                    <div className='text-zinc-200 font-semibold mb-1.5 flex justify-between items-center'>
                      <span className='text-zinc-200 font-semibold'>
                        📍 {filter.name}
                      </span>
                      {/* 🔥 删除按钮：悬浮或常驻可见 */}
                      <Tooltip title='移除此滤波配置'>
                        <Button
                          type='text'
                          size='small'
                          danger
                          icon={<DeleteOutlined className='text-xs' />}
                          className='opacity-60 group-hover:opacity-100 transition-opacity h-5 w-5 flex items-center justify-center p-0 hover:bg-zinc-800 rounded'
                          onClick={() => onDeleteStrategy(sensor.id, filter.id)}
                        />
                      </Tooltip>
                    </div>
                    <div className='grid grid-cols-2 gap-x-3 gap-y-1 text-zinc-500 font-mono'>
                      <div>
                        高度限制:{' '}
                        <span className='text-emerald-400'>
                          {filter.height}m
                        </span>
                      </div>
                      <div>
                        过滤角度:{' '}
                        <span className='text-emerald-400'>
                          {filter.angle}°
                        </span>
                      </div>
                      <div>
                        纵向距离:{' '}
                        <span className='text-emerald-400'>
                          {filter.verticalDist}m
                        </span>
                      </div>
                      <div>
                        横向距离:{' '}
                        <span className='text-emerald-400'>
                          {filter.horizontalDist}m
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  );
};
