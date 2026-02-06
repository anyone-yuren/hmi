import { Button, Space, Table, Tag } from 'antd';
import { useState } from 'react';
import { IconifyIcon } from 'ui';
import { useParkingRuleStore } from '../store/useParkingRuleStore';
import { useVehicleModelStore } from '../store/useVehicleModelStore';
import { VehicleModel } from '../types';
import ParkingRuleManager from './ParkingRuleManager';

const ModelList = () => {
  const { models, startEditing, deleteModel } = useVehicleModelStore();
  const { rules, startEditing: startEditingRule } = useParkingRuleStore();
  const [isRuleManagerOpen, setIsRuleManagerOpen] = useState(false);

  const getRuleName = (id: string) => {
    return rules.find((r) => r.id === id)?.name || id;
  };

  const columns = [
    {
      title: '车型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '车型编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '车辆类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '绑定约束模板',
      dataIndex: 'template',
      key: 'template',
    },
    {
      title: '支持站点类型数',
      dataIndex: 'stationTypeCount',
      key: 'stationTypeCount',
    },
    {
      title: '绑定托盘',
      dataIndex: 'trayModels',
      key: 'trayModels',
      render: (trayModels: string[]) => (
        <Space size={[0, 8]} wrap>
          {trayModels?.map((tag) => (
            <Tag key={tag} color='blue'>
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '关联停车规则',
      dataIndex: 'parkingRuleIds',
      key: 'parkingRuleIds',
      render: (parkingRuleIds: string[]) => (
        <Space size={[0, 8]} wrap>
          {parkingRuleIds?.map((id) => {
            const rule = rules.find((r) => r.id === id);
            return (
              <Tag
                key={id}
                color='cyan'
                className='cursor-pointer'
                onClick={() => {
                  if (rule) {
                    startEditingRule(rule);
                  }
                }}
              >
                {rule?.name || id}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'success' : 'error'}>
          {status === 'enabled' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: VehicleModel) => (
        <Space size='middle'>
          <Button type='link' size='small' onClick={() => startEditing(record)}>
            编辑
          </Button>
          <Button
            type='link'
            size='small'
            danger
            onClick={() => deleteModel(record.id)}
          >
            删除
          </Button>
          <Button type='link' size='small'>
            {record.status === 'enabled' ? '停用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='flex flex-col h-full gap-4 p-4 bg-white/5 rounded-lg'>
      <div className='flex justify-between items-center'>
        <div className='text-lg font-bold'>车型管理</div>
        <Space>
          <Button onClick={() => setIsRuleManagerOpen(true)}>
            停车规则设计
          </Button>
          <Button
            type='primary'
            icon={<IconifyIcon icon='mingcute:add-line' size={16} />}
            onClick={() => startEditing()}
          >
            新建车型
          </Button>
        </Space>
      </div>

      <div className='flex-1 overflow-auto'>
        <Table
          columns={columns}
          dataSource={models}
          rowKey='id'
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
      <ParkingRuleManager
        open={isRuleManagerOpen}
        onClose={() => setIsRuleManagerOpen(false)}
      />
    </div>
  );
};

export default ModelList;
