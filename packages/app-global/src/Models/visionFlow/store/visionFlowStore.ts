import type { Edge, Node, NodeChange } from '@xyflow/react';
import { applyNodeChanges } from '@xyflow/react';
import { create } from 'zustand';

const ROOT_ID = 'vision-root';
const SELECT_ID = 'scene-select';

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
}

export const useVisionFlowStore = create<VisionFlowState>((set, get) => ({
  enabled: false,
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
        nodes: get().nodes.filter((n) => n.id === ROOT_ID),
        edges: [],
        fitViewOnChange: get().fitViewOnChange + 1,
      });
      return;
    }

    set({
      nodes: [
        get().nodes.find((n) => n.id === ROOT_ID)!,
        {
          id: SELECT_ID,
          type: 'visionSceneSelect',
          position: { x: 360, y: 200 },
          draggable: true,
          data: {},
        },
      ],
      edges: [
        {
          id: `e-${ROOT_ID}-${SELECT_ID}`,
          source: ROOT_ID,
          target: SELECT_ID,
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

      cursorX += gapX;
    });

    // 获取现有的根节点和选择节点
    const existingNodes = get().nodes;
    const rootNode = existingNodes.find((n) => n.id === ROOT_ID);
    const selectNode = existingNodes.find((n) => n.id === SELECT_ID);

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
        ...paramNodes,
      ],
      edges,
      fitViewOnChange: get().fitViewOnChange + 1,
    });
  },
}));
