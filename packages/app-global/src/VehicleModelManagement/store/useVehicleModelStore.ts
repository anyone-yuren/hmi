import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { create } from 'zustand';
import { ParameterGroup, VehicleModel, VehicleType } from '../types';

interface VehicleModelState {
  // List View State
  models: VehicleModel[];

  // Detail View State
  isEditing: boolean;
  currentModel: VehicleModel | null;
  selectedVehicleType: VehicleType | null;
  activeGroups: Record<ParameterGroup, boolean>;

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
  },
];

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
      set({
        isEditing: true,
        currentModel: model,
        selectedVehicleType: model.type as VehicleType,
        // Reset flow for now, in real app would load saved flow
        nodes: [
          {
            id: 'vehicle-root',
            type: 'vehicleNode',
            position: { x: 250, y: 250 },
            data: { type: model.type },
          },
        ],
        edges: [],
        activeGroups: {
          basic_id: false,
          physical: false,
          kinematics: false,
          behavior: false,
          safety: false,
          planning: false,
        },
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
      });
    }
  },

  cancelEditing: () =>
    set({ isEditing: false, currentModel: null, selectedVehicleType: null }),

  setVehicleType: (type) => {
    set({
      selectedVehicleType: type,
      nodes: [
        {
          id: 'vehicle-root',
          type: 'vehicleNode',
          position: { x: 400, y: 300 },
          data: { type },
        },
      ],
      edges: [],
      activeGroups: {
        basic_id: false,
        physical: false,
        kinematics: false,
        behavior: false,
        safety: false,
        planning: false,
      },
    });
  },

  toggleGroup: (group, active) => {
    const { nodes, edges, activeGroups } = get();

    if (active) {
      // Add node
      const newNode: Node = {
        id: `param-${group}`,
        type: 'parameterNode',
        // Simple circular layout calculation
        position: {
          x:
            400 +
            300 *
              Math.cos(
                Object.keys(activeGroups).indexOf(group) * (Math.PI / 3),
              ),
          y:
            300 +
            300 *
              Math.sin(
                Object.keys(activeGroups).indexOf(group) * (Math.PI / 3),
              ),
        },
        data: { group },
      };

      const newEdge: Edge = {
        id: `edge-${group}`,
        source: 'vehicle-root',
        target: `param-${group}`,
        type: 'smoothstep',
        animated: true,
      };

      set({
        activeGroups: { ...activeGroups, [group]: true },
        nodes: [...nodes, newNode],
        edges: [...edges, newEdge],
      });
    } else {
      // Remove node
      set({
        activeGroups: { ...activeGroups, [group]: false },
        nodes: nodes.filter((n) => n.id !== `param-${group}`),
        edges: edges.filter((e) => e.target !== `param-${group}`),
      });
    }
  },

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  resetFlow: () =>
    set({
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
    }),
}));
