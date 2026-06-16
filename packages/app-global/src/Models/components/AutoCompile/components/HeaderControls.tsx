import { Button, Tooltip } from 'antd';
import { DEPENDENCIES, useAutoCompileStore } from '../store';

const HeaderControls = () => {
  const isCompiling = useAutoCompileStore((state) => state.isCompiling);
  const startCompile = useAutoCompileStore((state) => state.startCompile);
  const setAddNodeModalVisible = useAutoCompileStore(
    (state) => state.setAddNodeModalVisible,
  );
  const layers = useAutoCompileStore((state) => state.layers);

  const checkDependencies = () => {
    const allItems = Object.values(layers).flatMap((l) => l.items);
    const checkedIds = new Set(
      allItems.filter((i) => i.checked).map((i) => i.id),
    );

    for (const item of allItems) {
      if (item.checked && DEPENDENCIES[item.id]) {
        for (const depId of DEPENDENCIES[item.id]) {
          if (!checkedIds.has(depId)) {
            return { valid: false, message: `${item.name} 依赖 ${depId}` };
          }
        }
      }
    }
    return { valid: true };
  };

  const { valid, message } = checkDependencies();

  return (
    <div className='flex items-center gap-4'>
      <Button
        onClick={() => setAddNodeModalVisible(true)}
        className='bg-[#4db6ac] text-white hover:!bg-[#26a69a] hover:!text-white border-none'
      >
        添加新节点
      </Button>

      <Tooltip title={!valid ? message : ''}>
        <Button
          type='primary'
          onClick={startCompile}
          loading={isCompiling}
          disabled={!valid}
          className='bg-[#4db6ac] hover:!bg-[#26a69a] border-none disabled:bg-gray-300 disabled:text-gray-500'
        >
          {isCompiling ? '编译中...' : '启动编译'}
        </Button>
      </Tooltip>
    </div>
  );
};

export default HeaderControls;
