import { Button, Space, Table, Tag } from 'antd';
import { IconifyIcon } from 'ui';
import { useParkingRuleStore } from '../store/useParkingRuleStore';
import { useVehicleModelStore } from '../store/useVehicleModelStore';
import { ParkingRule } from '../types';

const ParkingRuleList = () => {
  const { rules, startEditing, deleteRule } = useParkingRuleStore();
  const { models } = useVehicleModelStore();

  const getModelNames = (ids: string[]) => {
    if (!ids || ids.length === 0) return [];
    return ids.map((id) => models.find((m) => m.id === id)?.name || id);
  };

  const columns = [
    {
      title: '规则ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '适用车型',
      dataIndex: 'vehicleModelIds',
      key: 'vehicleModelIds',
      render: (ids: string[]) => (
        <Space size={[0, 8]} wrap>
          {getModelNames(ids).map((name) => (
            <Tag key={name} color='blue'>
              {name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Station 类型',
      dataIndex: 'stationType',
      key: 'stationType',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'error'}>
          {enabled ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ParkingRule) => (
        <Space size='middle'>
          <Button type='link' size='small' onClick={() => startEditing(record)}>
            编辑
          </Button>
          <Button
            type='link'
            size='small'
            danger
            onClick={() => deleteRule(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='flex flex-col h-full gap-4'>
      <div className='flex justify-between items-center'>
        <div className='text-base font-bold'>停车规则列表</div>
        <Button
          type='primary'
          icon={<IconifyIcon icon='mingcute:add-line' size={16} />}
          onClick={() => startEditing()}
        >
          新增规则
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={rules}
        size='small'
        rowKey='id'
        pagination={{ pageSize: 10 }}
        scroll={{ y: 'calc(100vh - 300px)' }}
      />
    </div>
  );
};

export default ParkingRuleList;
