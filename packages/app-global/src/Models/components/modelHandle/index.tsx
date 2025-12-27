import { Dropdown, Select } from 'antd';
import { useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { IconifyIcon } from 'ui';

const DrawHandle = () => {
  const theme = useTheme();
  return (
    <div className='top-0 left-0 w-full  bg-[#1a1a1a] z-20 absolute font-bold overflow-x-auto overflow-y-hidden whitespace-nowrap'>
      <div className='flex min-w-max py-1 items-center justify-between gap-2'>
        <div className='flex gap-2 items-center justify-between'>
          <div className='flex gap-2 items-center px-2'>
            <div className='flex items-center gap-1'>
              <span>切换车辆</span>
              <Select
                className='min-w-32'
                size='small'
                options={[
                  {
                    label: (
                      <div className='flex items-center gap-1'>
                        <motion.div
                          className='inline-block w-2 h-2 rounded-full mr-1'
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.35, 0.95, 0.35],
                          }}
                          style={{
                            backgroundColor: theme.colorSuccess,
                          }}
                          transition={{
                            duration: 1.5,
                            ease: 'easeInOut',
                            repeat: Infinity,
                          }}
                        />
                        <IconifyIcon icon='mingcute:car-2-fill' size={14} />
                        车辆1
                      </div>
                    ),
                    value: '1',
                  },
                  {
                    label: (
                      <div className='flex items-center gap-1'>
                        <motion.div
                          className='inline-block w-2 h-2 rounded-full mr-1'
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.35, 0.95, 0.35],
                          }}
                          style={{
                            backgroundColor: theme.colorError,
                          }}
                          transition={{
                            duration: 1.5,
                            ease: 'easeInOut',
                            repeat: Infinity,
                          }}
                        />
                        <IconifyIcon icon='mingcute:car-2-fill' size={14} />
                        车辆2
                      </div>
                    ),
                    value: '2',
                  },
                  {
                    label: (
                      <div className='flex items-center gap-1'>
                        <motion.div
                          className='inline-block w-2 h-2 rounded-full mr-1'
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.35, 0.95, 0.35],
                          }}
                          style={{
                            backgroundColor: theme.colorSuccess,
                          }}
                          transition={{
                            duration: 1.5,
                            ease: 'easeInOut',
                            repeat: Infinity,
                          }}
                        />
                        <IconifyIcon icon='mingcute:car-2-fill' size={14} />
                        车辆3
                      </div>
                    ),
                    value: '3',
                  },
                ]}
              />
            </div>
          </div>
          <div className='h-full flex justify-center gap-1 items-center'>
            <IconifyIcon icon='icon-park-outline:nine-points-connected' size={14} />
            <span className=' font-semibold'>偏移表</span>
          </div>
          <div className='h-full flex justify-center gap-1 items-center'>
            <IconifyIcon icon='mingcute:plugin-2-fill' size={16} />
            <span className=' font-semibold'>插件配置</span>
          </div>
          <div className='h-full flex justify-center gap-1 items-center'>
            <IconifyIcon icon='mingcute:location-3-fill' size={16} />
            <span className=' font-semibold'>导航</span>
          </div>
          <div className='h-full flex justify-center gap-1 items-center'>
            <IconifyIcon icon='carbon:document-configuration' size={16} />
            <span className=' font-semibold'>参数配置</span>
          </div>
          <div className='h-full flex justify-center gap-1 items-center'>
            <IconifyIcon icon='fluent:tap-single-20-filled' size={16} />
            <span className=' font-semibold'>单机任务</span>
          </div>
          <div className='h-full flex justify-center gap-1 items-center'>
            <IconifyIcon icon='fluent:cloud-sync-28-filled' size={16} />
            <span className=' font-semibold'>云服务</span>
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
            <IconifyIcon
              icon='mynaui:save'
              size={16}
              style={{
                color: theme.colorWarning,
              }}
            />
            <span>保存</span>
          </div>
          <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
            <IconifyIcon
              icon='icon-park-outline:back'
              size={16}
              style={{
                color: theme.colorError,
              }}
            />
            <span>撤销</span>
          </div>
          <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
            <IconifyIcon
              icon='uil:sync'
              size={16}
              style={{
                color: theme.colorSuccess,
              }}
            />
            <span>同步到车辆</span>
          </div>

          <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
            <IconifyIcon icon='tdesign:file-import' size={14} />
            <span>导入</span>
          </div>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { label: '本地(.zar)', key: 5 },
                { label: '本地(.zip)', key: 6 },
                { label: '调度(.zar)', key: 7 },
              ],
            }}
          >
            <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
              <IconifyIcon icon='mingcute:file-export-line' size={16} />
              <span>导出</span>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default DrawHandle;
