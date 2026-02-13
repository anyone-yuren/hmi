import { ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Select, Tag } from 'antd';
import { useState } from 'react';
import { useTaskRuleStore } from '../store/useTaskRuleStore';

export const Dashboard = () => {
  const { scenes, eventFlows, relations } = useTaskRuleStore();
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  // Filters (Mock)
  const [taskType, setTaskType] = useState('ALL');

  const filteredScenes = scenes.filter(
    (s) => taskType === 'ALL' || s.taskType === taskType
  );

  // Highlight logic
  const getRelatedFlowIds = (sceneId: string) =>
    relations.filter((r) => r.sceneId === sceneId).map((r) => r.eventFlowId);
  const getRelatedSceneIds = (flowId: string) =>
    relations.filter((r) => r.eventFlowId === flowId).map((r) => r.sceneId);

  const isFlowHighlighted = (flowId: string) => {
    if (selectedSceneId) {
      return getRelatedFlowIds(selectedSceneId).includes(flowId);
    }
    return false;
  };

  const isSceneHighlighted = (sceneId: string) => {
    if (selectedFlowId) {
      return getRelatedSceneIds(selectedFlowId).includes(sceneId);
    }
    return false;
  };

  return (
    <div className='h-full flex flex-col gap-4'>
      {/* Top Filter Bar */}
      <div className='flex gap-4 p-2 bg-white/5 rounded'>
        <Select
          value={taskType}
          onChange={setTaskType}
          style={{ width: 120 }}
          options={[
            { value: 'ALL', label: '所有任务' },
            { value: 'PICKUP', label: '取货任务' },
            { value: 'DELIVER', label: '放货任务' },
            { value: 'CHARGE', label: '充电任务' },
          ]}
        />
        <Select placeholder='车型筛选' style={{ width: 120 }} allowClear />
        <Select placeholder='车辆筛选' style={{ width: 120 }} allowClear />
      </div>

      {/* Main 3-Column View */}
      <div className='flex-1 flex gap-4 overflow-hidden'>
        {/* Left: Scenes */}
        <div className='flex-1 flex flex-col min-w-[300px] border border-white/10 rounded bg-white/5'>
          <div className='p-3 border-b border-white/10 font-bold bg-white/5 text-white'>
            场景列表 ({filteredScenes.length})
          </div>
          <div className='flex-1 overflow-y-auto p-2 space-y-2'>
            {filteredScenes.map((scene) => (
              <div
                key={scene.id}
                onClick={() => {
                  setSelectedSceneId(scene.id);
                  setSelectedFlowId(null);
                }}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedSceneId === scene.id
                    ? 'border-blue-500 bg-blue-500/20 shadow-md'
                    : isSceneHighlighted(scene.id)
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-white/10 hover:bg-white/10'
                }`}
              >
                <div className='flex justify-between items-start'>
                  <span className='font-medium text-white'>{scene.name}</span>
                  <Tag>{scene.taskType}</Tag>
                </div>
                <div className='text-xs text-white/60 mt-2'>
                  <div>
                    车型:{' '}
                    {scene.conditions.vehicleModels.mode === 'ALL'
                      ? '全部'
                      : scene.conditions.vehicleModels.values.join(', ')}
                  </div>
                  <div>
                    库位:{' '}
                    {scene.conditions.locations.mode === 'ALL' ? '全部' : '...'}
                  </div>
                  <div>关联流程: {getRelatedFlowIds(scene.id).length} 个</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Arrows / Visual Connection */}
        <div className='w-16 flex flex-col items-center justify-center text-white/40'>
          <ArrowRightOutlined style={{ fontSize: 24 }} />
          <div className='text-xs mt-1'>关联 (N:M)</div>
        </div>

        {/* Right: Event Flows */}
        <div className='flex-1 flex flex-col min-w-[300px] border border-white/10 rounded bg-white/5'>
          <div className='p-3 border-b border-white/10 font-bold bg-white/5 text-white'>
            事件流列表 ({eventFlows.length})
          </div>
          <div className='flex-1 overflow-y-auto p-2 space-y-2'>
            {eventFlows.map((flow) => (
              <div
                key={flow.id}
                onClick={() => {
                  setSelectedFlowId(flow.id);
                  setSelectedSceneId(null);
                }}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedFlowId === flow.id
                    ? 'border-blue-500 bg-blue-500/20 shadow-md'
                    : isFlowHighlighted(flow.id)
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-white/10 hover:bg-white/10'
                }`}
              >
                <div className='flex justify-between items-start'>
                  <span className='font-medium text-white'>{flow.name}</span>
                  <div className='flex gap-1'>
                    {flow.isDefault && <Tag color='gold'>默认</Tag>}
                    <Badge
                      status={flow.status === 'NORMAL' ? 'success' : 'error'}
                    />
                  </div>
                </div>
                <div className='text-xs text-white/60 mt-2'>
                  关联场景: {getRelatedSceneIds(flow.id).length} 个
                </div>
                <div className='flex gap-1 mt-2 overflow-x-auto'>
                  {flow.nodes &&
                    flow.nodes.map((node, idx) => (
                      <div
                        key={node.id}
                        className='flex items-center text-xs bg-white/10 text-white/80 px-1 rounded'
                      >
                        {(node.data?.label as React.ReactNode) || node.id}
                        {idx < flow.nodes.length - 1 && (
                          <span className='mx-1 text-white/40'>→</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
