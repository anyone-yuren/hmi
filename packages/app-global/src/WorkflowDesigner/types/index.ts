import type { Edge, Node } from '@xyflow/react';

export type WorkflowNodeType =
  | 'start'
  | 'end'
  | 'data-acquisition'
  | 'processing'
  | 'control'
  | 'execution'
  | 'integration'
  | 'sub-process';

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  type: WorkflowNodeType;
  description?: string;
  status?: 'pending' | 'running' | 'success' | 'failure';
  isValid?: boolean; // Validation status
  // Dynamic parameters
  params?: Record<string, any>;
  // Variables used by this node
  variables?: string[];
}

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  defaultValue?: any;
}

export interface NodeTemplate {
  type: WorkflowNodeType;
  label: string;
  icon?: string; // Icon name or identifier
  description?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
}
