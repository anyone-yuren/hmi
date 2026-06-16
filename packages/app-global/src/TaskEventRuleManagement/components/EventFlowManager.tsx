import { CopyOutlined } from '@ant-design/icons';
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Form, Input, List, message, Modal, Select, Tag } from 'antd';
import { nanoid } from 'nanoid';
import React, { useCallback, useMemo, useState } from 'react';
import { useTaskRuleStore } from '../store/useTaskRuleStore';
import {
  ActuatorSubType,
  EventNode,
  EventType,
  PointType,
  TaskType,
  VisionSubType,
} from '../types';
import CustomNode from './nodes/CustomNode';

const TASK_TYPES: { label: string; value: TaskType }[] = [
  { label: '取货', value: 'PICKUP' },
  { label: '放货', value: 'DELIVER' },
  { label: '充电', value: 'CHARGE' },
  { label: '回待命点', value: 'RETURN_TO_STANDBY' },
];

const POINT_TYPES: { label: string; value: PointType }[] = [
  { label: '入库点', value: 'ENTRY_POINT' },
  { label: '出库点', value: 'EXIT_POINT' },
  { label: '库位点', value: 'STORAGE_POINT' },
];

const EVENT_TYPES: { label: string; value: EventType }[] = [
  { label: '视觉', value: 'VISION' },
  { label: '执行机构', value: 'ACTUATOR' },
  // { label: '充电', value: 'CHARGE' }, // Handled by task type context or specific logic
];

const VISION_SUB_TYPES: { label: string; value: VisionSubType }[] = [
  { label: '货架状态检测', value: 'SHELF_STATUS_CHECK' },
  { label: '托盘姿态识别', value: 'PALLET_POSTURE_RECOGNITION' },
];

const ACTUATOR_SUB_TYPES: { label: string; value: ActuatorSubType }[] = [
  { label: '升', value: 'LIFT_UP' },
  { label: '降', value: 'LIFT_DOWN' },
];

export const EventFlowManager = () => {
  const {
    eventFlows,
    addEventFlow,
    updateEventFlow,
    deleteEventFlow,
    exportEventFlows,
  } = useTaskRuleStore();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<EventNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Node editing
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [nodeForm] = Form.useForm();
  const [selectedEventType, setSelectedEventType] = useState<
    EventType | undefined
  >(undefined);

  // Flow creation/editing meta
  const [isFlowMetaModalOpen, setIsFlowMetaModalOpen] = useState(false);
  const [flowMetaForm] = Form.useForm();
  const [pendingSourceNodeId, setPendingSourceNodeId] = useState<string | null>(
    null
  );

  // Copy Flow State
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyTargetId, setCopyTargetId] = useState<string | null>(null);
  const [copyForm] = Form.useForm();

  // Layout helper
  const layoutNodes = useCallback((nodes: EventNode[], edges: Edge[]) => {
    // Simple topological sort / horizontal layout
    // Assuming a linear flow for now or simple branching
    // This is a naive implementation that just spaces nodes out horizontally
    // A proper layout engine (like dagre) would be better but this suffices for the requirement "Insert node shifts others"

    const sortedNodes = [...nodes];
    // Find start node
    const startNode = sortedNodes.find((n) => n.data.isStart);
    if (!startNode) return sortedNodes;

    const visited = new Set<string>();
    const queue: { id: string; x: number }[] = [
      { id: startNode.id, x: startNode.position.x },
    ];
    const newPositions: Record<string, number> = {
      [startNode.id]: startNode.position.x,
    };

    while (queue.length > 0) {
      const { id, x } = queue.shift()!;
      visited.add(id);

      // Find outgoing edges
      const outgoingEdges = edges.filter((e) => e.source === id);
      outgoingEdges.forEach((edge) => {
        if (!visited.has(edge.target)) {
          const targetNode = sortedNodes.find((n) => n.id === edge.target);
          if (targetNode) {
            const newX = x + 300; // Fixed spacing
            newPositions[edge.target] = newX;
            queue.push({ id: edge.target, x: newX });
            visited.add(edge.target);
          }
        }
      });
    }

    return sortedNodes.map((n) => ({
      ...n,
      position: {
        x: newPositions[n.id] ?? n.position.x,
        y: 250, // Keep Y aligned
      },
    }));
  }, []);

  // Add new node from handle - Step 1: Open Modal
  const handleAddNodeFrom = useCallback(
    (sourceNodeId: string) => {
      setPendingSourceNodeId(sourceNodeId);
      setEditingNodeId(null);
      nodeForm.resetFields();
      setSelectedEventType(undefined);
      setIsNodeModalOpen(true);
    },
    [nodeForm]
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((currentNodes) => {
        const nodeToDelete = currentNodes.find((n) => n.id === nodeId);
        if (!nodeToDelete) return currentNodes;

        // Find edges connected to this node
        setEdges((currentEdges) => {
          const incomingEdge = currentEdges.find((e) => e.target === nodeId);
          const outgoingEdge = currentEdges.find((e) => e.source === nodeId);

          let newEdges = currentEdges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          );

          if (incomingEdge && outgoingEdge) {
            // Reconnect predecessor to successor
            newEdges.push({
              id: `e${incomingEdge.source}-${outgoingEdge.target}`,
              source: incomingEdge.source,
              target: outgoingEdge.target,
            });
          }

          // Trigger layout update after deletion
          setTimeout(() => {
            setNodes((nds) => layoutNodes(nds, newEdges));
          }, 0);

          return newEdges;
        });

        return currentNodes.filter((n) => n.id !== nodeId);
      });
    },
    [setEdges, setNodes, layoutNodes]
  );

  // Load flow into editor
  const handleSelectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    const flow = eventFlows.find((f) => f.id === flowId);
    if (flow) {
      const nodesWithHandlers = (flow.nodes || []).map((n) => ({
        ...n,
        data: {
          ...n.data,
          onAddNode: handleAddNodeFrom,
          onDeleteNode: handleDeleteNode,
        },
      }));
      // Initial layout
      const layoutedNodes = layoutNodes(nodesWithHandlers, flow.edges || []);
      setNodes(layoutedNodes);
      setEdges(flow.edges || []);
    }
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add new node (independent) - NOT USED much in this flow anymore but kept for compatibility
  const handleAddNode = () => {
    setEditingNodeId(null);
    setPendingSourceNodeId(null);
    nodeForm.resetFields();
    setSelectedEventType(undefined);
    setIsNodeModalOpen(true);
  };

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    if (node.data?.isStart || node.data?.isEnd) return;
    setEditingNodeId(node.id);
    nodeForm.setFieldsValue({
      label: node.data.label,
      pointType: node.data.params?.pointType,
      eventType: node.data.params?.eventType,
      subType: node.data.params?.subType,
    });
    setSelectedEventType(node.data.params?.eventType);
    setIsNodeModalOpen(true);
  };

  const saveNode = () => {
    nodeForm.validateFields().then((values) => {
      const newNodeData = {
        label: values.label,
        params: {
          pointType: values.pointType,
          eventType: values.eventType,
          subType: values.subType,
        },
      };

      if (editingNodeId) {
        // Edit existing node
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === editingNodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...newNodeData,
                  onAddNode: handleAddNodeFrom,
                  onDeleteNode: handleDeleteNode,
                  error: false,
                },
              };
            }
            return node;
          })
        );
      } else if (pendingSourceNodeId) {
        // Insert new node after pendingSourceNodeId
        const newNodeId = nanoid();
        const newNode: EventNode = {
          id: newNodeId,
          type: 'custom',
          position: { x: 0, y: 0 }, // Will be set by layout
          data: {
            ...newNodeData,
            onAddNode: handleAddNodeFrom,
            onDeleteNode: handleDeleteNode,
          },
        };

        setNodes((currentNodes) => {
          const sourceNode = currentNodes.find(
            (n) => n.id === pendingSourceNodeId
          );
          if (!sourceNode) return currentNodes;

          // Update edges
          setEdges((currentEdges) => {
            // Find edge coming out of source
            const outgoingEdge = currentEdges.find(
              (e) => e.source === pendingSourceNodeId
            );
            let newEdges = [...currentEdges];

            if (outgoingEdge) {
              // Remove old edge
              newEdges = newEdges.filter((e) => e.id !== outgoingEdge.id);
              // Link New -> Target
              newEdges.push({
                id: `e${newNodeId}-${outgoingEdge.target}`,
                source: newNodeId,
                target: outgoingEdge.target,
              });
            }

            // Link Source -> New
            newEdges.push({
              id: `e${pendingSourceNodeId}-${newNodeId}`,
              source: pendingSourceNodeId,
              target: newNodeId,
            });

            // Trigger layout
            setTimeout(() => {
              setNodes((nds) => layoutNodes(nds, newEdges));
            }, 0);

            return newEdges;
          });

          return [...currentNodes, newNode];
        });
      } else {
        // Standalone node (fallback)
        const newNode = {
          id: nanoid(),
          type: 'custom',
          position: { x: 250, y: 250 },
          data: {
            ...newNodeData,
            onAddNode: handleAddNodeFrom,
            onDeleteNode: handleDeleteNode,
          },
        };
        setNodes((nds) => [...nds, newNode]);
      }
      setIsNodeModalOpen(false);
      setPendingSourceNodeId(null);
    });
  };

  const saveFlow = () => {
    if (selectedFlowId) {
      // Validation
      let hasError = false;
      const validatedNodes = nodes.map((n) => {
        if (n.data.isStart || n.data.isEnd) return n;
        const { pointType, eventType, subType } = n.data.params || {};
        if (!pointType || !eventType || !subType) {
          hasError = true;
          return { ...n, data: { ...n.data, error: true } };
        }
        return { ...n, data: { ...n.data, error: false } };
      });

      setNodes(validatedNodes);

      if (hasError) {
        message.error('存在未配置的节点，请检查高亮节点');
        return;
      }

      // Remove non-serializable function before saving to store
      const nodesToSave = validatedNodes.map((n) => {
        const { onAddNode, ...restData } = n.data;
        return { ...n, data: restData };
      });

      updateEventFlow(selectedFlowId, {
        nodes: nodesToSave,
        edges,
      });
      message.success('保存成功');
      // Also update meta if needed via separate modal
    }
  };

  const handleCreateFlow = () => {
    flowMetaForm.resetFields();
    setIsFlowMetaModalOpen(true);
  };

  const confirmCreateFlow = () => {
    flowMetaForm.validateFields().then((values) => {
      const newId = nanoid();
      addEventFlow({
        id: newId,
        name: values.name,
        taskType: values.taskType,
        isDefault: false,
        status: 'NORMAL',
        nodes: [
          {
            id: 'start',
            type: 'custom',
            position: { x: 50, y: 50 },
            data: { label: '开始', isStart: true },
          },
          {
            id: 'end',
            type: 'custom',
            position: { x: 50, y: 350 },
            data: { label: '结束', isEnd: true },
          },
        ],
        edges: [{ id: 'e-start-end', source: 'start', target: 'end' }],
      });
      setIsFlowMetaModalOpen(false);
      handleSelectFlow(newId);
    });
  };

  const handleCopyFlow = () => {
    copyForm.validateFields().then((values) => {
      const flow = eventFlows.find((f) => f.id === copyTargetId);
      if (flow) {
        const newId = nanoid();
        addEventFlow({
          ...flow,
          id: newId,
          name: values.name,
          isDefault: false, // Copied flow should not be default initially
        });
        message.success('复制成功');
        setIsCopyModalOpen(false);
        setCopyTargetId(null);
        copyForm.resetFields();
      }
    });
  };

  const openCopyModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCopyTargetId(id);
    setIsCopyModalOpen(true);
    copyForm.resetFields();
  };

  return (
    <div className='h-full flex gap-4'>
      {/* Left: Flow List */}
      <div className='w-1/4 min-w-[300px] border-r border-white/10 pr-4 flex flex-col h-full'>
        <div className='mb-4 flex justify-between items-center'>
          <span className='font-bold text-lg text-white'>事件流列表</span>
          <div className='space-x-2'>
            {/* <Button size='small' onClick={exportEventFlows}>
              导出
            </Button> */}
            <Button type='primary' size='small' onClick={handleCreateFlow}>
              新建流程
            </Button>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto'>
          <List
            dataSource={eventFlows}
            renderItem={(flow) => (
              <List.Item
                className={`border-b border-white/10 hover:bg-white/10 cursor-pointer p-2 ${
                  selectedFlowId === flow.id ? 'bg-primary/20' : ''
                }`}
                onClick={() => handleSelectFlow(flow.id)}
              >
                <div className='w-full'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-white'>
                          {flow.name}
                        </span>
                        <Tag className='mr-0'>
                          {TASK_TYPES.find((t) => t.value === flow.taskType)
                            ?.label || flow.taskType}
                        </Tag>
                      </div>
                      <div className='text-xs text-white/60 mt-1'>
                        包含 {flow.nodes?.length || 0} 个节点
                      </div>
                    </div>
                    <Button
                      type='text'
                      size='small'
                      icon={<CopyOutlined />}
                      onClick={(e) => openCopyModal(flow.id, e)}
                      className='text-white/60 hover:text-white'
                    />
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* Right: React Flow Editor */}
      <div className='flex-1 bg-white/5 rounded border border-white/10 p-4 relative flex flex-col'>
        {selectedFlowId ? (
          <>
            <div className='flex justify-between items-center mb-2'>
              <div className='text-white font-bold'>
                {eventFlows.find((f) => f.id === selectedFlowId)?.name}
              </div>
              <div className='space-x-2'>
                <Button type='primary' onClick={saveFlow}>
                  保存画布
                </Button>
                <Button danger onClick={() => deleteEventFlow(selectedFlowId)}>
                  删除流程
                </Button>
              </div>
            </div>
            <div className='flex-1 bg-gray-900 rounded overflow-hidden'>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                colorMode='dark'
                fitView
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </>
        ) : (
          <div className='h-full flex items-center justify-center text-white/40'>
            请选择或新建一个事件流
          </div>
        )}
      </div>

      {/* Node Edit Modal */}
      <Modal
        title={editingNodeId ? '编辑节点' : '新增节点'}
        open={isNodeModalOpen}
        onOk={saveNode}
        onCancel={() => setIsNodeModalOpen(false)}
        width={600}
      >
        <Form form={nodeForm} layout='horizontal' labelCol={{ span: 4 }}>
          <Form.Item name='label' label='节点名称' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='pointType'
            label='位置类型'
            rules={[{ required: true }]}
          >
            <Select options={POINT_TYPES} />
          </Form.Item>
          <Form.Item
            name='eventType'
            label='事件类型'
            rules={[{ required: true }]}
          >
            <Select
              options={EVENT_TYPES}
              onChange={(val) => {
                setSelectedEventType(val);
                nodeForm.setFieldValue('subType', undefined);
              }}
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.eventType !== curr.eventType}
          >
            {() => {
              const type =
                nodeForm.getFieldValue('eventType') || selectedEventType;
              if (type === 'VISION') {
                return (
                  <Form.Item
                    name='subType'
                    label='视觉子类型'
                    rules={[{ required: true }]}
                  >
                    <Select options={VISION_SUB_TYPES} />
                  </Form.Item>
                );
              }
              if (type === 'ACTUATOR') {
                return (
                  <Form.Item
                    name='subType'
                    label='执行机构动作'
                    rules={[{ required: true }]}
                  >
                    <Select options={ACTUATOR_SUB_TYPES} />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* Flow Meta Modal */}
      <Modal
        title='新建事件流'
        open={isFlowMetaModalOpen}
        onOk={confirmCreateFlow}
        onCancel={() => setIsFlowMetaModalOpen(false)}
      >
        <Form form={flowMetaForm} layout='vertical'>
          <Form.Item name='name' label='流程名称' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='taskType'
            label='任务类型'
            rules={[{ required: true }]}
          >
            <Select options={TASK_TYPES} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Copy Flow Modal */}
      <Modal
        title='复制事件流'
        open={isCopyModalOpen}
        onOk={handleCopyFlow}
        onCancel={() => setIsCopyModalOpen(false)}
      >
        <Form form={copyForm} layout='vertical'>
          <Form.Item
            name='name'
            label='新流程名称'
            rules={[{ required: true, message: '请输入新流程名称' }]}
          >
            <Input placeholder='请输入新流程名称' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
