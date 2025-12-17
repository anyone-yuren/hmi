import { SearchOutlined } from '@ant-design/icons';
import { Dropdown, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IconifyIcon } from 'ui';
import TemplateManagement from './components/TemplateManagement';
function vanillaToggleFullscreen() {
  const isFullscreen = !!document.fullscreenElement;

  if (isFullscreen) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}
const TopPanel = () => {
  const location = useLocation();
  const mapEditorSearch = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);

  // 键盘ctrl + F 打开搜索框
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      mapEditorSearch.current?.focus();
    }
  };
  // 监听键盘事件
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <div className='w-full flex items-center justify-between text-white'>
      <div className={location.pathname === '/' ? 'hidden' : 'flex items-center gap-2 text-xs font-bold'}>
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              { label: '新建', key: 1 },
              { label: '打开', key: 2 },
              { label: '保存', key: 3 },
            ],
          }}
        >
          <div className='flex items-center gap-1'>
            <span>文件</span>
          </div>
        </Dropdown>
        <Dropdown
          menu={{
            items: [
              {
                label: '导出',
                key: 1,
                children: [
                  { label: '导出为(.zar)', key: 1 },
                  { label: '导出为(.zip)', key: 2 },
                ],
              },
              { label: '重做', key: 2 },
              { label: '调度服务器', key: 3 },
              { label: '更新数据库', key: 4 },
              { label: '合并地图', key: 5 },
            ],
          }}
        >
          <div className='flex items-center gap-1'>
            <span>编辑</span>
          </div>
        </Dropdown>
        {location.pathname.includes('mapEditor') ? (
          <>
            <span className='cursor-pointer' onClick={() => setVisible(true)}>
              模板管理
            </span>
            <Dropdown
              menu={{
                items: [
                  {
                    label: '显示',
                    key: 1,
                    children: [
                      { label: '点设置', key: 1 },
                      { label: '路径线设置', key: 2 },
                      { label: '面设置', key: 3 },
                    ],
                  },
                  { label: '通用属性', key: 2 },
                ],
              }}
            >
              <span>设置</span>
            </Dropdown>
          </>
        ) : null}
      </div>
      <div className={location.pathname === '/models' ? '' : 'hidden'}>
        <Select
          prefix={<SearchOutlined />}
          size='small'
          className='min-w-[400px]'
          placeholder='快速检索'
          showSearch
          options={[
            {
              value: '1',
              label: '雷达标定',
            },
            {
              value: '2',
              label: '调度服务器设置',
            },
            {
              value: '3',
              label: '车辆参数设置',
            },
            {
              value: '4',
              label: '避障设置',
            },
            {
              value: '5',
              label: '视觉参数',
            },
            {
              value: '6',
              label: '定位参数',
            },
          ]}
          optionRender={(option) => (
            <div className='flex items-center justify-between'>
              <span>{option.data.label}</span>
              <IconifyIcon icon='fluent:arrow-turn-right-up-20-filled' size={14} className='opacity-40' />
            </div>
          )}
        ></Select>
      </div>
      <div className={location.pathname === '/mapEditor' ? '' : 'hidden'}>
        <Select
          ref={mapEditorSearch}
          prefix={<SearchOutlined />}
          size='small'
          className='min-w-[400px]'
          placeholder='搜索路径点/路径线'
          showSearch
          options={[]}
          optionRender={(option) => (
            <div className='flex items-center justify-between'>
              <span>{option.data.label}</span>
              <IconifyIcon icon='fluent:arrow-turn-right-up-20-filled' size={14} className='opacity-40' />
            </div>
          )}
        ></Select>
      </div>
      <div className='flex items-center gap-2 font-bold'>
        <IconifyIcon icon='mynaui:minus-solid' size={20} className='opacity-80' />
        <IconifyIcon icon='ion:resize' size={20} className='opacity-80' onClick={vanillaToggleFullscreen} />
        <IconifyIcon icon='ic:baseline-close' size={20} className='opacity-80' />
      </div>
      <TemplateManagement open={visible} onClick={() => setVisible(false)} />
    </div>
  );
};
export default TopPanel;
