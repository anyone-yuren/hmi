import {
  ApiOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExportOutlined,
  NodeExpandOutlined,
  PartitionOutlined,
  PlusSquareOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Form, Input, Modal, Tag } from 'antd';
import { useTheme } from 'antd-style';
import { useState } from 'react';
import WorkflowDesigner from './index';

type NodeTemplate = {
  icon: React.ReactNode;
  name: string;
  description?: string;
  status?: 'available' | 'unavailable';
  time?: string;
};

const RenderItem = ({ item }: { item: NodeTemplate }) => {
  const theme = useTheme();
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
  return (
    <div className='h-32'>
      <div className='flex p-2 gap-2 flex-col w-full h-full cursor-pointer rounded-md bg-white/5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-[0_0_4px_rgba(255,255,255,0.5)] relative group'>
        <div className='absolute top-2 right-2'>
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
            }}
          >
            <Button
              // size='small'
              className='h-7'
              type='text'
              icon={<EllipsisOutlined style={{ fontSize: '20px' }} />}
            ></Button>
          </Dropdown>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 flex items-center justify-center text-3xl'>
            {item.icon && item.icon}
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium'>{item.name}</span>
            {item.description && (
              <span className='text-xs text-gray-400'>{item.description}</span>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-xs text-gray-400'>
            <Tag color={item.status === 'available' ? 'green' : 'red'}>
              {statusMap[item.status || 'available'].text}
            </Tag>
          </div>
          <div className='text-xs text-gray-400 text-ellipsis whitespace-nowrap text-right'>
            更新时间：{item.time}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowDesignerContainer = () => {
  const nodeLibrary: NodeTemplate[] = [
    {
      icon: <ThunderboltOutlined />,
      name: '条件节点',
      description: '根据条件判断是否执行后续节点',
      status: 'available',
      time: '2023-01-01',
    },
    {
      icon: <RobotOutlined />,
      name: '动作节点',
      description: '执行具体的操作，如调用API、数据库操作等',
      status: 'available',
      time: '2023-01-01',
    },
    {
      icon: <ApiOutlined />,
      name: 'API节点',
      description: '调用外部API',
      status: 'available',
      time: '2023-01-01',
    },
    {
      icon: <DatabaseOutlined />,
      name: '数据库节点',
      description: '连接数据库并执行查询、插入、更新等操作',
      status: 'unavailable',
      time: '2023-01-01',
    },
    {
      icon: <NodeExpandOutlined />,
      name: '节点展开',
      description: '展开子节点',
      status: 'available',
      time: '2023-01-01',
    },
    {
      icon: <PartitionOutlined />,
      name: '分区节点',
      description: '将流程分为多个子流程',
      status: 'available',
      time: '2023-01-01',
    },
  ];
  const [form] = Form.useForm();
  const [addFlow, setAddFlow] = useState(false);
  return (
    <div className='flex flex-col h-full w-full gap-2 relative'>
      <div className='flex h-10 items-center justify-between border-b border-gray-700 bg-[#1f1f1f] px-4 shadow-sm'>
        <Form layout='inline' size='small' form={form}>
          <Form.Item name='search'>
            <Input placeholder='请输入流程名称' />
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
            className='flex items-center justify-center w-full h-32 cursor-pointer rounded-md bg-white/5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-[0_0_4px_rgba(255,255,255,0.5)]'
            onClick={() => setAddFlow(true)}
          >
            <div className='text-lg flex items-center gap-2'>
              <PlusSquareOutlined />
              <span>新增流程</span>
            </div>
          </div>
          {nodeLibrary.map((item) => (
            <RenderItem key={item.name} item={item} />
          ))}
        </div>
      </div>
      <Modal
        open={addFlow}
        onCancel={() => setAddFlow(false)}
        onOk={() => setAddFlow(false)}
      >
        <div className='flex flex-col gap-4'>
          <div className='text-lg font-medium'>新增流程</div>
          <Form layout='horizontal' size='small' form={form}>
            <Form.Item name='name' label='流程名称'>
              <Input />
            </Form.Item>
            <Form.Item name='description' label='流程描述'>
              <Input.TextArea />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <div className='flex flex-1 absolute top-0 right-0 bottom-0 left-0'>
        <WorkflowDesigner />
      </div>
    </div>
  );
};
export default WorkflowDesignerContainer;
