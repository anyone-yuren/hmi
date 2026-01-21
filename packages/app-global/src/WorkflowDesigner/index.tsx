import { SaveOutlined } from '@ant-design/icons';
import { Button, message, Space } from 'antd';
import Canvas from './components/Canvas';
import HistoryPanel from './components/HistoryPanel';
import PropertiesPanel from './components/PropertiesPanel';
import Sidebar from './components/Sidebar';
import { useWorkflowStore } from './store/useWorkflowStore';

const WorkflowDesigner = () => {
  const { undo, redo, validateWorkflow, history } = useWorkflowStore();
  const [messageApi, contextHolder] = message.useMessage();

  const saveWorkflow = () => {
    const isValid = validateWorkflow();
    if (!isValid) {
      messageApi.error('流程存在连接问题，请检查红色高亮节点');
      return;
    }

    const { nodes, edges, variables } = useWorkflowStore.getState();
    const data = { nodes, edges, variables };
    console.log('Saving workflow:', JSON.stringify(data, null, 2));
    messageApi.success('流程保存成功');
    // Call API here
  };

  return (
    <div className='flex h-full w-full flex-col bg-[#1f1f1f]'>
      {contextHolder}
      {/* Toolbar */}
      <div className='flex h-12 items-center justify-between border-b border-gray-700 bg-[#1f1f1f] px-4 shadow-sm'>
        <div className='text-lg font-bold text-gray-200'>工作流设计器</div>
        <Space>
          <Button type='primary' icon={<SaveOutlined />} onClick={saveWorkflow}>
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
