import type { Edge, Node, NodeChange } from '@xyflow/react';
import { applyNodeChanges } from '@xyflow/react';
import { create } from 'zustand';

const ROOT_ID = 'vision-root';
const SELECT_ID = 'scene-select';
const PICKUP_MOVE_ID = 'pickup-move';

type SceneType = 'single' | 'pallet';

const SCENE_PARAM_CONFIG: Record<SceneType, { key: string; label: string }[]> = {
  single: [
    { key: 'cameraId', label: '相机 ID' },
    { key: 'grabHeight', label: '抓取高度' },
  ],
  pallet: [
    { key: 'cameraId', label: '相机 ID' },
    { key: 'palletSize', label: '托盘尺寸' },
    { key: 'offset', label: '偏移量' },
  ],
};

interface VisionFlowState {
  enabled: boolean;
  scenes: SceneType[];
  fitViewOnChange: number; // 新增：用于触发 fitView 的计数器

  nodes: Node[];
  edges: Edge[];

  init: () => void;
  setEnabled: (v: boolean) => void;
  setScenes: (s: SceneType[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  triggerFitView: () => void; // 新增：手动触发 fitView
  showPickupMove: boolean;
  setShowPickupMove: (v: boolean) => void;

  // 打开面板
  openVisionPanel: boolean;
  setOpenVisionPanel: (v: boolean) => void;
}

export const useVisionFlowStore = create<VisionFlowState>((set, get) => ({
  enabled: false,
  showPickupMove: false,
  scenes: [],
  fitViewOnChange: 0, // 初始化为 0

  nodes: [],
  edges: [],

  init: () => {
    set({
      nodes: [
        {
          id: ROOT_ID,
          type: 'visionConfig',
          position: { x: 0, y: 200 },
          draggable: false,
          data: {},
        },
      ],
      edges: [],
      fitViewOnChange: get().fitViewOnChange + 1, // 初始化时触发 fitView
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  // 手动触发 fitView
  triggerFitView: () => {
    set({
      fitViewOnChange: get().fitViewOnChange + 1,
    });
  },

  setEnabled: (enabled) => {
    set({ enabled });

    if (!enabled) {
      set({
        scenes: [],
        nodes: get().nodes.filter((n) => n.id !== SELECT_ID && !n.id.includes('param-')),
        edges: get().edges.filter((e) => e.source !== SELECT_ID && e.target !== SELECT_ID),
        fitViewOnChange: get().fitViewOnChange + 1,
      });
      return;
    }

    set({
      nodes: [
        ...get().nodes!,
        {
          id: SELECT_ID,
          type: 'visionSceneSelect',
          position: { x: 360, y: 200 },
          draggable: true,
          data: {},
        },
      ],
      edges: [
        ...get().edges!,
        {
          id: `e-${ROOT_ID}-${SELECT_ID}`,
          source: ROOT_ID,
          target: SELECT_ID,
        },
      ],
      fitViewOnChange: get().fitViewOnChange + 1,
    });
  },

  setShowPickupMove: (show) => {
    set({ showPickupMove: show });
    if (!show) {
      set({
        scenes: [],
        nodes: get().nodes.filter((n) => n.id !== PICKUP_MOVE_ID),
        edges: get().edges.filter((e) => e.source !== PICKUP_MOVE_ID && e.target !== PICKUP_MOVE_ID),
        fitViewOnChange: get().fitViewOnChange + 1,
      });
      return;
    }
    set({
      nodes: [
        ...get().nodes!,
        {
          id: PICKUP_MOVE_ID,
          type: 'visionScenePickupMove',
          position: { x: 360, y: 600 },
          draggable: true,
          data: {},
        },
      ],
      edges: [
        ...get().edges!,
        {
          id: `e-${ROOT_ID}-${PICKUP_MOVE_ID}`,
          source: ROOT_ID,
          target: PICKUP_MOVE_ID,
        },
      ],
      fitViewOnChange: get().fitViewOnChange + 1,
    });
  },

  setScenes: (scenes) => {
    const baseX = 520;
    const gapX = 260;

    const paramNodes: Node[] = [];
    const edges: Edge[] = [
      {
        id: `e-${ROOT_ID}-${SELECT_ID}`,
        source: ROOT_ID,
        target: SELECT_ID,
      },
      {
        id: `e-${ROOT_ID}-${PICKUP_MOVE_ID}`,
        source: ROOT_ID,
        target: PICKUP_MOVE_ID,
      },
    ];

    let cursorX = baseX;

    scenes.forEach((scene) => {
      const paramId = `param-${scene}`;
      cursorX += gapX;

      paramNodes.push({
        id: paramId,
        type: 'visionParamGroup',
        position: { x: cursorX, y: 200 },
        draggable: true,
        data: {
          scene,
          fields: SCENE_PARAM_CONFIG[scene],
        },
      });

      edges.push({
        id: `e-${SELECT_ID}-${paramId}`,
        source: SELECT_ID,
        target: paramId,
      });
      edges.push({
        id: `e-${PICKUP_MOVE_ID}-${paramId}`,
        source: PICKUP_MOVE_ID,
        target: paramId,
      });

      cursorX += gapX;
    });

    // 获取现有的根节点和选择节点
    const existingNodes = get().nodes;
    const rootNode = existingNodes.find((n) => n.id === ROOT_ID);
    const selectNode = existingNodes.find((n) => n.id === SELECT_ID);
    const pickupMoveNode = existingNodes.find((n) => n.id === PICKUP_MOVE_ID);
    set({
      scenes,
      nodes: [
        rootNode!,
        selectNode || {
          id: SELECT_ID,
          type: 'visionSceneSelect',
          position: { x: 260, y: 200 },
          draggable: true,
          data: {},
        },
        pickupMoveNode || {
          id: PICKUP_MOVE_ID,
          type: 'visionScenePickupMove',
          position: { x: 260, y: 600 },
          draggable: true,
          data: {},
        },
        ...paramNodes,
      ],
      edges,
      fitViewOnChange: get().fitViewOnChange + 1,
    });
  },
  // 打开面板
  openVisionPanel: false,
  setOpenVisionPanel: (v) => set({ openVisionPanel: v }),
}));
