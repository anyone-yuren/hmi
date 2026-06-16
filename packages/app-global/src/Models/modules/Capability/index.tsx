import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
// @ts-ignore
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import CapabilityNode from './components/CapabilityNode';
import { buildCapabilityFlow } from './components/useCapabilityFlow';

const nodeTypes = {
  capability: CapabilityNode,
};

function RobotCapabilityTopology() {
  const doneCapabilities = ['network', 'steer'];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {},
  );

  const { fitView } = useReactFlow();

  /** 监听容器宽度 */
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // ts-ignore
  const handleToggleExpand = useCallback((id: string, expanded: boolean) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: expanded }));
  }, []);

  const flow = buildCapabilityFlow(
    doneCapabilities,
    width,
    expandedNodes,
    handleToggleExpand,
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);

  /** 宽度 or 能力变化 or 展开状态变化时重建拓扑 */
  useEffect(() => {
    if (!width) return;
    setNodes(flow.nodes);
    setEdges(flow.edges);
  }, [doneCapabilities.join(','), width, expandedNodes]);

  /** 初始化 & 更新后 fitView */
  useEffect(() => {
    if (!nodes.length) return;

    requestAnimationFrame(() => {
      fitView({
        padding: 0.2,
        duration: 300,
      });
    });
  }, [nodes]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode='dark'
        minZoom={0.2}
        maxZoom={2}
        panOnDrag
        zoomOnScroll
        nodesConnectable={false}
      >
        <Background gap={16} />
        <Controls />
        <MiniMap
          nodeStrokeColor='#333'
          nodeColor={(n) => {
            if (n.data.status === 'done') return '#52c41a';
            if (n.data.status === 'ready') return '#faad14';
            return '#666';
          }}
          className='!bg-[#222]'
        />
      </ReactFlow>
    </div>
  );
}

export default function RobotCapabilityTopologyWrapper() {
  return (
    <ReactFlowProvider>
      <RobotCapabilityTopology />
    </ReactFlowProvider>
  );
}
