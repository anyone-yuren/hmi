import { Tabs, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import { IconifyIcon } from 'ui';
const useStyles = createStyles(({ css }) => ({
  'panel-tabs': css`
    .ant-tabs-nav {
      min-width: 28px;
    }
    .ant-tabs-content-holder {
      display: none !important;
    }
    .ant-tabs-tab {
      margin: 0 !important;
      padding: 4px !important;
      justify-content: center;
      &.ant-tabs-tab-active {
        background-color: rgb(255, 255, 255, 0.1) !important;
      }
    }
  `,
}));

const PanelTab = () => {
  const { styles } = useStyles();
  return (
    <Tabs
      className={styles['panel-tabs']}
      tabPosition='left'
      renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
      items={[
        {
          key: '1',
          label: (
            <div>
              <Tooltip title='楼层数据'>
                <IconifyIcon icon='system-uicons:flip-view' size={18} className='text-teal-400' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div>
              <Tooltip title='楼层属性'>
                <IconifyIcon icon='bx:world' size={18} className='text-red-400' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: '3',
          label: (
            <div>
              <Tooltip title='包含点'>
                <IconifyIcon icon='gis:copy-point' size={18} className='text-green-400' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: '4',
          label: (
            <div>
              <Tooltip title='包含线'>
                <IconifyIcon icon='gis:copy-line' size={18} className='text-yellow-400' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: '5',
          label: (
            <div>
              <Tooltip title='包含面'>
                <IconifyIcon icon='gis:polygon-hole-pt' size={18} className='text-blue-400' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: '6',
          label: (
            <div>
              <Tooltip title='包含设备'>
                <IconifyIcon icon='material-symbols:doorbell-chime-outline' size={18} className='text-purple-400' />
              </Tooltip>
            </div>
          ),
        },
      ]}
    />
  );
};

export default PanelTab;
