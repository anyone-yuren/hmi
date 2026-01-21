import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  EdgeChange,
  NodeChange,
} from '@xyflow/react';
import { create } from 'zustand';
import {
  NodeTemplate,
  WorkflowEdge,
  WorkflowNode,
  WorkflowVariable,
} from '../types';

export interface WorkflowMetadata {
  id: string;
  name: string;
  description?: string;
  status: 'available' | 'unavailable';
  updatedAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
}

interface HistoryState {
  past: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }[];
  future: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }[];
}

interface WorkflowState {
  // Editor State
  currentWorkflowId: string | null;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  variables: WorkflowVariable[];
  nodeLibrary: NodeTemplate[];

  // List State
  workflowList: WorkflowMetadata[];
  isDesignerOpen: boolean;

  // History
  history: HistoryState;
  jumpToHistory: (index: number) => void;

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: WorkflowNode) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNode['data']>) => void;

  // Workflow List Actions
  addWorkflow: (workflow: WorkflowMetadata) => void;
  deleteWorkflow: (id: string) => void;
  updateWorkflow: (id: string, data: Partial<WorkflowMetadata>) => void;
  openWorkflow: (id: string) => void;
  closeWorkflow: () => void;
  saveCurrentWorkflow: () => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;

  // Validation
  validateWorkflow: () => boolean;

  // Node Library
  addNodeTemplate: (template: NodeTemplate) => void;
  updateNodeTemplate: (index: number, template: NodeTemplate) => void;
  deleteNodeTemplate: (index: number) => void;

  // Variables
  addVariable: (variable: WorkflowVariable) => void;
  removeVariable: (name: string) => void;

  // Persistence
  loadWorkflow: (data: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    variables: WorkflowVariable[];
  }) => void;
  setShowHistory: (show: boolean) => void;
  showHistory: boolean;
}

const MAX_HISTORY_LENGTH = 20;

const saveHistory = (state: WorkflowState): HistoryState => {
  const { nodes, edges } = state;
  const newPast = [...state.history.past, { nodes, edges }];
  if (newPast.length > MAX_HISTORY_LENGTH) {
    newPast.shift();
  }
  return {
    past: newPast,
    future: [],
  };
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  currentWorkflowId: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  variables: [],
  showHistory: false,
  workflowList: [
    {
      id: 'flow-1',
      name: '示例流程 1',
      description: '这是一个示例流程',
      status: 'available',
      updatedAt: '2023-01-01',
      nodes: [],
      edges: [],
      variables: [],
    },
  ],
  isDesignerOpen: false,
  nodeLibrary: [
    { type: 'start', label: '开始', icon: 'PlayCircleOutlined' },
    { type: 'end', label: '结束', icon: 'StopOutlined' },
    { type: 'data-acquisition', label: '数据采集', icon: 'ExperimentOutlined' },
    { type: 'processing', label: '处理节点', icon: 'CodeOutlined' },
    { type: 'control', label: '控制逻辑', icon: 'ThunderboltOutlined' },
    { type: 'execution', label: '执行动作', icon: 'RobotOutlined' },
    { type: 'integration', label: '系统集成', icon: 'ApiOutlined' },
    { type: 'sub-process', label: '子流程', icon: 'DatabaseOutlined' },
    { type: 'condition', label: '条件分支', icon: 'NodeExpandOutlined' },
    { type: 'classifier', label: '分类器', icon: 'PartitionOutlined' },
  ],
  history: { past: [], future: [] },

  addWorkflow: (workflow) =>
    set((state) => ({
      workflowList: [workflow, ...state.workflowList],
    })),

  deleteWorkflow: (id) =>
    set((state) => ({
      workflowList: state.workflowList.filter((w) => w.id !== id),
    })),

  updateWorkflow: (id, data) =>
    set((state) => ({
      workflowList: state.workflowList.map((w) =>
        w.id === id ? { ...w, ...data } : w,
      ),
    })),

  openWorkflow: (id) => {
    const workflow = get().workflowList.find((w) => w.id === id);
    if (workflow) {
      set({
        currentWorkflowId: id,
        nodes: workflow.nodes,
        edges: workflow.edges,
        variables: workflow.variables,
        isDesignerOpen: true,
        history: { past: [], future: [] },
      });
    }
  },

  closeWorkflow: () =>
    set({
      currentWorkflowId: null,
      isDesignerOpen: false,
      nodes: [],
      edges: [],
      variables: [],
      history: { past: [], future: [] },
    }),

  saveCurrentWorkflow: () => {
    const { currentWorkflowId, nodes, edges, variables } = get();
    if (currentWorkflowId) {
      set((state) => ({
        workflowList: state.workflowList.map((w) =>
          w.id === currentWorkflowId
            ? {
                ...w,
                nodes,
                edges,
                variables,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : w,
        ),
      }));
    }
  },

  setShowHistory: (show: boolean) => set({ showHistory: show }),
  // History Navigation
  jumpToHistory: (index: number) => {
    set((state) => {
      const { past, future } = state.history;
      if (index < 0 || index >= past.length) return state;

      const targetState = past[index];
      const newPast = past.slice(0, index);
      const newFuture = [
        ...past.slice(index + 1),
        { nodes: state.nodes, edges: state.edges },
        ...future,
      ];

      return {
        nodes: targetState.nodes,
        edges: targetState.edges,
        history: {
          past: newPast,
          future: newFuture,
        },
      };
    });
  },

  onNodesChange: (changes) => {
    set((state) => {
      // Only save history for specific changes if needed, or all changes
      // For drag movements, we might want to debounce, but simple approach first
      const newHistory = changes.some((c) => c.type !== 'select')
        ? saveHistory(state)
        : state.history;
      return {
        nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
        history: changes.some((c) => c.type !== 'select')
          ? newHistory
          : state.history,
      };
    });
  },

  onEdgesChange: (changes) => {
    set((state) => {
      const newHistory = changes.some((c) => c.type !== 'select')
        ? saveHistory(state)
        : state.history;
      return {
        edges: applyEdgeChanges(changes, state.edges),
        history: changes.some((c) => c.type !== 'select')
          ? newHistory
          : state.history,
      };
    });
  },

  onConnect: (connection) => {
    set((state) => ({
      history: saveHistory(state),
      edges: addEdge(connection, state.edges),
    }));
  },

  addNode: (node) => {
    set((state) => ({
      history: saveHistory(state),
      nodes: [...state.nodes, node],
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      history: saveHistory(state),
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  updateNodeData: (id, data) => {
    set((state) => ({
      // Don't save history on every keystroke, ideally should be debounced or onBlur
      // For now, save history
      history: saveHistory(state),
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data },
          };
        }
        return node;
      }),
    }));
  },

  undo: () => {
    set((state) => {
      const { past, future } = state.history;
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        nodes: previous.nodes,
        edges: previous.edges,
        history: {
          past: newPast,
          future: [{ nodes: state.nodes, edges: state.edges }, ...future],
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { past, future } = state.history;
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        nodes: next.nodes,
        edges: next.edges,
        history: {
          past: [...past, { nodes: state.nodes, edges: state.edges }],
          future: newFuture,
        },
      };
    });
  },

  validateWorkflow: () => {
    const { nodes, edges } = get();
    let isValid = true;

    const newNodes = nodes.map((node) => {
      const isStart = node.type === 'start';
      const isEnd = node.type === 'end';

      const hasIncoming = edges.some((e) => e.target === node.id);
      const hasOutgoing = edges.some((e) => e.source === node.id);

      let nodeValid = true;
      if (!isStart && !hasIncoming) nodeValid = false;
      if (!isEnd && !hasOutgoing) nodeValid = false;

      if (!nodeValid) isValid = false;

      return {
        ...node,
        data: {
          ...node.data,
          isValid: nodeValid,
        },
      };
    });

    set({ nodes: newNodes });
    return isValid;
  },

  addNodeTemplate: (template) => {
    set((state) => ({
      nodeLibrary: [...state.nodeLibrary, template],
    }));
  },

  updateNodeTemplate: (index, template) => {
    set((state) => {
      const newLibrary = [...state.nodeLibrary];
      newLibrary[index] = template;
      return { nodeLibrary: newLibrary };
    });
  },

  deleteNodeTemplate: (index) => {
    set((state) => ({
      nodeLibrary: state.nodeLibrary.filter((_, i) => i !== index),
    }));
  },

  addVariable: (variable) => {
    set((state) => ({
      variables: [...state.variables, variable],
    }));
  },

  removeVariable: (name) => {
    set((state) => ({
      variables: state.variables.filter((v) => v.name !== name),
    }));
  },

  loadWorkflow: (data) => {
    set({
      nodes: data.nodes || [],
      edges: data.edges || [],
      variables: data.variables || [],
      history: { past: [], future: [] },
    });
  },
}));
