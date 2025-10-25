import { PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, message, Modal, Switch, Table, TableColumnsType } from 'antd';
import { useState } from 'react';
import { getPortList, postDeletePort, postPortFwdList, postUpdatePort } from '../services';
import PortRuleDrawer, { PortRule } from './editorDrawer';
import JsonFileUploader from './jsonFileUploader';
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  real_num: number; //编号
}

const PortModules = () => {
  const [modal, contextHolder] = Modal.useModal();
  const { data: portData, loading, run } = useRequest(getPortList);
  // const [modal, contextHolder] = Modal.useModal();
  const { loading: updateLoading, run: updatePort } = useRequest(postUpdatePort, {
    manual: true,
    onSuccess: () => {
      run();
    },
  });

  const { loading: delLoading, run: delPort } = useRequest(postDeletePort, {
    manual: true,
    onSuccess: () => {
      run();
    },
  });

  // 新增端口
  const { loading: addLoading, run: addRun } = useRequest(postPortFwdList, {
    manual: true,
    onSuccess: () => {
      run();
    },
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: 'WAN端口号',
      dataIndex: 'dest_port',
    },
    {
      title: 'LAN端口IP地址',
      dataIndex: 'dest_ip',
    },
    {
      title: 'LAN端口号',
      dataIndex: 'src_port',
    },
    {
      title: '应用状态',
      dataIndex: 'enabled',
      render: (value, row) => {
        return (
          <Switch
            size='small'
            checked={value}
            onChange={(checked) => {
              updatePort({
                ...row,
                enabled: checked,
              });
            }}
          />
        );
      },
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='text'
            color='orange'
            onClick={() => {
              handleEdit(row);
            }}
          >
            编辑
          </Button>
          <Button
            variant='text'
            color='red'
            onClick={() => {
              modal.confirm({
                title: '确认删除吗？',
                okText: '确认',
                okType: 'danger',
                onOk: () => {
                  delPort({
                    real_num: row?.real_num,
                  });
                },
              });
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<PortRule | undefined>();

  const handleAdd = () => {
    setEditData(undefined);
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditData({
      ...row,
    });
    setOpen(true);
  };

  const handleSubmit = (values: PortRule) => {
    if (values.real_num) {
      updatePort(values);
    } else {
      addRun(values);
    }
    message.success('保存成功！');
  };
  return (
    <>
      <h3 className='text-lg font-bold mb-2 flex items-center justify-between'>
        端口映射
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              handleAdd();
            }}
          >
            新增
          </Button>
          <JsonFileUploader />
        </div>
      </h3>
      <div>
        <PortRuleDrawer open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} initialValues={editData} />
      </div>
      <Table
        loading={loading || updateLoading}
        columns={columns}
        dataSource={portData?.data?.port_forwarding_list ?? []}
        size='small'
        pagination={false}
      ></Table>
      {contextHolder}
    </>
  );
};
export default PortModules;
