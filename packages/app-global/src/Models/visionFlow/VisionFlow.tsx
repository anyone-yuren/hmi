import {
  Background,
  Controls,
  ReactFlow, // 新增：获取 ReactFlow 实例
  ReactFlowProvider, // 新增：提供 ReactFlow 上下文
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect } from 'react';

import VisionConfigNode from './nodes/VisionConfigNode';
import VisionParamGroupNode from './nodes/VisionParamGroupNode';
import VisionSceneNode from './nodes/VisionSceneNode';
import VisionScenePickupMoveNode from './nodes/VisionScenePickupMove';
import VisionSceneSelectNode from './nodes/VisionSceneSelectNode';
import { useVisionFlowStore } from './store/visionFlowStore';

const nodeTypes = {
  visionConfig: VisionConfigNode,
  visionSceneSelect: VisionSceneSelectNode,
  visionScene: VisionSceneNode,
  visionParamGroup: VisionParamGroupNode,
  visionScenePickupMove: VisionScenePickupMoveNode,
};

// 内部组件，使用 useReactFlow hook
function FlowContent() {
  const { nodes, edges, init, onNodesChange, fitViewOnChange } = useVisionFlowStore();
  const { fitView } = useReactFlow();

  useEffect(() => {
    init();
  }, []);

  // 当节点变化时，调整视图显示全部
  useEffect(() => {
    if (nodes.length > 0) {
      // 使用 setTimeout 确保在 DOM 更新后执行 fitView
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 0);
    }
  }, [nodes, edges, fitViewOnChange, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      nodesDraggable={true}
      onNodesChange={onNodesChange}
      colorMode='dark'
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

// 主组件，包装在 ReactFlowProvider 中
export default function VisionFlow() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
}
