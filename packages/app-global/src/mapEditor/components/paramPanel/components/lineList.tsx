import { animated, useSpring } from '@react-spring/web';
import { useSize } from 'ahooks';
import { Button, Checkbox, Dropdown, Empty, Form, Input, List } from 'antd';
import VirtualList from 'rc-virtual-list';
import React, { useEffect, useRef, useState } from 'react';
import { IconifyIcon, SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../store';
import DrawLinesParamsPanel from '../../drawLine/components/paramspanel';
const { Search } = Input;

interface UserItem {
  id: string;
  position: THREE.Vector3;
}

const LineList: React.FC = () => {
  const [panelVisible, setPanelVisible] = useState(false);
  const panelSpring = useSpring({
    transform: panelVisible ? 'translateX(0%)' : 'translateX(100%)',
    opacity: panelVisible ? 1 : 0,
    config: {
      tension: 220,
      friction: 26,
    },
  });
  const { lineList, flyToPoint, setFlyToPoint, setLineList, setSelectedLineId } = useMapEditorStore(
    useShallow((state) => ({
      lineList: state.lineList,
      flyToPoint: state.flyToPoint,
      setFlyToPoint: state.setFlyToPoint,
      setLineList: state.setLineList,
      setSelectedLineId: state.setSelectedLineId,
    })),
  );
  const pointClick = (item: UserItem) => {
    setFlyToPoint(item?.start);
    setSelectedLineId(Number(item.id));
  };
  const listRef = useRef<HTMLDivElement>(null);
  const listSize = useSize(listRef);
  const [data, setData] = useState<UserItem[]>(lineList as UserItem[]);
  useEffect(() => {
    setData(lineList as UserItem[]);
  }, [lineList]);
  return (
    <div className='h-full flex flex-col gap-2'>
      <div className='bg-white/5 rounded-sm'>
        <p className='text-xs font-medium flex items-center px-2 gap-2 justify-between'>
          <span className='flex items-center gap-1 text-xs font-medium text-nowrap'>
            <IconifyIcon icon='gis:copy-point' size={16} /> 线列表
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
                      setLineList([]);
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
                    label: '直线',
                    key: 'normal',
                    icon: <Checkbox />,
                  },
                  {
                    label: 'B昂条',
                    key: 'bspline',
                    icon: <Checkbox />,
                  },
                  {
                    label: '贝塞尔曲线',
                    key: 'bspline',
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
      <div className='flex-1 overflow-hidden relative' ref={listRef}>
        <animated.div
          style={{
            ...panelSpring,
            pointerEvents: panelVisible ? 'auto' : 'none',
          }}
          className='absolute top-0 left-0 w-full h-full bg-[#313131] z-10 flex flex-col '
        >
          <p className='flex items-center justify-between text-xs font-medium px-2 pt-2'>
            <span>线属性</span>
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
          <DrawLinesParamsPanel />
        </animated.div>
        {data?.length ? (
          <List size='small' className='px-2'>
            <VirtualList data={data} height={listSize?.height || 200} itemHeight={47} itemKey='id'>
              {(item: UserItem) => (
                <List.Item
                  key={item.id}
                  className='hover:bg-white/5 cursor-pointer active:bg-white/10'
                  title={JSON.stringify(item.position)}
                  onClick={() => pointClick(item)}
                  actions={[
                    <div className='flex items-center gap-1'>
                      <IconifyIcon
                        icon='mingcute:delete-2-fill'
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLineList(lineList.filter((p) => p.id !== item.id));
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

export default LineList;
