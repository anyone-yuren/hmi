import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { create } from 'zustand';
import {
  PARAMETER_GROUPS,
  ParameterGroup,
  VehicleModel,
  VehicleType,
} from '../types';

interface VehicleModelState {
  // List View State
  models: VehicleModel[];

  // Detail View State
  isEditing: boolean;
  currentModel: VehicleModel | null;
  selectedVehicleType: VehicleType | null;
  activeGroups: Record<ParameterGroup, boolean>;
  trayModels: string[]; // Selected tray models

  // React Flow State
  nodes: Node[];
  edges: Edge[];

  // Actions
  setModels: (models: VehicleModel[]) => void;
  addModel: (model: VehicleModel) => void;
  updateModel: (id: string, data: Partial<VehicleModel>) => void;
  deleteModel: (id: string) => void;

  startEditing: (model?: VehicleModel) => void;
  cancelEditing: () => void;

  setVehicleType: (type: VehicleType) => void;
  toggleGroup: (group: ParameterGroup, active: boolean) => void;
  setTrayModels: (models: string[]) => void;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  resetFlow: () => void;
}

const INITIAL_NODES: Node[] = [];
const INITIAL_EDGES: Edge[] = [];

// Mock Data
const MOCK_MODELS: VehicleModel[] = [
  {
    id: '1',
    name: '标准X20',
    code: 'VM-X20-001',
    type: 'x20',
    template: '通用约束模板',
    stationTypeCount: 5,
    status: 'enabled',
    updateTime: '2023-10-27 10:00:00',
    trayModels: ['T1'],
    parameterValues: {
      basic_id: { enabled: true, id: 2838124, name: 'X20' },
    },
  },
  {
    id: '2',
    name: '重载SE15',
    code: 'VM-SE15-002',
    type: 'SE15',
    template: '重载模板',
    stationTypeCount: 3,
    status: 'disabled',
    updateTime: '2023-10-26 15:30:00',
    trayModels: [],
  },
];

// Helper to recalculate layout
const recalculateLayout = (
  nodes: Node[],
  activeGroups: Record<ParameterGroup, boolean>,
  trayModels: string[],
  parameterValues: Record<string, any> = {},
): { nodes: Node[]; edges: Edge[] } => {
  // 1. Identify Root Node
  let rootNode = nodes.find((n) => n.id === 'vehicle-root');

  // If root doesn't exist (shouldn't happen in edit mode), return empty or current
  if (!rootNode) return { nodes, edges: [] };

  // Ensure root is draggable, others are not (as per requirement)
  // However, we need to regenerate the list of nodes based on activeGroups and trayModels
  // because toggling adds/removes nodes.

  // Re-create node list starting with Root
  const newNodes: Node[] = [
    {
      ...rootNode,
      draggable: true, // Root is draggable
      position: rootNode.position || { x: 0, y: 0 },
    },
  ];

  const newEdges: Edge[] = [];

  // 2. Collect all child items (Parameters + Trays)
  const activeParams = Object.keys(activeGroups)
    .filter((k) => activeGroups[k as ParameterGroup])
    .sort((a, b) => {
      // Sort by defined order
      const idxA = PARAMETER_GROUPS.findIndex((g) => g.key === a);
      const idxB = PARAMETER_GROUPS.findIndex((g) => g.key === b);
      return idxA - idxB;
    });

  const allChildren = [
    ...activeParams.map((p) => ({ type: 'param', id: p })),
    ...trayModels.map((t) => ({ type: 'tray', id: t })),
  ];

  // 3. Layout Configuration
  const COLUMN_OFFSET_X = 400; // Horizontal distance from center
  const START_Y = -150; // Starting Y relative to root (roughly)
  const GAP_Y = 300; // Vertical gap between nodes in the same column

  // We want to alternate Left / Right
  // Left Column: Index 0, 2, 4... -> x = -COLUMN_OFFSET_X
  // Right Column: Index 1, 3, 5... -> x = COLUMN_OFFSET_X
  // Y positions increment every 2 items (or track separately)

  let leftY = START_Y;
  let rightY = START_Y;

  allChildren.forEach((child, index) => {
    const isLeft = index % 2 === 0;

    // Determine Position relative to Root
    // Note: If Root moves, children should move with it?
    // Usually in React Flow, positions are absolute unless using Parent/Child feature.
    // Since we are "recalculating layout" often, we might just set absolute positions
    // relative to the Root's current position.

    const rootX = rootNode!.position.x;
    const rootY = rootNode!.position.y;

    let posX, posY;

    if (isLeft) {
      posX = rootX - COLUMN_OFFSET_X;
      posY = rootY + leftY;
      leftY += GAP_Y;
    } else {
      posX = rootX + COLUMN_OFFSET_X;
      posY = rootY + rightY;
      rightY += GAP_Y;
    }

    // Create Node
    const nodeId =
      child.type === 'param' ? `param-${child.id}` : `tray-${child.id}`;

    const values =
      child.type === 'param' ? parameterValues[child.id] : undefined;

    const nodeData =
      child.type === 'param'
        ? { group: child.id, values }
        : { group: `tray_${child.id}` }; // Use tray_ prefix for logic in ParameterNode

    newNodes.push({
      id: nodeId,
      type: 'parameterNode', // Reuse parameter node
      position: { x: posX, y: posY },
      data: nodeData,
      draggable: false, // Child nodes not draggable
    });

    // Create Edge
    newEdges.push({
      id: `edge-${nodeId}`,
      source: 'vehicle-root',
      target: nodeId,
      sourceHandle: isLeft ? 'left' : 'right',
      targetHandle: isLeft ? 'right' : 'left',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#00d1d1' },
    });
  });

  return { nodes: newNodes, edges: newEdges };
};

export const useVehicleModelStore = create<VehicleModelState>((set, get) => ({
  models: MOCK_MODELS,

  isEditing: false,
  currentModel: null,
  selectedVehicleType: null,
  activeGroups: {
    basic_id: false,
    physical: false,
    kinematics: false,
    behavior: false,
    safety: false,
    planning: false,
  },
  trayModels: [],

  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,

  setModels: (models) => set({ models }),
  addModel: (model) => set((state) => ({ models: [...state.models, model] })),
  updateModel: (id, data) =>
    set((state) => ({
      models: state.models.map((m) => (m.id === id ? { ...m, ...data } : m)),
    })),
  deleteModel: (id) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== id),
    })),

  startEditing: (model) => {
    if (model) {
      // Editing existing model
      const activeGroups = {
        basic_id: false,
        physical: false,
        kinematics: false,
        behavior: false,
        safety: false,
        planning: false,
      };

      // Simulate loading saved configuration (in real app, this would be parsed from model data)
      // For now, let's just enable some defaults if it's an edit
      activeGroups.basic_id = true;

      const trayModels = model.trayModels || [];

      const initialNodes = [
        {
          id: 'vehicle-root',
          type: 'vehicleNode',
          position: { x: 0, y: 0 },
          data: { type: model.type },
          draggable: true,
        },
      ];

      const { nodes, edges } = recalculateLayout(
        initialNodes,
        activeGroups,
        trayModels,
        model.parameterValues || {},
      );

      set({
        isEditing: true,
        currentModel: model,
        selectedVehicleType: model.type as VehicleType,
        nodes,
        edges,
        activeGroups,
        trayModels,
      });
    } else {
      // Creating new model
      set({
        isEditing: true,
        currentModel: null,
        selectedVehicleType: null,
        nodes: [],
        edges: [],
        activeGroups: {
          basic_id: false,
          physical: false,
          kinematics: false,
          behavior: false,
          safety: false,
          planning: false,
        },
        trayModels: [],
      });
    }
  },

  cancelEditing: () => {
    set({ isEditing: false, currentModel: null, selectedVehicleType: null });
  },

  setVehicleType: (type) => {
    set((state) => {
      // When type changes, we reset or update the root node
      const rootNode = {
        id: 'vehicle-root',
        type: 'vehicleNode',
        position: { x: 0, y: 0 },
        data: { type },
        draggable: true,
      };

      // Keep existing children if possible, or reset?
      // Usually changing vehicle type might reset params, but let's keep them for better UX
      const { nodes, edges } = recalculateLayout(
        [rootNode],
        state.activeGroups,
        state.trayModels,
        get().currentModel?.parameterValues || {},
      );

      return {
        selectedVehicleType: type,
        nodes,
        edges,
      };
    });
  },

  toggleGroup: (group, active) => {
    set((state) => {
      const newActiveGroups = { ...state.activeGroups, [group]: active };
      const { nodes, edges } = recalculateLayout(
        state.nodes,
        newActiveGroups,
        state.trayModels,
      );
      return {
        activeGroups: newActiveGroups,
        nodes,
        edges,
      };
    });
  },

  setTrayModels: (models) => {
    set((state) => {
      const { nodes, edges } = recalculateLayout(
        state.nodes,
        state.activeGroups,
        models,
      );
      return {
        trayModels: models,
        nodes,
        edges,
      };
    });
  },

  onNodesChange: (changes) => {
    set((state) => {
      const newNodes = applyNodeChanges(changes, state.nodes);

      // If root moved, we might want to update children positions?
      // But if children are not draggable, they stay where they are relative to world?
      // Or should they follow the root?
      // If we want them to follow, we need to detect Root movement and delta-apply to children.

      // Check if root moved
      const rootChange = changes.find(
        (c) => c.type === 'position' && (c as any).id === 'vehicle-root',
      );
      if (rootChange && rootChange.type === 'position' && rootChange.position) {
        // This is complex with 'applyNodeChanges' because it handles the merge.
        // Simpler approach: Just let them be detached for now, OR re-run layout on dragEnd.
        // But re-running layout on every frame is expensive.
        // Given "Nodes can be dragged" (Root) and "Scene auto-fits", maybe independent movement is fine?
        // But usually "Child nodes" implies they should move with parent.
        // If I set them as `parentNode: 'vehicle-root'`, React Flow handles this!
        // BUT, I want them visually crisscrossed with edges.
        // Let's stick to simple implementation:
        // If Root moves, we don't auto-move children in real-time unless we implement that logic.
        // However, the user said "Scene auto-fits".
        // If I want children to move with parent, I should use `extent: 'parent'` or just grouping.
        // But the visual layout (edges connecting) suggests they are separate nodes in the graph.
        // For now, let's just apply changes. If the user drags the root, edges will stretch.
        // This is standard React Flow behavior.
        // If they want them to move together, that's "Group" behavior.
        // "子节点...不支持拖拽" implies they are fixed in position relative to *something* or just locked.
        // If I lock them, they won't move. If I drag root, edges stretch. That seems acceptable for "Config Canvas".
      }

      return {
        nodes: newNodes,
      };
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  resetFlow: () => {
    set({ nodes: [], edges: [] });
  },
}));
