import { SearchOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { IconifyIcon } from 'ui';

const TopPanel = () => {
  return (
    <div className='w-full flex items-center justify-between'>
      <div></div>
      <div>
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
      <div className='flex items-center gap-2 font-bold'>
        <IconifyIcon icon='mynaui:minus-solid' size={20} className='opacity-80' />
        <IconifyIcon icon='ion:resize' size={20} className='opacity-80' />
        <IconifyIcon icon='ic:baseline-close' size={20} className='opacity-80' />
      </div>
    </div>
  );
};
export default TopPanel;
