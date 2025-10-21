import { DownloadOutlined } from '@ant-design/icons';
import { useAsyncEffect, useRequest } from 'ahooks';
import { Button, Drawer, List, Tree, TreeDataNode, Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAgvType } from '../hooks/useAgvType';
import useDrawerClassName from '../hooks/useDrawerClassName';
import NodeLogs from './components/nodeLogs';
import SystemPanel from './components/systemPanel';
import WsContainer from './components/wsContainer';
import { config_agv_info, getChangeLogs, getLogList } from './services';
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
  const { t, i18n } = useTranslation();
  const { styles } = useStyles();
  const theme = useTheme();
  const [openLogs, setLogsOpen] = useState(false); // 这个疑似废弃了
  const [openNodeLogs, setOpenNodeLogs] = useState(false); // 废弃，用下面的
  const [childNodeConfig, setChildNodeConfig] = useState({ open: false, node: [], key: '' });

  const classNames = useDrawerClassName();
  const { data: agvInfo } = useRequest(config_agv_info);

  const agvType = useAgvType();

  const [pdName, setPdName] = useState(`MW_${agvType}.png`);
  // 在组件中添加状态管理当前加载的节点
  const [loadingNode, setLoadingNode] = useState<string | null>(null);
  const {
    data: logResponse,
    loading: logLoading,
    runAsync: getLogListAsync,
  } = useRequest(getLogList, {
    manual: false,
  });

  // const { run: getLogs, loading: logsLoading } = useRequest(getNodeLogs, {
  //   manual: true,
  //   onSuccess: () => {
  //     setOpenNodeLogs(true);
  //   },
  //   onError: () => {
  //     setOpenNodeLogs(true);
  //   },
  // });

  const { data: changeLogs, runAsync: getChangeLogAsync } = useRequest(getChangeLogs, { manual: true });

  const renderChangeLogs = useMemo(() => {
    return changeLogs?.data;
  }, [changeLogs]);

  const logList = useMemo(() => {
    const keys = Object.keys(logResponse?.data || {});
    if (!keys?.length) return [];
    return keys;
  }, [logResponse]);

  useAsyncEffect(async () => {
    await getChangeLogAsync({});
  }, [i18n.language]);

  // const productImage = useCallback(() => {
  //   if (!agvType) {
  //     return noVehicleSvg;
  //   }
  //   return getImage(`${pdName}`);
  // }, [pdName, agvType]);

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

  const handleRefresh = async () => {
    const res = await getLogListAsync({});
    const { key } = childNodeConfig;
    const ary = res?.data?.[key];
    setChildNodeConfig({
      ...childNodeConfig,
      node: ary,
    });
  };

  const changeTypeConfig = {
    perf: {
      color: 'green',
      icon: '🌈',
    },
    5: '🔥',
    fix: {
      color: '',
      icon: '🐛',
    },
    feat: {
      color: '#FF9800',
      icon: '🚀',
    },
    3: '🎉',
    4: '🎁',
    8: '🎨',
  };

  return (
    <div className='flex flex-col h-full p-4 gap-4 '>
      <div className=' flex gap-4 items-center flex-1 overflow-y-auto'>
        <div className='flex flex-1 flex-col gap-4 h-full relative p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden'>
          {true && <SystemPanel></SystemPanel>}
          <WsContainer></WsContainer>

          {false && (
            <div className='flex justify-end gap-2'>
              <Button color='yellow' variant='solid'>
                {t('common.about.client')}
              </Button>
            </div>
          )}
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
            <h2 className='text-lg font-bold mb-1'>{t('common.about.updateVersionInfo')} </h2>
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
          <div className='max-h-[320px] overflow-y-auto bg-[#1d314c] py-[1rem] rounded-2xl'>
            {renderChangeLogs?.version ? (
              <Typography.Title level={4} className='px-5'>
                {renderChangeLogs?.version}
              </Typography.Title>
            ) : null}
            <div className='flex flex-col gap-[5px]'>
              {renderChangeLogs?.changeLogOutputs.length ? (
                renderChangeLogs?.changeLogOutputs?.map((item) => {
                  const obj = changeTypeConfig[item.changeType] || { icon: '🌈' };
                  return (
                    <Typography.Text className='px-5'>
                      {obj.icon}&nbsp;&nbsp;
                      <span>{item.description}</span>
                    </Typography.Text>
                  );
                })
              ) : (
                <List dataSource={[]}></List>
              )}
            </div>
            {/* {renderChangeLogs ? renderChangeLogs : <List dataSource={[]}></List>} */}
          </div>
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
              dataSource={logList}
              renderItem={(item, index) => (
                <List.Item
                  classNames={{
                    actions: '!ml-4',
                  }}
                  actions={[
                    <Button
                      type='primary'
                      loading={loadingNode === item && logLoading}
                      onClick={() => {
                        setLoadingNode(item);
                        setOpenNodeLogs(true);
                        setChildNodeConfig({
                          open: true,
                          node: logResponse?.data?.[item],
                          key: item,
                        });
                        // setLogsOpen(true);
                        // getLogs({ node_name: item.title });
                      }}
                    >
                      {t('common.about.viewlog')}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={<div className='px-1'>{item}</div>}
                    // title={
                    //   <div className='flex items-center gap-2 justify-between'>
                    //     <div className='px-1 flex items-center gap-1'>
                    //       {item.status ? (
                    //         <Badge status='processing' className={styles.dot} color={theme.colorPrimary} />
                    //       ) : (
                    //         <Badge className={styles.dot} status='default' />
                    //       )}
                    //       {item.title}
                    //     </div>
                    //     <div className='flex items-center justify-between min-w-32 gap-1'>
                    //       <span
                    //         style={{
                    //           color:
                    //             item.cpu > 80 ? theme.colorError : item.cpu > 40 ? theme.colorWarning : theme.colorText,
                    //         }}
                    //       >
                    //         <SvgIcon name={'cpu'} size={16} /> {item.cpu}%
                    //       </span>
                    //       <span>
                    //         <SvgIcon name={'memory'} size={16} /> {item.memory}%
                    //       </span>
                    //     </div>
                    //   </div>
                    // }
                    // description={
                    //   <div className='flex items-center gap-2'>
                    //     <span>{item.time}</span>
                    //     <span>{item.version}</span>
                    //   </div>
                    // }
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
        title={
          <p>
            {loadingNode} {t('common.about.log')}
          </p>
        }
        placement='right'
        open={childNodeConfig.open}
        loading={false}
        classNames={{
          ...classNames,
          body: '!p-0',
        }}
        width={'100%'}
        onClose={() =>
          setChildNodeConfig({
            open: false,
            node: [],
            key: '',
          })
        }
      >
        <NodeLogs
          node={childNodeConfig.node}
          nodeKey={childNodeConfig.key}
          listLoading={logLoading}
          refresh={handleRefresh}
        />
      </Drawer>
    </div>
  );
};

export default About;
