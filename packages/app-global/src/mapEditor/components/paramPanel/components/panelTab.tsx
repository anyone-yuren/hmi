import { Tabs, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../store';
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
        background-color: rgb(255, 255, 255, 0.05) !important;
      }
    }
    .ant-tabs-ink-bar {
      right: auto !important;
      display: none !important;
    }
  `,
}));

const PanelTab = () => {
  const { styles } = useStyles();
  const { selectDrawType, setSelectDrawType } = useMapEditorStore(
    useShallow((state) => {
      return {
        selectDrawType: state.selectDrawType,
        setSelectDrawType: state.setSelectDrawType,
      };
    }),
  );
  return (
    <Tabs
      className={styles['panel-tabs']}
      tabPosition='left'
      // defaultActiveKey={selectDrawType}
      accessKey={selectDrawType}
      onChange={setSelectDrawType}
      renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
      items={[
        {
          key: '1',
          label: (
            <div>
              <Tooltip title='楼层数据'>
                <IconifyIcon icon='system-uicons:flip-view' size={18} className='text-teal-400 hover:text-teal-300' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: 'navigation',
          label: (
            <div>
              <Tooltip title='楼层属性' styles={{ root: { pointerEvents: 'none' } }}>
                <IconifyIcon icon='bx:world' size={18} className='text-red-400 hover:text-red-300' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: 'point',
          label: (
            <div>
              <Tooltip title='包含点' styles={{ root: { pointerEvents: 'none' } }}>
                <IconifyIcon icon='gis:copy-point' size={18} className='text-green-400 hover:text-green-300' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: 'line',
          label: (
            <div>
              <Tooltip title='包含线' styles={{ root: { pointerEvents: 'none' } }}>
                <IconifyIcon icon='gis:copy-line' size={18} className='text-yellow-400 hover:text-yellow-300' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: 'polygon',
          label: (
            <div>
              <Tooltip title='包含面' styles={{ root: { pointerEvents: 'none' } }}>
                <IconifyIcon icon='gis:polygon-hole-pt' size={18} className='text-blue-400 hover:text-blue-300' />
              </Tooltip>
            </div>
          ),
        },
        {
          key: 'device',
          label: (
            <div>
              <Tooltip title='包含设备' styles={{ root: { pointerEvents: 'none' } }}>
                <IconifyIcon
                  icon='material-symbols:doorbell-chime-outline'
                  size={18}
                  className='text-purple-400 hover:text-purple-300'
                />
              </Tooltip>
            </div>
          ),
        },
      ]}
    />
  );
};

export default PanelTab;
