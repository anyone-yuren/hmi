import { Tabs } from 'antd';
import { createStyles } from 'antd-style';
import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { EventFlowManager } from './components/EventFlowManager';
import { SceneManager } from './components/SceneManager';
import { ValidationCenter } from './components/ValidationCenter';

const useStyles = createStyles(({ css }) => ({
  fullHeightTabs: css`
    height: 100%;
    .ant-tabs-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .ant-tabs-tabpane {
      flex: 1;
      height: 100%;
    }
  `,
}));

const TaskEventRuleManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { styles } = useStyles();

  const items = [
    {
      key: 'dashboard',
      label: '规则总览',
      children: <Dashboard />,
    },
    {
      key: 'scenes',
      label: '场景管理',
      children: <SceneManager />,
    },
    {
      key: 'flows',
      label: '事件流管理',
      children: <EventFlowManager />,
    },
    {
      key: 'validation',
      label: '规则校验中心',
      children: <ValidationCenter />,
    },
  ];

  return (
    <div className='h-full w-full bg-transparent p-4'>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        className={styles.fullHeightTabs}
      />
    </div>
  );
};

export default TaskEventRuleManagement;
