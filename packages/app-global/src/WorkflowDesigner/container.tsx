import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExportOutlined,
  PlusSquareOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Form, Input, message, Modal, Tag } from 'antd';
import { useTheme } from 'antd-style';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import WorkflowDesigner from './index';
import { useWorkflowStore, WorkflowMetadata } from './store/useWorkflowStore';

const RenderItem = ({ item }: { item: WorkflowMetadata }) => {
  const theme = useTheme();
  const { deleteWorkflow, updateWorkflow, openWorkflow } = useWorkflowStore();

  // 状态字典
  const statusMap = {
    available: {
      color: 'green',
      text: '已发布',
    },
    unavailable: {
      color: 'red',
      text: '未发布',
    },
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'edit':
        openWorkflow(item.id);
        break;
      case 'publish':
        updateWorkflow(item.id, { status: 'available' });
        message.success('发布成功');
        break;
      case 'delete':
        Modal.confirm({
          title: '确认删除',
          content: '确定要删除该流程吗？',
          onOk: () => {
            deleteWorkflow(item.id);
            message.success('删除成功');
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className='h-32'>
      <div
        className='flex p-2 gap-2 flex-col w-full h-full cursor-pointer rounded-md bg-white/5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-[0_0_4px_rgba(255,255,255,0.5)] relative group'
        onClick={() => openWorkflow(item.id)}
      >
        <div
          className='absolute top-2 right-2'
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            menu={{
              items: [
                {
                  label: '设计',
                  key: 'edit',
                  icon: <EditOutlined style={{ fontSize: '14px' }} />,
                  style: { color: theme.colorPrimary },
                },
                {
                  label: '发布',
                  key: 'publish',
                  icon: <CloudUploadOutlined style={{ fontSize: '14px' }} />,
                },
                {
                  label: '导出',
                  key: 'export',
                  icon: <ExportOutlined style={{ fontSize: '14px' }} />,
                },
                {
                  label: '删除',
                  key: 'delete',
                  icon: <DeleteOutlined style={{ fontSize: '14px' }} />,
                  style: { color: theme.colorError },
                },
              ],
              onClick: ({ key }) => handleMenuClick(key),
            }}
          >
            <Button
              className='h-7'
              type='text'
              icon={<EllipsisOutlined style={{ fontSize: '20px' }} />}
            ></Button>
          </Dropdown>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 flex items-center justify-center text-3xl'>
            <RobotOutlined />
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium text-gray-200'>
              {item.name}
            </span>
            {item.description && (
              <span className='text-xs text-gray-400 line-clamp-2'>
                {item.description}
              </span>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-auto'>
          <div className='text-xs text-gray-400'>
            <Tag
              color={item.status === 'available' ? 'green' : 'red'}
              bordered={false}
            >
              {statusMap[item.status || 'available'].text}
            </Tag>
          </div>
          <div className='text-xs text-gray-400 text-ellipsis whitespace-nowrap text-right'>
            更新时间：{item.updatedAt}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowDesignerContainer = () => {
  const { workflowList, addWorkflow, openWorkflow, isDesignerOpen } =
    useWorkflowStore();
  const [form] = Form.useForm();
  const [addFlow, setAddFlow] = useState(false);

  const handleAddFlow = () => {
    form.validateFields().then((values) => {
      const newWorkflow: WorkflowMetadata = {
        id: `flow-${Date.now()}`,
        name: values.name,
        description: values.description,
        status: 'unavailable',
        updatedAt: new Date().toISOString().split('T')[0],
        nodes: [],
        edges: [],
        variables: [],
      };
      addWorkflow(newWorkflow);
      setAddFlow(false);
      form.resetFields();

      // Open the designer for the new workflow
      openWorkflow(newWorkflow.id);
    });
  };

  return (
    <div className='flex flex-col h-full w-full gap-2 relative overflow-hidden'>
      <div className='flex h-10 items-center justify-between border-b border-gray-700 bg-[#1f1f1f] px-4 shadow-sm'>
        <Form layout='inline' size='small'>
          <Form.Item name='search'>
            <Input
              placeholder='请输入流程名称'
              className='bg-[#2a2a2a] border-gray-600 text-gray-200 placeholder-gray-500'
            />
          </Form.Item>
          <Form.Item>
            <div className='flex items-center gap-2'>
              <Button type='primary'>搜索</Button>
              <Button>导入</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      <div className='flex flex-1 border-b border-gray-700 bg-[#1f1f1f] p-2 shadow-sm overflow-y-auto'>
        <div className='grid grid-cols-4 w-full gap-2 items-start auto-rows-[128px]'>
          <div
            className='flex items-center justify-center w-full h-32 cursor-pointer rounded-md bg-white/5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-[0_0_4px_rgba(255,255,255,0.5)] text-gray-300 hover:text-white'
            onClick={() => setAddFlow(true)}
          >
            <div className='text-lg flex items-center gap-2'>
              <PlusSquareOutlined />
              <span>新增流程</span>
            </div>
          </div>
          {workflowList.map((item) => (
            <RenderItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <Modal
        title='新增流程'
        open={addFlow}
        onCancel={() => setAddFlow(false)}
        onOk={handleAddFlow}
      >
        <Form layout='vertical' form={form}>
          <Form.Item name='name' label='流程名称' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='description' label='流程描述'>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <AnimatePresence>
        {isDesignerOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='absolute top-0 right-0 bottom-0 left-0 z-50 bg-[#1f1f1f]'
          >
            <WorkflowDesigner />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default WorkflowDesignerContainer;
