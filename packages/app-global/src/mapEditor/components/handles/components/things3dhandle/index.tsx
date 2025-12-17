import { Dropdown, Tooltip } from 'antd';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useSelectionStore } from '../../../../selection/selectionStore';
// 3D 物体操作工具
const Things3dHandle = () => {
  const { startSelection, setStartSelection } = useSelectionStore(
    useShallow((store) => ({
      startSelection: store.startSelection,
      setStartSelection: store.setStartSelection,
    })),
  );
  return (
    <div className='flex flex-col bg-[#1a1a1a] text-white gap-2 p-2 items-center cursor-pointer absolute right-0 top-14 z-10'>
      <Tooltip title='框选' placement='left'>
        <IconifyIcon
          icon='mdi:select'
          className={startSelection ? 'text-[#00d1d1]' : ''}
          size={16}
          onClick={() => setStartSelection(!startSelection)}
        />
      </Tooltip>
      <Tooltip title='生成反向线段' placement='left'>
        <IconifyIcon icon='gravity-ui:arrows-opposite-to-dots' size={16} />
      </Tooltip>
      <Tooltip title='移动选中物体' placement='left'>
        <IconifyIcon icon='mynaui:move' size={16} />
      </Tooltip>
      <Dropdown
        menu={{
          items: [
            {
              label: '偏移复制',
              key: 'copy',
            },
            {
              label: '镜像复制',
              key: 'copySame',
            },
          ],
        }}
      >
        <Tooltip title='复制' placement='left'>
          <IconifyIcon icon='iconamoon:copy' size={16} />
        </Tooltip>
      </Dropdown>
      <Tooltip title='检测曲率' placement='left'>
        <IconifyIcon icon='tdesign:curve' size={16} />
      </Tooltip>
      <Tooltip title='生成轮廓' placement='left'>
        <IconifyIcon icon='ri:shape-line' size={16} />
      </Tooltip>
      <Tooltip title='测量距离' placement='left'>
        <IconifyIcon icon='ri:ruler-2-line' size={16} />
      </Tooltip>
      <Tooltip title='批量修改' placement='left'>
        <IconifyIcon icon='bx:edit' size={16} />
      </Tooltip>
      <Dropdown
        menu={{
          items: [
            {
              label: '点',
              key: 'copy',
            },
            {
              label: '区域',
              key: 'copySame',
            },
          ],
        }}
      >
        <Tooltip title='连通性检测' placement='left'>
          <IconifyIcon icon='teenyicons:curved-connector-outline' size={16} />
        </Tooltip>
      </Dropdown>
    </div>
  );
};
export default Things3dHandle;
