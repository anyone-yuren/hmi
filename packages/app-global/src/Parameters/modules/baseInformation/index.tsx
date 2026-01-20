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

const BaseInformation: React.FC = () => {
  const wrapperRef = useRef<Element>(null);
  const [dataSource, setDataSource] = useState<DeviceParameter[]>([
    {
      key: '1',
      parameter: 'language_type',
      name: '语言类型',
      type: 'String',
      value: 'zh-CN',
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
    { title: '参数', dataIndex: 'parameter', editable: true },
    { title: '名称', dataIndex: 'name', width: 150, editable: true },
    { title: '类型', dataIndex: 'type', width: 100 },
    { title: '参数值', dataIndex: 'value', width: 150, editable: true },
    {
      title: '操作',
      width: 120,
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
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['contextMenu']}
      onOpenChange={(e) => {
        debugger;
      }}
    >
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

export default BaseInformation;
