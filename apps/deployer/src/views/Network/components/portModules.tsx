import { Button, Table, TableColumnsType } from 'antd';
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const PortModules = () => {
  const columns: TableColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: 'WAN端口号',
      dataIndex: 'age',
    },
    {
      title: 'LAN端口IP地址',
      dataIndex: 'address',
    },
    {
      title: 'LAN端口号',
      dataIndex: 'age',
    },
    {
      title: '应用状态',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => (
        <div className='flex items-center gap-2'>
          <Button variant='text' color='orange'>
            编辑
          </Button>
          <Button variant='text' color='red'>
            删除
          </Button>
        </div>
      ),
    },
  ];
  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: '192.168.20.121',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: '192.168.20.121',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: '192.168.20.121',
    },
  ];
  return <Table columns={columns} dataSource={data} size='small' pagination={false}></Table>;
};
export default PortModules;
