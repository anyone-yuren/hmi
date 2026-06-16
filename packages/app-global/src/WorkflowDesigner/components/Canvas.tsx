import {
  Background,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Dropdown, MenuProps } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconifyIcon } from 'ui';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { WorkflowNodeType } from '../types';
import CommonNode from './Nodes/CommonNode';
import EndNode from './Nodes/EndNode';
import StartNode from './Nodes/StartNode';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  'data-acquisition': CommonNode,
  processing: CommonNode,
  control: CommonNode,
  execution: CommonNode,
  integration: CommonNode,
  'sub-process': CommonNode,
};

const Flow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);

  const {
    nodes,
    edges,
    nodeLibrary,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    setShowHistory,
    undo,
    redo,
    history,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        'application/reactflow',
      ) as WorkflowNodeType;
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Find template label
      const template = nodeLibrary.find((n) => n.type === type);
      const label = template?.label || type;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label, type },
      };

      addNode(newNode as any);
    },
    [screenToFlowPosition, addNode, nodeLibrary],
  );

  // Handle auto-connect logic via drag
  const onConnectStart = useCallback(
    (_, { nodeId }: { nodeId: string | null }) => {
      setConnectingNodeId(nodeId);
    },
    [],
  );

  const onConnectEnd = useCallback(
    (event: any) => {
      if (!connectingNodeId) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // Show menu to create new node
        setMenuPosition({ x: event.clientX, y: event.clientY });
      }
      // setConnectingNodeId(null); // Keep it to know source when menu is clicked
    },
    [connectingNodeId],
  );

  // Handle auto-connect via handle click
  useEffect(() => {
    const handleHandleClick = (e: Event) => {
      const customEvent = e as CustomEvent<{
        nodeId: string;
        x: number;
        y: number;
      }>;
      setConnectingNodeId(customEvent.detail.nodeId);
      setMenuPosition({
        x: customEvent.detail.x + 20,
        y: customEvent.detail.y,
      });
    };

    window.addEventListener('workflow:handle-click', handleHandleClick);
    return () =>
      window.removeEventListener('workflow:handle-click', handleHandleClick);
  }, []);

  const onPaneClick = useCallback(() => {
    setMenuPosition(null);
    setConnectingNodeId(null);
    selectNode(null);
  }, [selectNode]);

  const onNodeClick = useCallback(
    (_, node: Node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (!connectingNodeId || !menuPosition || !reactFlowInstance) return;

    const type = key as WorkflowNodeType;

    // Find template label
    const template = nodeLibrary.find((n) => n.type === type);
    const label = template?.label || type;

    const position = reactFlowInstance.screenToFlowPosition({
      x: menuPosition.x,
      y: menuPosition.y,
    });

    const newNodeId = `${type}-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type,
      position,
      data: { label, type },
    };

    addNode(newNode as any);

    // Auto connect
    onConnect({
      source: connectingNodeId,
      sourceHandle: null,
      target: newNodeId,
      targetHandle: null,
    });

    setMenuPosition(null);
    setConnectingNodeId(null);
  };

  const menuItems: MenuProps['items'] = nodeLibrary
    .filter((n) => n.type !== 'start') // Typically don't auto-connect to start
    .map((n) => ({
      key: n.type,
      label: n.label,
    }));

  return (
    <div className='h-full w-full bg-[#121212]' ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        colorMode='dark'
      >
        <Background color='#333' gap={16} />
        <Controls className='bg-[#2a2a2a] border-gray-700 fill-white'>
          <div className='flex items-center flex-col justify-center'>
            <div
              className='px-1 flex items-center justify-center w-full cursor-pointer hover:bg-[#3a3a3a] aspect-square border-b border-[#5b5b5b]
            '
            >
              <IconifyIcon
                icon='mdi:history'
                size={16}
                onClick={() => setShowHistory(true)}
              />
            </div>
            <div
              className={classNames(
                'px-1 w-full cursor-pointer hover:bg-[#3a3a3a] aspect-square border-b border-[#5b5b5b]',
                {
                  'cursor-not-allowed text-[#5b5b5b]':
                    history.past.length === 0,
                },
              )}
              onClick={undo}
            >
              <IconifyIcon icon='mdi:undo-variant' size={16} />
            </div>
            <div
              className={classNames(
                'px-1 w-full cursor-pointer hover:bg-[#3a3a3a] aspect-square',
                {
                  'cursor-not-allowed text-[#5b5b5b]':
                    history.future.length === 0,
                },
              )}
              onClick={redo}
            >
              <IconifyIcon icon='mdi:redo-variant' size={16} />
            </div>
          </div>
        </Controls>
        <MiniMap
          className='!bg-[#2a2a2a]'
          nodeColor='#555'
          maskColor='rgba(0,0,0, 0.3)'
        />
      </ReactFlow>

      {/* Context Menu for Auto-create */}
      {menuPosition && (
        <div
          style={{
            position: 'fixed',
            left: menuPosition.x,
            top: menuPosition.y,
            zIndex: 1000,
          }}
        >
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            open={true}
            trigger={['click']}
          >
            <div />
          </Dropdown>
        </div>
      )}
    </div>
  );
};

const Canvas = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

export default Canvas;
