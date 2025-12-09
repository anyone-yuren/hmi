import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Dropdown, Segmented, Space, Tooltip } from 'antd';
import { createStyles, useAntdToken } from 'antd-style';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { GlowingCard, IconifyIcon } from 'ui';
import CardHover from './CarHover';

const useStyles = createStyles(({ token }) => ({
  dropdown: {
    '.ant-dropdown-menu-submenu-title': {
      alignItems: 'center',
    },
  },
}));

const getImage = (imageName: string) => {
  return new URL(`../vehicles/${imageName}`, import.meta.url).href;
};

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};
const VehiclesManagement = () => {
  const token = useAntdToken();
  const { styles } = useStyles();

  const [showGroup, setShowGroup] = useState(false); // 👈 新增：分组抽屉开关

  const vehicles = [
    { id: 'V001', name: '车辆1', status: '在线', type: 'MW_K16.png', no: 'KW-25046', group: '成品区' },
    { id: 'V002', name: '车辆2', status: '离线', type: 'MW_L14.png', no: 'KW-25047', group: '补品区' },
    { id: 'V003', name: '车辆3', status: '在线', type: 'MW_L14.png', no: 'KW-25048', group: '补品区' },
    { id: 'V004', name: '车辆4', status: '维护中', type: 'MW_SE20.png', no: 'KW-25049', group: '补品区' },
    { id: 'V005', name: '车辆5', status: '在线', type: 'MW_SL14.png', no: 'KW-25050', group: '补品区' },
    { id: 'V006', name: '车辆6', status: '离线', type: 'MW_SE15.png', no: 'KW-25051', group: '成品区' },
    { id: 'V007', name: '车辆7', status: '在线', type: 'MW_X20.png', no: 'KW-25052', group: '补品区' },
    { id: 'V008', name: '车辆8', status: '维护中', type: 'MW_O20.png', no: 'KW-25053', group: '补品区' },
  ];

  const [selectVehicles, setSelectVehicles] = useState<any[]>(vehicles);
  const [selectGroupName, setSelectGroupName] = useState<string>('');

  const selectGroup = (group: string) => {
    // 这里可以实现分组筛选逻辑
    if (!group) return vehicles;
    return vehicles.filter((v) => v.group === group);
  };

  return (
    <div className='flex gap-2 flex-col'>
      <div className='flex items-center justify-between'>
        <Button
          icon={<AppstoreOutlined />}
          onClick={() => setShowGroup((s) => !s)} // 👈 点击切换
        >
          分组
        </Button>

        <div className='flex items-center gap-2'>
          <Button icon={<PlusOutlined />}>新增</Button>
          <Segmented
            options={[
              {
                value: 'List',
                icon: (
                  <Tooltip title='状态'>
                    <IconifyIcon icon='grommet-icons:status-good' size={16} />
                  </Tooltip>
                ),
              },
              {
                value: 'Kanban',
                icon: (
                  <Tooltip title='IP'>
                    <IconifyIcon icon='ri:sort-desc' size={16} />
                  </Tooltip>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* 内容区：左侧面板 + 网格 */}
      <div className='flex gap-2 w-full relative overflow-hidden'>
        {/* ✨✨ 左侧滑出面板（使用 framer-motion） */}
        <AnimatePresence>
          {showGroup && (
            <motion.div
              key='group-panel'
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className='absolute left-0 top-0 bottom-0 w-60 bg-white/5 backdrop-blur-md p-4 rounded-md shadow-lg'
            >
              <div className='font-medium mb-2 flex items-center justify-between'>
                <span>分组面板</span>
                <Button size='small' shape='round' icon={<PlusOutlined />}></Button>
              </div>

              {/* 你可以放分组内容 */}
              <div className='flex flex-col gap-2 group/cards'>
                <div
                  className={
                    selectGroupName === '成品区'
                      ? 'bg-[#00D1D1]/20 rounded-md'
                      : 'group-hover/cards:blur-sm group-hover/cards:scale-95 hover:!blur-0 hover:!scale-102 transition-all'
                  }
                  onClick={() => {
                    setSelectGroupName('成品区');
                    setSelectVehicles(selectGroup('成品区'));
                  }}
                >
                  <CardHover bgColor='bg-[#00D1D1]/80'>
                    <div className='flex flex-col w-full gap-2'>
                      <div className='flex items-center justify-between'>
                        <p>成品区组</p>
                        <Dropdown
                          menu={{
                            items: [
                              { label: '编辑', key: 'edit' },
                              { label: '删除', key: 'delete' },
                              { label: '批量修改参数', key: 'add' },
                              {
                                label: '批量导入',
                                key: 'import',
                                children: [
                                  {
                                    label: '导入',
                                    key: 'import',
                                  },
                                ],
                              },
                              {
                                label: '批量导出',
                                key: 'export',
                                children: [
                                  {
                                    label: '导出',
                                    key: 'export',
                                  },
                                ],
                              },
                            ],
                          }}
                        >
                          <IconifyIcon icon='ant-design:more-outlined' size={16} />
                        </Dropdown>
                      </div>
                      <div className='text-sm text-gray-400 group-hover/cards:text-white flex items-center gap-2'>
                        <p>状态：</p>
                        <Space split={<Divider type='vertical' />}>
                          <Badge status='success' text='4' />
                          <Badge status='error' text='1' />
                          <Badge status='default' text='2' />
                        </Space>
                      </div>
                    </div>
                  </CardHover>
                </div>
                <div
                  className={
                    selectGroupName === '补品区'
                      ? 'bg-[#00D1D1]/20 rounded-md'
                      : 'group-hover/cards:blur-sm group-hover/cards:scale-95 hover:!blur-0 hover:!scale-102 transition-all'
                  }
                  onClick={() => {
                    setSelectGroupName('补品区');
                    setSelectVehicles(selectGroup('补品区'));
                  }}
                >
                  <CardHover bgColor='bg-[#00D1D1]/80'>
                    <div className='flex flex-col w-full gap-2'>
                      <div className='flex items-center justify-between'>
                        <p>补品区组</p>
                        <Dropdown
                          menu={{
                            items: [
                              { label: '编辑', key: 'edit' },
                              { label: '删除', key: 'delete' },
                              { label: '批量修改参数', key: 'add' },
                              {
                                label: '批量导入',
                                key: 'import',
                                children: [
                                  {
                                    label: '导入',
                                    key: 'import',
                                  },
                                ],
                              },
                              {
                                label: '批量导出',
                                key: 'export',
                                children: [
                                  {
                                    label: '导出',
                                    key: 'export',
                                  },
                                ],
                              },
                            ],
                          }}
                        >
                          <IconifyIcon icon='ant-design:more-outlined' size={16} />
                        </Dropdown>
                      </div>
                      <div className='text-sm text-gray-400 group-hover/cards:text-white flex items-center gap-2'>
                        <p>状态：</p>
                        <Space split={<Divider type='vertical' />}>
                          <Badge status='success' text='4' />
                          <Badge status='error' text='1' />
                          <Badge status='default' text='2' />
                        </Space>
                      </div>
                    </div>
                  </CardHover>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 右侧主内容（自动让出左侧宽度） */}
        <div className={`transition-all duration-300 flex-1 ease-out ${showGroup ? 'ml-62' : 'ml-0'}`}>
          <div className='grid grid-cols-4 gap-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-2'>
            {/* ... 车卡片渲染（原样保持） */}
            <AnimatePresence>
              {selectVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                    ease: 'easeOut',
                  }}
                >
                  <GlowingCard title={vehicle.name}>
                    <div className='flex flex-col group'>
                      <div className='flex items-center gap-2'>
                        <span className='bg-red-500 opacity-0 group-hover:opacity-70  group-hover:pointer-events-auto pointer-events-none transition-all duration-300 ease-in rounded-full cursor-pointer hover:bg-red-700 hover:opacity-100 flex items-center justify-center p-0.5'>
                          <IconifyIcon icon='mynaui:minus-solid' size={10} />
                        </span>
                      </div>

                      <div className='flex-1 overflow-hidden'>
                        <img
                          src={getImage(vehicle.type)}
                          alt={vehicle.name}
                          className='w-full h-32 object-contain mb-2 transition-transform duration-300 ease-in-out transform hover:scale-110'
                        />
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>车号：{vehicle.no}</div>
                        <div className='flex items-center gap-2'>
                          <motion.div
                            className='inline-block w-2 h-2 rounded-full mr-1'
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.35, 0.95, 0.35],
                            }}
                            style={{
                              backgroundColor: vehicle.status === '在线' ? token.colorSuccess : token.colorError,
                            }}
                            transition={{
                              duration: 1.5,
                              ease: 'easeInOut',
                              repeat: Infinity,
                            }}
                          />
                          {vehicle.status}

                          <Tooltip title='工具'>
                            <Button size='small' icon={<IconifyIcon icon='si:hammer-duotone' size={14} />} />
                          </Tooltip>

                          <Dropdown
                            trigger={['click']}
                            className={styles.dropdown}
                            menu={{
                              items: [
                                {
                                  key: '1',
                                  label: '复制',
                                  disabled: vehicle.status !== '在线',
                                  icon: <IconifyIcon icon='mdi:content-copy' size={16} />,
                                },
                                {
                                  key: '2',
                                  label: '删除',
                                  icon: <IconifyIcon icon='lsicon:delete-outline' size={16} />,
                                },
                                {
                                  key: '3',
                                  label: '禁用',
                                  icon: <IconifyIcon icon='lsicon:disable-outline' size={16} />,
                                },
                                {
                                  key: '4',
                                  label: '移动到',
                                  icon: <IconifyIcon icon='fluent:send-32-regular' size={16} />,
                                  children: [
                                    { key: '2-1', label: '成品区' },
                                    { key: '2-2', label: '测试区' },
                                  ],
                                },
                              ],
                            }}
                          >
                            <Button size='small' variant='link'>
                              <IconifyIcon icon='ri:more-line' size={16} />
                            </Button>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </GlowingCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesManagement;
