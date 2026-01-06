import { animated, useSpring } from '@react-spring/web';
import { useSize } from 'ahooks';
import { Button, Checkbox, Dropdown, Empty, Form, Input, List } from 'antd';
import VirtualList from 'rc-virtual-list';
import React, { useEffect, useRef, useState } from 'react';
import { IconifyIcon, SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../store';
import { AreaData, useAreaStore } from '../../../three/components/drawArea/store/areaStore';
import DrawPointsParamsPanel from '../../drawPoints/components/paramspanel';
const { Search } = Input;

interface UserItem {
  id: string;
  position: THREE.Vector3;
}

const CONTAINER_HEIGHT = 400;

const AreaList: React.FC = () => {
  const [panelVisible, setPanelVisible] = useState(false);
  const panelSpring = useSpring({
    transform: panelVisible ? 'translateX(0%)' : 'translateX(100%)',
    opacity: panelVisible ? 1 : 0,
    config: {
      tension: 220,
      friction: 26,
    },
  });
  const { setMode, areas, clearAreas } = useAreaStore(
    useShallow((store) => ({ setMode: store.setMode, areas: store.areas, clearAreas: store.clearAreas })),
  );
  const { staticPoints, flyToPoint, setFlyToPoint, setStaticPoints } = useMapEditorStore(
    useShallow((state) => ({
      staticPoints: state.staticPoints,
      flyToPoint: state.flyToPoint,
      setFlyToPoint: state.setFlyToPoint,
      setStaticPoints: state.setStaticPoints,
    })),
  );
  console.log(areas);
  const pointClick = (item: AreaData) => {
    setFlyToPoint(item.center);
  };
  const listRef = useRef<HTMLDivElement>(null);
  const listSize = useSize(listRef);
  const [data, setData] = useState<AreaData[]>(areas as AreaData[]);
  useEffect(() => {
    setData(areas as AreaData[]);
  }, [areas]);
  return (
    <div className='h-full flex flex-col gap-2'>
      <div className='bg-white/5 rounded-sm'>
        <p className='text-xs font-medium flex items-center px-2 gap-2 justify-between'>
          <span className='flex items-center gap-1 text-xs font-medium text-nowrap'>
            <IconifyIcon icon='gis:polygon-hole-pt' size={16} /> 区域列表
          </span>
          <div className='flex items-center gap-1 justify-end'>
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
                    label: '公用属性',
                    key: 'import',
                  },
                  {
                    label: '导出',
                    key: 'export',
                  },
                  {
                    label: '删除全部',
                    key: 'delete',
                    onClick: (e) => {
                      clearAreas();
                    },
                  },
                ],
              }}
            >
              <Button
                shape='circle'
                size='small'
                type='text'
                icon={<IconifyIcon icon='mingcute:more-2-fill' size={16} />}
              ></Button>
            </Dropdown>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    label: '普通点',
                    key: 'normal',
                    icon: <Checkbox />,
                  },
                  {
                    label: '库位点',
                    key: 'library',
                    icon: <Checkbox />,
                  },
                  {
                    label: '待命点',
                    key: 'standby',
                    icon: <Checkbox />,
                  },
                  {
                    label: '充电点',
                    key: 'charge',
                    icon: <Checkbox />,
                  },
                ],
              }}
            >
              <Button
                // shape='circle'
                size='small'
                type='text'
                icon={<IconifyIcon icon='stash:filter' size={16} />}
              ></Button>
            </Dropdown>
          </div>
        </p>
      </div>
      <Button onClick={() => setMode('draw-area')}>添加区域</Button>
      <div className='flex-1 overflow-hidden relative' ref={listRef}>
        <animated.div
          style={{
            ...panelSpring,
            pointerEvents: panelVisible ? 'auto' : 'none',
          }}
          className='absolute top-0 left-0 w-full h-full bg-[#313131] z-10 flex flex-col '
        >
          <p className='flex items-center justify-between text-xs font-medium px-2 pt-2'>
            <span>点属性</span>
            <IconifyIcon icon='line-md:close' size={16} onClick={() => setPanelVisible(false)} />
          </p>
          <div>
            <Form
              className='px-2 pt-2'
              name='basic'
              size='small'
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 24 }}
              style={{ maxWidth: 600 }}
            >
              <Form.Item name='id' label='点ID'>
                <Input />
              </Form.Item>
              <Form.Item name='position' label='位置'>
                <Input />
              </Form.Item>
            </Form>
          </div>
          <DrawPointsParamsPanel />
        </animated.div>
        {data.length ? (
          <List size='small' className='px-2'>
            <VirtualList data={data} height={listSize?.height || CONTAINER_HEIGHT} itemHeight={47} itemKey='id'>
              {(item: AreaData) => (
                <List.Item
                  key={item.id}
                  className='hover:bg-white/5 cursor-pointer active:bg-white/10'
                  title={JSON.stringify(item.center)}
                  onClick={() => pointClick(item)}
                  actions={[
                    <div className='flex items-center gap-1'>
                      <IconifyIcon
                        icon='mingcute:delete-2-fill'
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStaticPoints(staticPoints.filter((p) => p.id !== item.id));
                        }}
                      />
                      <IconifyIcon
                        icon='line-md:edit'
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPanelVisible(true);
                        }}
                      />
                    </div>,
                  ]}
                >
                  <div>{item.id}</div>
                </List.Item>
              )}
            </VirtualList>
          </List>
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <Empty
              image={<SvgIcon name='ic_content' size={180} />}
              styles={{
                image: {
                  height: 'auto',
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaList;
