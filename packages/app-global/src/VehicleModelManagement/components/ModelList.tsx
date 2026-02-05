import { Button, Space, Table, Tag } from 'antd';
import { IconifyIcon } from 'ui';
import { useVehicleModelStore } from '../store/useVehicleModelStore';
import { VehicleModel } from '../types';

const ModelList = () => {
  const { models, startEditing, deleteModel } = useVehicleModelStore();

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
        <Button
          type='primary'
          icon={<IconifyIcon icon='mingcute:add-line' size={16} />}
          onClick={() => startEditing()}
        >
          新建车型
        </Button>
      </div>

      <div className='flex-1 overflow-auto'>
        <Table
          columns={columns}
          dataSource={models}
          rowKey='id'
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default ModelList;
