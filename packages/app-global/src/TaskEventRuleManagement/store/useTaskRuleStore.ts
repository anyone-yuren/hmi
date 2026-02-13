import { create } from 'zustand';
import { EventFlow, RuleRelation, Scene } from '../types';

interface TaskRuleState {
  scenes: Scene[];
  eventFlows: EventFlow[];
  relations: RuleRelation[];

  // Actions
  addScene: (scene: Scene) => void;
  updateScene: (id: string, scene: Partial<Scene>) => void;
  deleteScene: (id: string) => void;

  addEventFlow: (flow: EventFlow) => void;
  updateEventFlow: (id: string, flow: Partial<EventFlow>) => void;
  deleteEventFlow: (id: string) => void;

  updateSceneFlowRelations: (sceneId: string, flowIds: string[]) => void;
  unlinkScene: (sceneId: string) => void;
  exportScenes: () => void;
  exportEventFlows: () => void;
}

export const useTaskRuleStore = create<TaskRuleState>((set) => ({
  scenes: [
    {
      id: '1',
      name: '示例场景-标准取货',
      taskType: 'PICKUP',
      conditions: {
        vehicleModels: { mode: 'INCLUDE', values: ['X20', 'SE15'] },
        vehicles: { mode: 'ALL', values: [] },
        locations: { mode: 'ALL', values: [] },
        heightRanges: [{ min: 0, max: 2 }],
        palletTypes: { mode: 'ALL', values: [] },
      },
    },
    {
      id: '2',
      name: '示例场景-高位放货',
      taskType: 'DELIVER',
      conditions: {
        vehicleModels: { mode: 'INCLUDE', values: ['R16'] },
        vehicles: { mode: 'ALL', values: [] },
        locations: { mode: 'POINTS', values: ['101', '102'] },
        heightRanges: [{ min: 2, max: 5 }],
        palletTypes: { mode: 'ALL', values: [] },
      },
    },
    {
      id: '3',
      name: '示例场景-充电任务',
      taskType: 'CHARGE',
      conditions: {
        vehicleModels: { mode: 'ALL', values: [] },
        vehicles: { mode: 'ALL', values: [] },
        locations: { mode: 'REGION', values: [] },
        heightRanges: [],
        palletTypes: { mode: 'ALL', values: [] },
      },
    },
    {
      id: '4',
      name: '示例场景-窄巷道取货',
      taskType: 'PICKUP',
      conditions: {
        vehicleModels: { mode: 'INCLUDE', values: ['X20S'] },
        vehicles: { mode: 'ALL', values: [] },
        locations: { mode: 'REGION', values: ['A01', 'A02'] },
        heightRanges: [{ min: 0, max: 8 }],
        palletTypes: { mode: 'INCLUDE', values: ['Wooden'] },
      },
    },
  ],
  eventFlows: [
    {
      id: '1',
      name: '标准取货流程',
      taskType: 'PICKUP',
      isDefault: true,
      status: 'NORMAL',
      nodes: [
        {
          id: 'start',
          type: 'custom',
          position: { x: 50, y: 50 },
          data: { label: '开始', isStart: true },
        },
        {
          id: 'node-1',
          type: 'custom',
          position: { x: 50, y: 150 },
          data: {
            label: '入库点-视觉检测',
            params: {
              pointType: 'ENTRY_POINT',
              eventType: 'VISION',
              subType: 'SHELF_STATUS_CHECK',
            },
          },
        },
        {
          id: 'node-2',
          type: 'custom',
          position: { x: 50, y: 250 },
          data: {
            label: '库位点-执行升',
            params: {
              pointType: 'STORAGE_POINT',
              eventType: 'ACTUATOR',
              subType: 'LIFT_UP',
            },
          },
        },
        {
          id: 'end',
          type: 'custom',
          position: { x: 50, y: 350 },
          data: { label: '结束', isEnd: true },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'start', target: 'node-1' },
        { id: 'e2-3', source: 'node-1', target: 'node-2' },
        { id: 'e3-4', source: 'node-2', target: 'end' },
      ],
    },
    {
      id: '2',
      name: '高位放货流程',
      taskType: 'DELIVER',
      isDefault: false,
      status: 'NORMAL',
      nodes: [
        {
          id: 'start',
          type: 'custom',
          position: { x: 50, y: 50 },
          data: { label: '开始', isStart: true },
        },
        {
          id: 'node-1',
          type: 'custom',
          position: { x: 50, y: 150 },
          data: {
            label: '入库点-执行降',
            params: {
              pointType: 'ENTRY_POINT',
              eventType: 'ACTUATOR',
              subType: 'LIFT_DOWN',
            },
          },
        },
        {
          id: 'end',
          type: 'custom',
          position: { x: 50, y: 300 },
          data: { label: '结束', isEnd: true },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'start', target: 'node-1' },
        { id: 'e2-3', source: 'node-1', target: 'end' },
      ],
    },
    {
      id: '3',
      name: '标准充电流程',
      taskType: 'CHARGE',
      isDefault: true,
      status: 'NORMAL',
      nodes: [
        {
          id: 'start',
          type: 'custom',
          position: { x: 50, y: 50 },
          data: { label: '开始', isStart: true },
        },
        {
          id: 'end',
          type: 'custom',
          position: { x: 50, y: 200 },
          data: { label: '结束', isEnd: true },
        },
      ],
      edges: [{ id: 'e1-2', source: 'start', target: 'end' }],
    },
    {
      id: '4',
      name: '窄巷道取货流程',
      taskType: 'PICKUP',
      isDefault: false,
      status: 'NORMAL',
      nodes: [
        {
          id: 'start',
          type: 'custom',
          position: { x: 50, y: 50 },
          data: { label: '开始', isStart: true },
        },
        {
          id: 'node-1',
          type: 'custom',
          position: { x: 50, y: 150 },
          data: {
            label: '入库点-托盘识别',
            params: {
              pointType: 'ENTRY_POINT',
              eventType: 'VISION',
              subType: 'PALLET_POSTURE_RECOGNITION',
            },
          },
        },
        {
          id: 'node-2',
          type: 'custom',
          position: { x: 50, y: 250 },
          data: {
            label: '库位点-执行升',
            params: {
              pointType: 'STORAGE_POINT',
              eventType: 'ACTUATOR',
              subType: 'LIFT_UP',
            },
          },
        },
        {
          id: 'end',
          type: 'custom',
          position: { x: 50, y: 350 },
          data: { label: '结束', isEnd: true },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'start', target: 'node-1' },
        { id: 'e2-3', source: 'node-1', target: 'node-2' },
        { id: 'e3-4', source: 'node-2', target: 'end' },
      ],
    },
  ],
  relations: [
    { sceneId: '1', eventFlowId: '1' },
    { sceneId: '1', eventFlowId: '4' }, // Demo: Scene 1 has 2 flows
    { sceneId: '2', eventFlowId: '2' },
    { sceneId: '3', eventFlowId: '3' },
    { sceneId: '4', eventFlowId: '4' },
  ],

  addScene: (scene) => set((state) => ({ scenes: [...state.scenes, scene] })),
  updateScene: (id, patch) =>
    set((state) => ({
      scenes: state.scenes.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })),
  deleteScene: (id) =>
    set((state) => ({
      scenes: state.scenes.filter((s) => s.id !== id),
      relations: state.relations.filter((r) => r.sceneId !== id),
    })),

  addEventFlow: (flow) =>
    set((state) => ({ eventFlows: [...state.eventFlows, flow] })),
  updateEventFlow: (id, patch) =>
    set((state) => ({
      eventFlows: state.eventFlows.map((f) =>
        f.id === id ? { ...f, ...patch } : f
      ),
    })),
  deleteEventFlow: (id) =>
    set((state) => ({
      eventFlows: state.eventFlows.filter((f) => f.id !== id),
      relations: state.relations.filter((r) => r.eventFlowId !== id),
    })),

  updateSceneFlowRelations: (sceneId, flowIds) =>
    set((state) => {
      const filtered = state.relations.filter((r) => r.sceneId !== sceneId);
      const newRelations = flowIds.map((flowId) => ({
        sceneId,
        eventFlowId: flowId,
      }));
      return { relations: [...filtered, ...newRelations] };
    }),
  unlinkScene: (sceneId) =>
    set((state) => ({
      relations: state.relations.filter((r) => r.sceneId !== sceneId),
    })),

  exportScenes: () => {
    const state = useTaskRuleStore.getState();
    const data = JSON.stringify(state.scenes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenes.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  exportEventFlows: () => {
    const state = useTaskRuleStore.getState();
    const data = JSON.stringify(state.eventFlows, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event-flows.json';
    a.click();
    URL.revokeObjectURL(url);
  },
}));
