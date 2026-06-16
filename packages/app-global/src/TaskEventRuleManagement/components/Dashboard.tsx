import { ArrowRightOutlined } from '@ant-design/icons';
import {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Select, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useTaskRuleStore } from '../store/useTaskRuleStore';
import { TaskType, VehicleModel } from '../types';

export const Dashboard = () => {
  const { scenes, eventFlows, relations } = useTaskRuleStore();

  // Filters
  const [taskType, setTaskType] = useState<TaskType | 'ALL'>('ALL');
  const [locationFilter, setLocationFilter] = useState<string | undefined>(
    undefined
  );
  const [vehicleModel, setVehicleModel] = useState<VehicleModel | undefined>(
    undefined
  );
  const [vehicleId, setVehicleId] = useState<string | undefined>(undefined);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    // 1. Filter Scenes
    const filteredScenes = scenes.filter((s) => {
      if (taskType !== 'ALL' && s.taskType !== taskType) return false;
      if (locationFilter) {
        // Mock location check
        const { mode, values } = s.conditions.locations;
        if (mode === 'POINTS' || mode === 'REGION') {
          if (!values.includes(locationFilter)) return false;
        }
      }
      if (vehicleModel) {
        const { mode, values } = s.conditions.vehicleModels;
        if (mode === 'INCLUDE' && !values.includes(vehicleModel)) return false;
        if (mode === 'EXCLUDE' && values.includes(vehicleModel)) return false;
      }
      return true;
    });

    // 2. Filter Flows (Group by TaskType)
    const filteredFlows = eventFlows.filter((f) => {
      if (taskType !== 'ALL' && f.taskType !== taskType) return false;
      return true;
    });

    // 3. Build Nodes
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Scene Nodes (Left)
    filteredScenes.forEach((scene, index) => {
      const linkedFlowCount = relations.filter(
        (r) => r.sceneId === scene.id
      ).length;

      // Location Text
      const locMode = scene.conditions.locations.mode;
      const locValues = scene.conditions.locations.values.join(', ');
      const locText =
        locMode === 'ALL'
          ? '所有位置'
          : locMode === 'REGION'
          ? `区域: ${locValues}`
          : `点位: ${locValues}`;

      // Vehicle Model Text
      const vmMode = scene.conditions.vehicleModels.mode;
      const vmValues = scene.conditions.vehicleModels.values.join(', ');
      const vmText =
        vmMode === 'ALL'
          ? '所有车型'
          : `${vmMode === 'INCLUDE' ? '包含' : '排除'}: ${vmValues}`;

      newNodes.push({
        id: `scene-${scene.id}`,
        type: 'default',
        position: { x: 50, y: index * 200 + 50 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          label: (
            <div className='p-3'>
              <div className='font-bold text-lg mb-2 whitespace-nowrap'>
                {scene.name}
              </div>
              <div className='flex gap-2 mb-3'>
                <Tag color='blue'>{scene.taskType}</Tag>
                <Tag color='purple'>关联事件: {linkedFlowCount}</Tag>
              </div>
              <div className='text-xs text-gray-400 space-y-1 bg-black/20 p-2 rounded'>
                <div className='whitespace-nowrap'>
                  <span className='text-gray-500'>位置: </span>
                  <span className='text-white/80'>{locText}</span>
                </div>
                <div className='whitespace-nowrap'>
                  <span className='text-gray-500'>车型: </span>
                  <span className='text-white/80'>{vmText}</span>
                </div>
              </div>
            </div>
          ),
        },
        style: {
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '1px solid #334155',
          borderRadius: '8px',
          width: 'auto',
          minWidth: 'fit-content',
        },
      });
    });

    // Event Flow Nodes (Right) - Grouped by TaskType visually
    let flowY = 50;
    const taskGroups = ['PICKUP', 'DELIVER', 'CHARGE', 'RETURN_TO_STANDBY'];

    taskGroups.forEach((type) => {
      const flowsOfType = filteredFlows.filter((f) => f.taskType === type);
      if (flowsOfType.length > 0) {
        flowsOfType.forEach((flow) => {
          // Sort nodes logic: simple traversal from start
          const orderedNodes: any[] = [];
          const flowNodes = flow.nodes || [];
          const flowEdges = flow.edges || [];

          let currentNode = flowNodes.find((n) => n.data?.isStart);
          const visited = new Set<string>();

          while (currentNode) {
            orderedNodes.push(currentNode);
            visited.add(currentNode.id);
            // Find next
            const edge = flowEdges.find((e) => e.source === currentNode?.id);
            if (edge) {
              currentNode = flowNodes.find((n) => n.id === edge.target);
              if (currentNode && visited.has(currentNode.id)) break; // Loop detected
            } else {
              break;
            }
          }

          // If simple traversal missed nodes (e.g. disconnected or branching), just add remaining
          // For this view, we prioritize the main path. If no start node, just list all.
          if (orderedNodes.length === 0 && flowNodes.length > 0) {
            orderedNodes.push(...flowNodes);
          }

          newNodes.push({
            id: `flow-${flow.id}`,
            type: 'default',
            position: { x: 600, y: flowY },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            data: {
              label: (
                <div className='p-3'>
                  <div className='flex justify-between items-center mb-2 gap-4'>
                    <span className='font-bold text-lg whitespace-nowrap'>
                      {flow.name}
                    </span>
                    <Tag color='cyan'>{flow.taskType}</Tag>
                  </div>
                  <div className='flex flex-wrap items-center gap-2 bg-black/20 p-2 rounded'>
                    {orderedNodes.map((node, i) => (
                      <div key={node.id} className='flex items-center'>
                        <span className='bg-white/10 px-2 py-1 rounded text-xs border border-white/20 text-gray-300 whitespace-nowrap'>
                          {node.data.label}
                        </span>
                        {i < orderedNodes.length - 1 && (
                          <ArrowRightOutlined className='mx-1 text-gray-500 text-[10px]' />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            style: {
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid #475569',
              borderRadius: '8px',
              width: 'auto',
              minWidth: 'fit-content',
            },
          });
          flowY += 150; // Dynamic height might require more logic, but fixed gap is okay for now
        });
        flowY += 50; // Gap between groups
      }
    });

    // 4. Build Edges
    relations.forEach((rel) => {
      const sceneNode = newNodes.find((n) => n.id === `scene-${rel.sceneId}`);
      const flowNode = newNodes.find((n) => n.id === `flow-${rel.eventFlowId}`);

      if (sceneNode && flowNode) {
        newEdges.push({
          id: `e-${rel.sceneId}-${rel.eventFlowId}`,
          source: `scene-${rel.sceneId}`,
          target: `flow-${rel.eventFlowId}`,
          animated: false,
          style: { stroke: '#3b82f6', strokeWidth: 1, opacity: 0.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
          },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [
    scenes,
    eventFlows,
    relations,
    taskType,
    locationFilter,
    vehicleModel,
    vehicleId,
    setNodes,
    setEdges,
  ]);

  // Handle Node Selection to Highlight Edges
  const onNodeClick = (_: any, node: Node) => {
    setEdges((eds) =>
      eds.map((edge) => {
        const isConnected = edge.source === node.id || edge.target === node.id;
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isConnected ? '#10b981' : '#3b82f6',
            strokeWidth: isConnected ? 3 : 1,
            opacity: isConnected ? 1 : 0.3,
          },
          animated: isConnected,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isConnected ? '#10b981' : '#3b82f6',
          },
        };
      })
    );
  };

  return (
    <div className='h-full flex flex-col gap-4'>
      {/* Top Filter Bar */}
      <div className='flex gap-4 p-2 bg-white/5 rounded'>
        <Select
          value={taskType}
          onChange={setTaskType}
          style={{ width: 150 }}
          options={[
            { value: 'ALL', label: '所有任务类型' },
            { value: 'PICKUP', label: '取货任务' },
            { value: 'DELIVER', label: '放货任务' },
            { value: 'CHARGE', label: '充电任务' },
          ]}
        />
        <Select
          placeholder='车型筛选'
          style={{ width: 120 }}
          allowClear
          value={vehicleModel}
          onChange={setVehicleModel}
          options={[
            { value: 'X20', label: 'X20' },
            { value: 'X20S', label: 'X20S' },
            { value: 'K16', label: 'K16' },
          ]}
        />
        <Select
          placeholder='车辆筛选'
          style={{ width: 120 }}
          allowClear
          value={vehicleId}
          onChange={setVehicleId}
          options={[
            // Mock data
            { value: 'V001', label: 'V001' },
            { value: 'V002', label: 'V002' },
          ]}
        />
        <Select
          placeholder='筛选点位/区域'
          style={{ width: 200 }}
          allowClear
          onChange={setLocationFilter}
          options={[
            { value: '101', label: '点位 101' },
            { value: '102', label: '点位 102' },
            { value: 'A-Zone', label: '区域 A-Zone' },
          ]}
        />
      </div>

      {/* Main Flow View */}
      <div className='flex-1 border border-white/10 rounded bg-gray-900 overflow-hidden'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          colorMode='dark'
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
