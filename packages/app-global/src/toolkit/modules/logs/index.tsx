import { Badge, Button, Drawer, List } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import useDrawerClassName from '../../../hooks/useDrawerClassName';
import NodeLogs from './components/nodeLogs';

const useStyles = createStyles(({ css, token }) => ({
  tree: css`
    background-color: transparent;
    .ant-tree-treenode {
      width: 100% !important;
      background-color: #424d5f;
      padding: 8px 0px;
    }
    .ant-tree-switcher-leaf-line:before,
    .ant-tree-switcher-leaf-line:after,
    .ant-tree-indent-unit:before,
    .ant-tree-indent-unit:after {
      border-inline-end: 1px solid ${token.colorPrimary};
      border-bottom: 1px solid ${token.colorPrimary};
      display: none;
    }
  `,
  dot: css`
    .ant-badge-status-dot {
      width: 10px !important;
      height: 10px !important;
    }
  `,
}));

const About = () => {
  const { t } = useTranslation();
  const { styles } = useStyles();
  const theme = useTheme();
  const [openLogs, setLogsOpen] = useState(false);
  const [openNodeLogs, setOpenNodeLogs] = useState(false);
  const classNames = useDrawerClassName();

  // 在组件中添加状态管理当前加载的节点
  const [loadingNode, setLoadingNode] = useState<string | null>(null);
  const nodesData = [
    {
      title: 'mwrobot_driver_h7',
      time: '2025-07-24T10:36:16+08:00',
      version: '20240730-R',
      status: 1,
      cpu: 6,
      memory: 4.5,
    },
    {
      title: 'mwrobot_driver_canbus',
      time: '2025-07-24T10:36:16+08:00',
      version: '20240730-R',
      status: 1,
      cpu: 104,
      memory: 12,
    },
    {
      title: 'mwrobot_interactor_rcs_final',
      time: '2025-07-24T10:36:16+08:00',
      version: '20240730-R',
      status: 0,
      cpu: 42,
      memory: 32,
    },
    {
      title: 'mwrobot_controller_action_executor',
      time: '2025-07-24T10:36:16+08:00',
      version: '20240730-R',
      status: 0,
      cpu: 2,
      memory: 1,
    },
    {
      title: 'mwrobot_controller_motion',
      time: '2025-07-24T10:36:16+08:00',
      version: '20240730-R',
      status: 1,
      cpu: 21,
      memory: 3,
    },
    {
      title: 'mwrobot_controller_safety',
      time: '2025-07-24T10:36:16+08:00',
      version: '20240730-R',
      status: 0,
      cpu: 2,
      memory: 1,
    },
    {
      title: 'mwrobot_controller_motion',
      time: '2025-07-24T10:36:16+08:00',
      version: '20240730-R',
      status: 1,
      cpu: 103,
      memory: 10,
    },
    {
      title: 'mwrobot_controller_safety',
      time: '2025-07-24T10:36:16+08:00',
      version: '20240730-R',
      status: 0,
      cpu: 2,
      memory: 1,
    },
  ];
  return (
    <div className='flex flex-col h-full p-4 gap-4 '>
      <div className=' flex gap-4 items-center flex-1 overflow-y-auto'>
        <div className='relative h-full p-2 rounded-md bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden flex flex-col w-full gap-4'>
          <div className='w-full'>
            <h2 className='text-lg font-bold mb-1'>
              {t('common.about.nodes')}{' '}
            </h2>
            <motion.div
              className='!w-full h-px'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div
                className='w-full h-full'
                style={{
                  background:
                    'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
                }}
              />
            </motion.div>
          </div>
          <div className='flex-1 overflow-y-auto w-full'>
            <List
              className='w-full'
              itemLayout='horizontal'
              dataSource={nodesData}
              renderItem={(item, index) => (
                <List.Item
                  classNames={{
                    actions: '!ml-4',
                  }}
                  actions={[
                    <Button
                      type='primary'
                      // loading={loadingNode === item.title}
                      onClick={() => {
                        setOpenNodeLogs(true);
                      }}
                    >
                      {t('common.about.viewlog')}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className='flex items-center gap-2 justify-between'>
                        <div className='px-1 flex items-center gap-4'>
                          <div className='px-1 flex items-center gap-4'>
                            {item.status ? (
                              <Badge
                                status='processing'
                                className={styles.dot}
                                color={theme.colorPrimary}
                              />
                            ) : (
                              <Badge className={styles.dot} status='default' />
                            )}
                            {item.title}
                          </div>
                          <div className='flex items-center gap-2'>
                            <span
                              className='flex items-center gap-1'
                              style={{
                                color:
                                  item.cpu > 80
                                    ? theme.colorError
                                    : item.cpu > 40
                                    ? theme.colorWarning
                                    : theme.colorText,
                              }}
                            >
                              <SvgIcon name={'cpu'} size={16} /> {item.cpu}%
                            </span>
                            <span className='flex items-center gap-1'>
                              <SvgIcon name={'memory'} size={16} />{' '}
                              {item.memory}%
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                    description={
                      <div className='flex items-center gap-2 ml-8'>
                        <span>{item.time}</span>
                        <span>{item.version}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
      <Drawer
        closable
        destroyOnHidden
        title={
          <p>
            {loadingNode} {t('common.about.log')}
          </p>
        }
        placement='right'
        open={openNodeLogs}
        loading={false}
        classNames={{
          body: '!p-0',
        }}
        width={'100%'}
        onClose={() => setOpenNodeLogs(false)}
      >
        <NodeLogs />
      </Drawer>
    </div>
  );
};

export default About;
