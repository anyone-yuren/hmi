import type { GetRef, InputRef, TableProps } from 'antd';
import { Dropdown, Form, Input, MenuProps, Popconfirm, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AddParameterPanel from './components/addParameterPanel';
import type { DeviceParameter } from './types';

type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

/* ---------- Editable Row / Cell ---------- */

const EditableRow: React.FC<any> = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<any> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    const values = await form.validateFields();
    toggleEdit();
    handleSave({ ...record, ...values });
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} size='small' onBlur={save} onPressEnter={save} />
      </Form.Item>
    ) : (
      <div onClick={toggleEdit}>{children}</div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

/* ---------- Main ---------- */

const PathPlanning: React.FC = () => {
  const wrapperRef = useRef<Element>(null);
  const [dataSource, setDataSource] = useState<DeviceParameter[]>([
    {
      key: '1',
      parameter: 'cost_backard_move_coe',
      name: '后退权重系数',
      type: 'float',
      value: '0.005',
      min: 0,
      max: 100,
      description: '后退权重系数',
    },
    {
      key: '2',
      parameter: 'cost_backard_move_constance',
      name: '后退权重恒值补偿',
      type: 'float',
      value: '4',
      min: 0,
      max: 100,
      description: '后退权重恒值补偿',
    },
    {
      key: '3',
      parameter: 'cost_curve_coe',
      name: '弧线权重系数',
      type: 'float',
      value: '0.001',
      min: 0,
      max: 100,
      description: '弧线权重系数',
    },
    {
      key: '4',
      parameter: 'cost_curve_constance',
      name: '弧线权重恒值补偿',
      type: 'float',
      value: '1',
      min: 0,
      max: 100,
      description: '弧线权重恒值补偿',
    },
    {
      key: '5',
      parameter: 'cost_deviate_mid_lane_coe',
      name: '偏离车道中线权重系数',
      type: 'float',
      value: '0.01',
      min: 0,
      max: 100,
      description: '偏离车道中线权重系数',
    },
    {
      key: '6',
      parameter: 'cost_deviate_mid_lane_constance',
      name: '偏离车道中线恒值补偿',
      type: 'float',
      value: '0',
      min: 0,
      max: 100,
      description: '偏离车道中线恒值补偿',
    },
    {
      key: '7',
      parameter: 'cost_diff_direction',
      name: '切换方向系数',
      type: 'float',
      value: '3',
      min: 0,
      max: 100,
      description: '切换方向系数',
    },
    {
      key: '8',
      parameter: 'cost_forward_move_coe',
      name: '前进权重系数',
      type: 'float',
      value: '0.001',
      min: 0,
      max: 100,
      description: '前进权重系数',
    },
    {
      key: '9',
      parameter: 'cost_forward_move_constance',
      name: '前进权重恒值补偿',
      type: 'float',
      value: '0',
      min: 0,
      max: 100,
      description: '前进权重恒值补偿',
    },
    {
      key: '10',
      parameter: 'cost_rotate_coe',
      name: '旋转权重系数',
      type: 'float',
      value: '2',
      min: 0,
      max: 100,
      description: '旋转权重系数',
    },
    {
      key: '11',
      parameter: 'cost_rotate_constance',
      name: '旋转权重恒值补偿',
      type: 'float',
      value: '2',
      min: 0,
      max: 100,
      description: '旋转权重恒值补偿',
    },
    {
      key: '12',
      parameter: 'debug_path_planning',
      name: '启动路径规划调试',
      type: 'bool',
      value: 'false',
      description: '启动路径规划调试',
    },
    {
      key: '13',
      parameter: 'debug_start_id',
      name: '调试起点ID',
      type: 'uint',
      value: '0',
      min: 0,
      max: 0,
      description: '调试起点ID',
    },
    {
      key: '14',
      parameter: 'debug_start_theta',
      name: '调试起点角度',
      type: 'float',
      value: '0',
      min: -3.14159,
      max: 3.14159,
      description: '调试起点角度',
    },
    {
      key: '15',
      parameter: 'debug_start_x',
      name: '调试起点X坐标',
      type: 'float',
      value: '0',
      min: -10000000,
      max: 10000000,
      description: '调试起点X坐标',
    },
    {
      key: '16',
      parameter: 'debug_start_y',
      name: '调试起点Y坐标',
      type: 'float',
      value: '0',
      min: -10000000,
      max: 10000000,
      description: '调试起点Y坐标',
    },
    {
      key: '17',
      parameter: 'debug_target_id',
      name: '调试终点ID',
      type: 'uint',
      value: '0',
      min: 0,
      max: 0,
      description: '调试终点ID',
    },
    {
      key: '18',
      parameter: 'dis_backward_move_max',
      name: '正常后退距离',
      type: 'float',
      value: '2500',
      min: 0,
      max: 10000,
      description: '若后退距离大于该值则认为是倒车',
    },
    {
      key: '19',
      parameter: 'print_log',
      name: '日志打印',
      type: 'bool',
      value: 'false',
      description: '日志打印',
    },
  ]);

  const [showAdd, setShowAdd] = useState(false);

  const handleSave = (row: DeviceParameter) => {
    const newData = [...dataSource];
    const index = newData.findIndex((i) => i.key === row.key);
    newData.splice(index, 1, row);
    setDataSource(newData);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'add',
      label: '➕ 新增参数',
      onClick: () => setShowAdd(true),
    },
    {
      key: 'export',
      label: '📤 导出参数',
      onClick: () => {
        console.log('导出参数', dataSource);
      },
    },
  ];

  const columns: TableProps<DeviceParameter>['columns'] = [
    { title: '参数', dataIndex: 'parameter', editable: true, width: 200 },
    { title: '名称', dataIndex: 'name', width: 150, editable: true },
    { title: '类型', dataIndex: 'type', width: 100 },
    { title: '参数值', dataIndex: 'value', width: 100, editable: true },
    { title: '最小值', dataIndex: 'min', width: 100, editable: true },
    { title: '最大值', dataIndex: 'max', width: 100, editable: true },
    { title: '描述', dataIndex: 'description', width: 200, editable: true },
    {
      title: '操作',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title='确认删除？'
          onConfirm={() =>
            setDataSource((list) => list.filter((i) => i.key !== record.key))
          }
        >
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ].map((col: any) =>
    col.editable
      ? {
          ...col,
          onCell: (record: DeviceParameter) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        }
      : col,
  );

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
      <div
        className='h-full w-full'
        ref={wrapperRef as React.RefObject<HTMLDivElement>}
      >
        <Table
          components={{ body: { row: EditableRow, cell: EditableCell } }}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size='small'
          bordered
          // scroll={{ y: 'calc(100vh - 0px)' }}
        />

        <AddParameterPanel
          boundsRef={wrapperRef}
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onSubmit={(item) => setDataSource((list) => [...list, item])}
        />
      </div>
    </Dropdown>
  );
};

export default PathPlanning;
