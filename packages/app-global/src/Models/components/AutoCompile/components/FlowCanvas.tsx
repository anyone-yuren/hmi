import {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
// @ts-ignore
import '@xyflow/react/dist/style.css';
import LayerNode from './LayerNode';

const nodeTypes = {
  layer: LayerNode,
} as any;

const INITIAL_NODES: Node[] = [
  {
    id: 'dependency',
    type: 'layer',
    position: { x: 250, y: 0 },
    data: { layerId: 'dependency' },
  },
  {
    id: 'base',
    type: 'layer',
    position: { x: 250, y: 300 }, // Spaced out vertically
    data: { layerId: 'base' },
  },
  {
    id: 'application',
    type: 'layer',
    position: { x: 250, y: 600 },
    data: { layerId: 'application' },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'e1-2',
    source: 'dependency',
    target: 'base',
    animated: true,
    style: { stroke: '#00d1d1', strokeWidth: 2 },
  },
  {
    id: 'e2-3',
    source: 'base',
    target: 'application',
    animated: true,
    style: { stroke: '#00d1d1', strokeWidth: 2 },
  },
];

const FlowCanvasContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition='bottom-right'
      colorMode='dark'
    >
      <Background />
      <Controls />
      <MiniMap
        className='!bg-[#2a2a2a]'
        nodeColor='#555'
        maskColor='rgba(0,0,0, 0.3)'
      />
    </ReactFlow>
  );
};

export default function FlowCanvas() {
  return (
    <div className='w-full h-full bg-gray-50'>
      <ReactFlowProvider>
        <FlowCanvasContent />
      </ReactFlowProvider>
    </div>
  );
}
