import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../store';
import { useMapEditorViewStore } from '../../store/view';
import DrawDeviceParamsPanel from '../handles/components/draw/components/device/paramspanel';
import DrawNavigationParamsPanel from '../handles/components/draw/components/navigation/paramspanel';
import LineList from './components/lineList';
import PanelTab from './components/panelTab';
import PointList from './components/pointList';
const { Search } = Input;
const ParamsPanel = () => {
  const { paramsPanelCollapsed, selectDrawType } = useMapEditorStore(
    useShallow((state) => {
      return {
        paramsPanelCollapsed: state.paramsPanelCollapsed,
        selectDrawType: state.selectDrawType,
      };
    }),
  );
  const { selectFloor, setSelectFloor, setShowMapEditor } = useMapEditorViewStore(
    useShallow((state) => ({
      selectFloor: state.selectFloor,
      setSelectFloor: state.setSelectFloor,
      setShowMapEditor: state.setShowMapEditor,
    })),
  );
  const mapData = [
    {
      img: '/static/floor/map-1.png',
      width: 2571,
      height: 2431,
      name: 'map-1',
      key: 'map-1',
    },
    {
      img: '/static/floor/map-2.png',
      width: 7956,
      height: 5287,
      name: 'map-2',
      key: 'map-2',
    },
  ];
  return (
    <motion.div
      animate={{
        width: !paramsPanelCollapsed ? 0 : 400,
        opacity: !paramsPanelCollapsed ? 0 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 24,
      }}
      className='bg-white/5 overflow-hidden flex flex-col gap-2'
    >
      <div className=''>
        <div className='bg-white/5 rounded-sm p-2 min-h-40'>
          <p className='text-xs font-medium flex items-center gap-2 justify-between'>
            <span className='flex items-center gap-1 text-xs font-medium text-nowrap'>
              <IconifyIcon icon='subway:folder-2' size={16} /> 楼层列表
            </span>
            <div className='flex items-center gap-2 justify-end'>
              <Search
                style={{ marginBottom: 0, width: 'auto', maxWidth: '50%' }}
                size='small'
                placeholder='Search'
                className='!max-w-1/2 w-auto'
              />
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    {
                      label: '导入',
                      key: 'import',
                      children: [
                        {
                          label: '车辆',
                          key: 'importMap',
                        },
                        {
                          label: '本地',
                          key: 'importNavigation',
                        },
                      ],
                    },
                    {
                      label: '导出',
                      key: 'export',
                    },
                    {
                      label: '清空',
                      key: 'clear',
                      onClick: () => {
                        setShowMapEditor(false);
                      },
                    },
                  ],
                }}
              >
                <Button
                  shape='circle'
                  size='small'
                  type='text'
                  icon={
                    <MoreOutlined
                      style={{
                        fontSize: '16px',
                      }}
                    />
                  }
                ></Button>
              </Dropdown>
            </div>
          </p>
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <div className='flex items-center justify-between'>
                      复制
                      <span className='text-xs font-medium text-gray-400 flex items-center gap-1'>
                        <IconifyIcon icon='mingcute:command-line' size={12} />c
                      </span>
                    </div>
                  ),
                  key: 'copy',
                },
                { label: <span>删除</span>, key: 'delete' },
                { label: <span>选择</span>, key: 'add' },
              ],
            }}
            trigger={['contextMenu']}
          >
            <ul className='flex flex-col gap-2 text-xs py-2'>
              {mapData.map((item, index) => {
                return (
                  <li
                    className={classNames(
                      'cursor-pointer hover:bg-cyan-500/30 px-2 py-0.5 flex items-center justify-between',
                      {
                        'bg-white/5': index % 2 === 0,
                        '!bg-[#00d1d1]/80 !text-black': selectFloor === item.key,
                      },
                    )}
                    key={item.key}
                    onClick={() => setSelectFloor(item.key)}
                  >
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </Dropdown>
        </div>
      </div>
      <div className='flex-1 flex overflow-hidden'>
        <div>
          <PanelTab />
        </div>
        <div className='flex-1 h-full overflow-auto bg-white/15'>
          {/* {selectDrawType === 'point' && <DrawPointsParamsPanel />} */}
          {selectDrawType === 'point' && <PointList />}
          {/* {(selectDrawType === 'line' || selectDrawType === 'bspline') && <DrawLinesParamsPanel />} */}
          {(selectDrawType === 'line' || selectDrawType === 'bspline') && <LineList />}
          {selectDrawType === 'device' && <DrawDeviceParamsPanel />}
          {selectDrawType === 'navigation' && <DrawNavigationParamsPanel />}
        </div>
      </div>
    </motion.div>
  );
};

export default ParamsPanel;
