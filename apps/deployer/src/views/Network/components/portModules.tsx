import { PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, message, Modal, Switch, Table, TableColumnsType } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      title: t('deployer.network.wanPort'),
      dataIndex: 'dest_port',
    },
    {
      title: t('deployer.network.lanIpAddress'),
      dataIndex: 'dest_ip',
    },
    {
      title: t('deployer.network.lanPort'),
      dataIndex: 'src_port',
    },
    {
      title: t('deployer.network.enabled'),
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
      title: t('deployer.network.operation'),
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
            {t('common.edit')}
          </Button>
          <Button
            variant='text'
            color='red'
            onClick={() => {
              modal.confirm({
                title: t('common.confirmDel'),
                okText: t('common.confirm'),
                okType: 'danger',
                onOk: () => {
                  delPort({
                    real_num: row?.real_num,
                  });
                },
              });
            }}
          >
            {t('common.delete')}
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
    message.success(t('common.saveSuccess'));
  };

  const handleDownload = () => {
    const list = portData?.data?.port_forwarding_list ?? [];
    if (!list.length) {
      message.warning(t('deployer.network.noExport'));
      return;
    }

    try {
      const jsonStr = JSON.stringify(list, null, 2); // 美化格式
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `port_forwarding_${new Date().toISOString().slice(0, 19)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      message.error(t('deployer.network.failedExport'));
    }
  };
  return (
    <>
      <h3 className='text-lg font-bold mb-2 flex items-center justify-between'>
        {t('deployer.network.portMapping')}
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              handleAdd();
            }}
          >
            {t('common.add')}
          </Button>
          <JsonFileUploader />
          <Button size='small' type='default' onClick={handleDownload}>
            {t('common.download')}
          </Button>
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
