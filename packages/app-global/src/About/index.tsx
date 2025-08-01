import { DownloadOutlined, FormOutlined } from '@ant-design/icons';
import { Tree, TreeDataNode, Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const useStyles = createStyles(({ css, token }) => ({
  tree: css`
    background-color: transparent;
    .ant-tree-switcher-leaf-line:before,
    .ant-tree-switcher-leaf-line:after,
    .ant-tree-indent-unit:before,
    .ant-tree-indent-unit:after {
      border-inline-end: 1px solid ${token.colorPrimary};
      border-bottom: 1px solid ${token.colorPrimary};
    }
  `,
}));

// 获取图片函数
const getImage = (imageName: string) => {
  return new URL(`./images/${imageName}`, import.meta.url).href;
};

const About = () => {
  const { t } = useTranslation();
  const { styles } = useStyles();
  const theme = useTheme();

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
              switcherIcon: <FormOutlined />,
            },
          ],
        },
      ],
    },
  ];
  return (
    <div className='flex flex-col h-full p-4 gap-4 '>
      <div className='p-4 rounded-2xl bg-white/10 flex gap-4 items-center divide-x divide-white/20'>
        <Typography.Title level={5} className='!m-0'>
          {t('common.about.serial')}：1234567890
        </Typography.Title>
        <Typography.Title level={5} className='!m-0 pl-4'>
          {t('common.about.date')}：2023-01-01
        </Typography.Title>
        <Typography.Title level={5} className='!m-0 pl-4'>
          {t('common.about.vehicleType')}：X20
        </Typography.Title>
      </div>
      <div className=' flex gap-4 items-center flex-1'>
        <div
          className='flex-1 relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden  bg-no-repeat'
          style={{
            backgroundImage: `url(${getImage('x20.png')})`,
            backgroundSize: 'auto 80%',
            backgroundPosition: '-50px center',
          }}
        ></div>
        <div className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden flex flex-col w-1/3 gap-4'>
          <div>
            <h2 className='text-lg font-bold mb-1'>{t('common.about.logs')} </h2>
            {true ? (
              <motion.div
                initial={{ width: '40px', opacity: 0.2 }}
                animate={{
                  width: '160px',
                  opacity: 1,
                }}
                transition={{
                  duration: 3,
                  ease: 'easeInOut',
                }}
                className='h-[1px] bg-gradient-to-r from-teal-500 to-purple-500/0 rounded-full'
              />
            ) : null}
          </div>

          <Tree
            className={styles.tree}
            showLine={true}
            showIcon={true}
            defaultExpandedKeys={['0-0-0']}
            treeData={treeData}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
