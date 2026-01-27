import { HistoryOutlined } from '@ant-design/icons';
import { Alert, Button } from 'antd';
import AddNodeModal from './components/AddNodeModal';
import ControlPanel from './components/ControlPanel';
import FlowCanvas from './components/FlowCanvas';
import HeaderControls from './components/HeaderControls';
import HistoryPanel from './components/HistoryPanel';
import { useAutoCompileStore } from './store';

const AutoCompile = () => {
  const setHistoryVisible = useAutoCompileStore(
    (state) => state.setHistoryVisible,
  );
  const selectedHistoryId = useAutoCompileStore(
    (state) => state.selectedHistoryId,
  );
  const selectHistory = useAutoCompileStore((state) => state.selectHistory);

  return (
    <div className='relative w-full h-full overflow-hidden bg-gray-50'>
      {/* Top Bar / Controls */}
      <div className='absolute top-4 right-4 z-10 flex items-center gap-4'>
        <HeaderControls />
        <Button
          icon={<HistoryOutlined />}
          onClick={() => setHistoryVisible(true)}
        >
          查看历史
        </Button>
      </div>

      {/* History View Banner */}
      {selectedHistoryId && (
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[400px]'>
          <Alert
            message='正在查看历史构建快照'
            description='当前视图为只读模式'
            type='warning'
            showIcon
            action={
              <Button
                size='small'
                type='primary'
                onClick={() => selectHistory(null)}
              >
                退出预览
              </Button>
            }
          />
        </div>
      )}

      {/* Main Flow Canvas */}
      <FlowCanvas />

      {/* Bottom Control Panel */}
      <ControlPanel />

      {/* History Slide-out Panel */}
      <HistoryPanel />

      {/* Add Node Modal */}
      <AddNodeModal />
    </div>
  );
};

export default AutoCompile;
