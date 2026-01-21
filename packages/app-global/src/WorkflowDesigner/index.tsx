import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, message, Space } from 'antd';
import Canvas from './components/Canvas';
import HistoryPanel from './components/HistoryPanel';
import PropertiesPanel from './components/PropertiesPanel';
import Sidebar from './components/Sidebar';
import { useWorkflowStore } from './store/useWorkflowStore';

const WorkflowDesigner = () => {
  const {
    undo,
    redo,
    validateWorkflow,
    history,
    closeWorkflow,
    saveCurrentWorkflow,
  } = useWorkflowStore();
  const [messageApi, contextHolder] = message.useMessage();

  const handleSave = () => {
    const isValid = validateWorkflow();
    if (!isValid) {
      messageApi.error('流程存在连接问题，请检查红色高亮节点');
      return;
    }

    saveCurrentWorkflow();
    messageApi.success('流程保存成功');
  };

  return (
    <div className='flex h-full w-full flex-col bg-[#1f1f1f]'>
      {contextHolder}
      {/* Toolbar */}
      <div className='flex h-12 items-center justify-between border-b border-gray-700 bg-[#1f1f1f] px-4 shadow-sm'>
        <div className='flex items-center gap-4'>
          <Button
            type='text'
            icon={<ArrowLeftOutlined className='text-gray-300' />}
            onClick={closeWorkflow}
          />
          <div className='text-lg font-bold text-gray-200'>
            MES 工作流设计器
          </div>
        </div>
        <Space>
          <Button type='primary' icon={<SaveOutlined />} onClick={handleSave}>
            保存流程
          </Button>
        </Space>
      </div>

      {/* Main Workspace */}
      <div className='flex flex-1 overflow-hidden relative'>
        <HistoryPanel />
        <Sidebar />
        <div className='flex-1 relative'>
          <Canvas />
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default WorkflowDesigner;
