import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, List } from 'antd';
import VirtualList from 'rc-virtual-list';
import React, { useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../store';
const { Search } = Input;

interface UserItem {
  id: string;
  position: THREE.Vector3;
}

const CONTAINER_HEIGHT = 400;

const App: React.FC = () => {
  const { staticPoints } = useMapEditorStore(
    useShallow((state) => ({
      staticPoints: state.staticPoints,
    })),
  );
  const [data, setData] = useState<UserItem[]>(staticPoints as UserItem[]);
  return (
    <div className='h-full px-2'>
      <div className='bg-white/5 rounded-sm'>
        <p className='text-xs font-medium flex items-center gap-2 justify-between'>
          <span className='flex items-center gap-1 text-xs font-medium text-nowrap'>
            <IconifyIcon icon='gis:copy-point' size={16} /> 点列表
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
                    label: '公用属性',
                    key: 'import',
                  },
                  {
                    label: '导出',
                    key: 'export',
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
      </div>
      <List size='small'>
        <VirtualList data={data} height={CONTAINER_HEIGHT} itemHeight={47} itemKey='id'>
          {(item: UserItem) => (
            <List.Item
              key={item.id}
              className='hover:bg-white/5 cursor-pointer active:bg-white/10'
              title={JSON.stringify(item.position)}
            >
              <div>{item.id}</div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  );
};

export default App;
