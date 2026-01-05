import { Dropdown, Tooltip } from 'antd';
import classNames from 'classnames';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useSelectionStore } from '../../../../selection/selectionStore';
// 3D 物体操作工具
const Things3dHandle = () => {
  const { startSelection, setStartSelection, selectTool, setSelectTool } = useSelectionStore(
    useShallow((store) => ({
      startSelection: store.startSelection,
      setStartSelection: store.setStartSelection,
      selectTool: store.selectTool,
      setSelectTool: store.setSelectTool,
    })),
  );
  return (
    <div className='flex flex-col bg-[#1a1a1a] text-white gap-2 p-2 items-center cursor-pointer absolute right-0 top-14 z-10'>
      <Tooltip title='框选' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
        <IconifyIcon
          icon='mdi:select'
          className={classNames(
            'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
            { 'text-white bg-cyan-600': startSelection },
          )}
          size={16}
          onClick={() => setStartSelection(!startSelection)}
        />
      </Tooltip>
      <Tooltip title='生成反向线段' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
        <IconifyIcon
          icon='gravity-ui:arrows-opposite-to-dots'
          size={16}
          className={classNames(
            'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
            { 'text-white bg-cyan-600': selectTool === 'reverse' },
          )}
        />
      </Tooltip>
      <Tooltip title='移动选中物体' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
        <IconifyIcon
          icon='mynaui:move'
          size={16}
          className={classNames(
            'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
            { 'text-white bg-cyan-600': selectTool === 'move' },
          )}
        />
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
        <Tooltip title='复制' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
          <IconifyIcon
            icon='iconamoon:copy'
            size={16}
            className={classNames(
              'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
            )}
          />
        </Tooltip>
      </Dropdown>
      <Tooltip title='检测曲率' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
        <IconifyIcon
          icon='tdesign:curve'
          size={16}
          className={classNames(
            'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
            { 'text-white bg-cyan-600': selectTool === 'curve' },
          )}
        />
      </Tooltip>
      <Tooltip title='生成轮廓' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
        <IconifyIcon
          icon='ri:shape-line'
          size={16}
          className={classNames(
            'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
            { 'text-white bg-cyan-600': selectTool === 'contour' },
          )}
        />
      </Tooltip>
      <Tooltip title='测量距离' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
        <IconifyIcon
          icon='ri:ruler-2-line'
          size={16}
          className={classNames(
            'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
            { 'text-white bg-cyan-600': selectTool === 'measure' },
          )}
        />
      </Tooltip>
      <Tooltip title='批量修改' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
        <IconifyIcon
          icon='bx:edit'
          size={16}
          className={classNames(
            'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
            { 'text-white bg-cyan-600': selectTool === 'batch' },
          )}
        />
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
        <Tooltip title='连通性检测' placement='left' mouseLeaveDelay={0} mouseEnterDelay={0.6} destroyOnHidden>
          <IconifyIcon
            icon='teenyicons:curved-connector-outline'
            size={16}
            className={classNames(
              'hover:text-cyan-400 active:bg-cyan-600 active:text-white transition-all duration-100',
              { 'text-white bg-cyan-600': selectTool === 'connectivity' },
            )}
          />
        </Tooltip>
      </Dropdown>
    </div>
  );
};
export default Things3dHandle;
