import { DownloadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Badge, Button, Drawer, List, Tree, TreeDataNode, Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { DrawerClassNames } from 'antd/es/drawer/DrawerPanel';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { getNodeLogs } from './services';

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

const useDrawerStyles = createStyles(({ token }) => ({
  'my-drawer-body': {
    background: 'transparent',
  },
  'my-drawer-header': {
    background: '#162640',
  },
  'my-drawer-footer': {
    color: token.colorPrimary,
  },
  'my-drawer-content': {
    background: `#162640 !important`,
  },
}));

// Vite环境下获取assets/vehicles目录下的所有图片
const imageModules = import.meta.glob('../assets/vehicles/*', { eager: true });

// 提取文件名
const imageNames = Object.keys(imageModules)
  .map((path) => {
    const match = path.match(/vehicles\/(.*)$/);
    return match ? match[1] : '';
  })
  .filter(Boolean);

// 获取图片函数
const getImage = (imageName: string) => {
  return new URL(`../assets/vehicles/${imageName}`, import.meta.url).href;
};

const About = () => {
  const { t } = useTranslation();
  const { styles } = useStyles();
  const { styles: drawerStyles } = useDrawerStyles();
  const theme = useTheme();
  const [openLogs, setLogsOpen] = useState(false);
  const [openNodeLogs, setOpenNodeLogs] = useState(false);
  const classNames: DrawerClassNames = {
    body: drawerStyles['my-drawer-body'],
    mask: drawerStyles['my-drawer-mask'],
    header: drawerStyles['my-drawer-header'],
    footer: drawerStyles['my-drawer-footer'],
    content: drawerStyles['my-drawer-content'],
  };

  const [pdName, setPdName] = useState('X20.png');
  // 在组件中添加状态管理当前加载的节点
  const [loadingNode, setLoadingNode] = useState<string | null>(null);
  const { run: getLogs, loading: logsLoading } = useRequest(getNodeLogs, {
    manual: true,
    onSuccess: () => {
      setOpenNodeLogs(true);
    },
    onError: () => {},
  });

  const productImage = useCallback(() => {
    return getImage(`${pdName}`);
  }, [pdName]);

  const treeData: TreeDataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      icon: <DownloadOutlined style={{ color: theme.colorPrimary }} />,
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          icon: <DownloadOutlined style={{ color: theme.colorPrimary }} />,
          children: [
            { title: 'leaf', key: '0-0-0-0', icon: <DownloadOutlined style={{ color: theme.colorPrimary }} /> },
            {
              title: (
                <>
                  <span>multiple line title</span>
                </>
              ),
              key: '0-0-0-1',
              icon: <DownloadOutlined style={{ color: theme.colorPrimary }} />,
            },
            { title: 'leaf', key: '0-0-0-2', icon: <DownloadOutlined style={{ color: theme.colorPrimary }} /> },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          icon: <DownloadOutlined style={{ color: theme.colorPrimary }} />,
          children: [
            { title: 'leaf', key: '0-0-1-0', icon: <DownloadOutlined style={{ color: theme.colorPrimary }} /> },
          ],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          icon: <DownloadOutlined style={{ color: theme.colorPrimary }} />,
          children: [
            { title: 'leaf', key: '0-0-2-0', icon: <DownloadOutlined style={{ color: theme.colorPrimary }} /> },
            {
              title: <>mwrobot_driver_canbus</>,
              key: '0-0-2-1',
              icon: <DownloadOutlined style={{ color: theme.colorPrimary }} />,
            },
          ],
        },
      ],
    },
  ];

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
        <div className='flex flex-1 flex-col gap-4 h-full relative p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden'>
          <div
            className='flex-1 flex flex-col gap-2  bg-no-repeat'
            style={{
              backgroundImage: `url(${productImage()})`,
              backgroundSize: '100% auto',
              backgroundPosition: 'center bottom',
            }}
          >
            <div>
              <Typography.Title level={5} className='!m-0'>
                {t('common.about.serial')}
              </Typography.Title>
              <Typography.Text className='!m-0 opacity-70'>MW2720230703001</Typography.Text>
            </div>
            <div>
              <Typography.Title level={5} className='!m-0'>
                {t('common.about.date')}
              </Typography.Title>
              <Typography.Text className='!m-0 opacity-70'>2023-01-01</Typography.Text>
            </div>
            <div>
              <Typography.Title level={5} className='!m-0'>
                {t('common.about.vehicleType')}
              </Typography.Title>
              <Typography.Text
                onClick={() => {
                  // 生成0到imageNames长度-1之间的随机整数
                  const randomIndex = Math.floor(Math.random() * imageNames.length);
                  // 设置随机选中的图片名称
                  setPdName(imageNames[randomIndex]);
                }}
                className='!m-0 opacity-70'
              >
                {pdName}
              </Typography.Text>
            </div>
            <div>
              <Typography.Title level={5} className='!m-0'>
                {t('common.about.memory')}
              </Typography.Title>
              <Typography.Text className='!m-0 opacity-70'>31.3 / 40 (G)</Typography.Text>
            </div>
            <div>
              <Typography.Title level={5} className='!m-0'>
                {t('common.about.cpu')}
              </Typography.Title>
              <Typography.Text className='!m-0 opacity-70'>87%</Typography.Text>
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='primary' onClick={() => setLogsOpen(true)}>
              系统日志
            </Button>
            <Button color='yellow' variant='solid'>
              客户端
            </Button>
          </div>
        </div>
        <div
          className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden flex flex-col w-2/3 gap-4'
          style={{
            background: `
      radial-gradient(circle at 60% 90%, #3f6fa1, #0000 60%), 
      radial-gradient(circle at 20px 20px, #2e67a1cc, #0000 25%), 
      #182336
    `,
          }}
        >
          <div className='w-full'>
            <h2 className='text-lg font-bold mb-1'>{t('common.about.nodes')} </h2>
            <motion.div
              className='!w-full h-px'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div
                className='w-full h-full'
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
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
                      loading={loadingNode === item.title && logsLoading}
                      onClick={() => {
                        console.log(item.title);

                        setLoadingNode(item.title);
                        getLogs({ node_name: item.title });
                      }}
                    >
                      查看日志
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className='flex items-center gap-2 justify-between'>
                        <div className='px-1 flex items-center gap-1'>
                          {item.status ? (
                            <Badge status='processing' className={styles.dot} color={theme.colorPrimary} />
                          ) : (
                            <Badge className={styles.dot} status='default' />
                          )}
                          {item.title}
                        </div>
                        <div className='flex items-center justify-between min-w-32 gap-1'>
                          <span
                            style={{
                              color:
                                item.cpu > 80 ? theme.colorError : item.cpu > 40 ? theme.colorWarning : theme.colorText,
                            }}
                          >
                            <SvgIcon name={'cpu'} size={16} /> {item.cpu}%
                          </span>
                          <span>
                            <SvgIcon name={'memory'} size={16} /> {item.memory}%
                          </span>
                        </div>
                      </div>
                    }
                    description={
                      <div className='flex items-center gap-2'>
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
        title={<p>{t('common.about.logs')}</p>}
        placement='right'
        open={openLogs}
        loading={false}
        classNames={classNames}
        onClose={() => setLogsOpen(false)}
      >
        <div className='flex-1 overflow-y-auto'>
          <Tree
            className={styles.tree}
            showLine={true}
            showIcon={true}
            defaultExpandedKeys={['0-0-0']}
            treeData={treeData}
          />
        </div>
      </Drawer>
      <Drawer
        closable
        destroyOnHidden
        title={<p>{loadingNode} 日志</p>}
        placement='right'
        open={openNodeLogs}
        loading={false}
        classNames={classNames}
        width={'100%'}
        onClose={() => setOpenNodeLogs(false)}
      ></Drawer>
    </div>
  );
};

export default About;
