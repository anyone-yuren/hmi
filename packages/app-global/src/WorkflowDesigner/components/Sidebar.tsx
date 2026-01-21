import {
  ApiOutlined,
  CodeOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExperimentOutlined,
  NodeExpandOutlined,
  PartitionOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RobotOutlined,
  StopOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { NodeTemplate, WorkflowNodeType } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  PlayCircleOutlined: <PlayCircleOutlined />,
  StopOutlined: <StopOutlined />,
  ExperimentOutlined: <ExperimentOutlined />,
  CodeOutlined: <CodeOutlined />,
  ThunderboltOutlined: <ThunderboltOutlined />,
  RobotOutlined: <RobotOutlined />,
  ApiOutlined: <ApiOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  NodeExpandOutlined: <NodeExpandOutlined />,
  PartitionOutlined: <PartitionOutlined />,
};

const Sidebar = () => {
  const nodeLibrary = useWorkflowStore((state) => state.nodeLibrary);
  const addNodeTemplate = useWorkflowStore((state) => state.addNodeTemplate);
  const updateNodeTemplate = useWorkflowStore(
    (state) => state.updateNodeTemplate,
  );
  const deleteNodeTemplate = useWorkflowStore(
    (state) => state.deleteNodeTemplate,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm();

  const onDragStart = (event: React.DragEvent, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAdd = () => {
    setEditingIndex(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (index: number, template: NodeTemplate) => {
    setEditingIndex(index);
    form.setFieldsValue(template);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个节点模板吗？',
      onOk: () => deleteNodeTemplate(index),
    });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingIndex !== null) {
        updateNodeTemplate(editingIndex, values);
      } else {
        addNodeTemplate(values);
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div className='flex h-full w-60 flex-col border-r border-gray-700 bg-[#1f1f1f] text-gray-200'>
      <div className='flex items-center justify-between border-b border-gray-700 p-4'>
        <div>
          <h3 className='text-lg font-bold'>节点库</h3>
          <p className='text-xs text-gray-400'>拖拽节点到画布</p>
        </div>
        <Tooltip title='添加新节点模板'>
          <Button
            type='text'
            icon={<PlusOutlined className='text-gray-300' />}
            onClick={handleAdd}
          />
        </Tooltip>
      </div>
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='grid grid-cols-2 gap-3'>
          {nodeLibrary.map((node, index) => (
            <div
              key={`${node.type}-${index}`}
              className='group relative flex cursor-move flex-col items-center justify-center gap-2 rounded border border-gray-600 bg-[#2a2a2a] p-3 text-center transition-colors hover:border-blue-500 hover:bg-[#333]'
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
            >
              <div className='text-xl text-gray-400 group-hover:text-blue-400'>
                {iconMap[node.icon || 'CodeOutlined'] || <CodeOutlined />}
              </div>
              <span className='text-xs text-gray-300'>{node.label}</span>

              <div className='absolute right-1 top-1 hidden gap-1 group-hover:flex'>
                <Button
                  type='text'
                  size='small'
                  icon={
                    <EditOutlined className='text-xs text-gray-400 hover:text-blue-400' />
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(index, node);
                  }}
                />
                <Button
                  type='text'
                  size='small'
                  icon={
                    <DeleteOutlined className='text-xs text-gray-400 hover:text-red-400' />
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(index);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title={editingIndex !== null ? '编辑节点模板' : '新增节点模板'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='type' label='节点类型' rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'start', label: '开始' },
                { value: 'end', label: '结束' },
                { value: 'data-acquisition', label: '数据采集' },
                { value: 'processing', label: '处理' },
                { value: 'control', label: '控制' },
                { value: 'execution', label: '执行' },
                { value: 'integration', label: '集成' },
                { value: 'sub-process', label: '子流程' },
              ]}
            />
          </Form.Item>
          <Form.Item name='label' label='显示名称' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='icon' label='图标'>
            <Select
              options={Object.keys(iconMap).map((key) => ({
                value: key,
                label: key,
              }))}
            />
          </Form.Item>
          <Form.Item name='description' label='描述'>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Sidebar;
