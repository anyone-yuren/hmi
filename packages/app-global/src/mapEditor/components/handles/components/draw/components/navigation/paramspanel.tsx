import { Checkbox, Collapse, ColorPicker, Dropdown, Form, Input, InputNumber, Select } from 'antd';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useDebouncedStoreSetter } from '../../../../../../hooks/useDebouncedStoreSetter';
import { useMapEditorStore } from '../../../../../../store';
import { useMapEditorViewStore } from '../../../../../../store/view';
const { Search } = Input;
const DrawNavigationParamsPanel = () => {
  const [form] = Form.useForm();

  const { selectLineData, autoDoorList, elevatorList } = useMapEditorStore(
    useShallow((state) => ({
      selectLineData: state.selectLineData,
      autoDoorList: state.autoDoorList,
      elevatorList: state.elevatorList,
    })),
  );

  const { setFloorOffset, floorOffset, floorRotation, setFloorRotation, floorColor, setFloorColor } =
    useMapEditorViewStore(
      useShallow((state) => ({
        floorOffset: state.floorOffset,
        setFloorOffset: state.setFloorOffset,
        floorRotation: state.floorRotation,
        setFloorRotation: state.setFloorRotation,
        floorColor: state.floorColor,
        setFloorColor: state.setFloorColor,
      })),
    );
  const setDebouncedFloorOffset = useDebouncedStoreSetter(setFloorOffset, 300);
  const setDebouncedFloorRotation = useDebouncedStoreSetter(setFloorRotation, 300);
  const setDebouncedFloorColor = useDebouncedStoreSetter(setFloorColor, 300);

  // 将自动门和电梯合并成一个列表
  const deviceTreeData = [
    {
      title: '自动门',
      key: 'autoDoor',
      children: autoDoorList.map((item) => ({
        title: `自动门 ${item.id}`,
        key: `autoDoor-${item.id}`,
        isLeaf: true,
      })),
    },
    {
      title: '电梯',
      key: 'elevator',
      children: elevatorList.map((item) => ({
        title: `电梯 ${item.id}`,
        key: `elevator-${item.id}`,
        isLeaf: true,
      })),
    },
  ];

  /* ------------------- 同步选中线段数据 ------------------- */
  useEffect(() => {
    if (!floorOffset) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      xOffset: floorOffset[0],
      yOffset: floorOffset[1],
      rotation: floorRotation,
      floorColor: floorColor,
    });
  }, [floorOffset, floorRotation, floorColor]);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filteredData = deviceTreeData
      .flatMap((item) => item.children || [])
      .filter((item) => item.title.includes(value));
    setExpandedKeys(filteredData.map((item) => item.key));
    setAutoExpandParent(true);
    setSearchValue(value);
  };

  const treeData = useMemo(() => {
    if (searchValue) {
      return deviceTreeData.flatMap((item) => item.children || []).filter((item) => item.title.includes(searchValue));
    }
    return deviceTreeData;
  }, [searchValue]);

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='bg-white/5 rounded-sm p-2 '>
        <p className='text-xs font-medium flex items-center gap-2 justify-between'>
          <span className='flex items-center gap-1 text-xs font-medium text-nowrap'>
            <IconifyIcon icon='subway:folder-2' size={16} /> 楼层列表
          </span>
          <Search
            style={{ marginBottom: 0, width: 'auto', maxWidth: '50%' }}
            size='small'
            placeholder='Search'
            className='!max-w-1/2 w-auto'
            onChange={onChange}
          />
        </p>
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <div className='flex items-center justify-between'>
                    复制
                    <span className='text-xs font-medium text-gray-400 flex items-center gap-1'>
                      <IconifyIcon icon='mingcute:command-line' size={12} />c
                    </span>
                  </div>
                ),
                key: 'copy',
              },
              { label: <span>删除</span>, key: 'delete' },
              { label: <span>选择</span>, key: 'add' },
            ],
          }}
          trigger={['contextMenu']}
        >
          <ul className='flex flex-col gap-2 text-xs py-2'>
            {new Array(4)
              .fill(0)
              .map((_, index) => ({
                label: `楼层${index + 1}`,
                key: `camera${index + 1}`,
                isSelected: index % 2 === 0,
              }))
              .map((item, index) => {
                return (
                  <li
                    className={classNames(
                      'cursor-pointer hover:bg-cyan-500/30 px-2 py-0.5 flex items-center justify-between',
                      {
                        'bg-white/5': index % 2 === 0,
                        'text-gray-400': !item.isSelected,
                        'bg-[#00d1d1]/80 !text-black': index === 1,
                      },
                    )}
                    key={item.key}
                  >
                    {item.label}
                  </li>
                );
              })}
          </ul>
        </Dropdown>
        {/* 使用 Tree 组件渲染设备列表 */}
        {/* <Tree
          className='max-h-[200px] overflow-auto py-2'
          treeData={treeData}
          height={200}
          defaultExpandAll
          checkable
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
          onSelect={(selectedKeys, info) => {
            console.log('Selected device:', info.node.title);
          }}
          onRightClick={(info) => {
            // 右键菜单
            const menuItems = [
              { label: '复制', key: 'copy' },
              { label: '删除', key: 'delete' },
              { label: '选择', key: 'select' },
            ];
            // 你可以在这里执行具体操作
            console.log('Right-clicked on device:', info.node.title);
          }}
        /> */}
      </div>
      <div className='flex-1 bg-white/5 rounded-sm p-2 overflow-auto w-full'>
        <Form
          form={form}
          layout='horizontal'
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          autoComplete='off'
          onValuesChange={(changed, all) => {
            const color = all.floorColor?.toHexString?.() || '#ffffff';
            setDebouncedFloorOffset([all.xOffset, all.yOffset]);
            setDebouncedFloorRotation(all.rotation);
            setDebouncedFloorColor(color);
          }}
        >
          <Collapse defaultActiveKey={['1', '2', '3', '4', '5']}>
            {/* ---------------- 通用属性 ---------------- */}
            <Collapse.Panel header='位置' key='1'>
              <Form.Item label='x' name='x' rules={[{ required: true, message: '请输入x坐标' }]}>
                <InputNumber className='w-full' size='small' />
              </Form.Item>
              <Form.Item label='y' name='y' rules={[{ required: true, message: '请输入y坐标' }]}>
                <InputNumber className='w-full' size='small' />
              </Form.Item>
              <Form.Item label='x偏移量' name='xOffset' rules={[{ required: true, message: '请输入x偏移量' }]}>
                <InputNumber className='w-full' size='small' />
              </Form.Item>
              <Form.Item label='y偏移量' name='yOffset' rules={[{ required: true, message: '请输入y偏移量' }]}>
                <InputNumber className='w-full' size='small' />
              </Form.Item>
              <Form.Item label='旋转角度' name='rotation' rules={[{ required: true, message: '请输入旋转角度' }]}>
                <InputNumber className='w-full' size='small' />
              </Form.Item>
              <Form.Item label='楼层颜色' name='floorColor'>
                <ColorPicker defaultValue='#1677ff' size='small' />
              </Form.Item>
              <Form.Item name='isEnabled' valuePropName='checked' label={'是否启用'}>
                <Checkbox></Checkbox>
              </Form.Item>
            </Collapse.Panel>
            {/* ---------------- 高级属性 ---------------- */}
            <Collapse.Panel header='高级属性' key='3'>
              <Form.Item
                label='连接超时时间'
                name='connectTimeout'
                rules={[{ required: true, message: '请输入连接超时时间' }]}
              >
                <Input size='small' />
              </Form.Item>
              <Form.Item
                label='接收超时时间'
                name='receiveTimeout'
                rules={[{ required: true, message: '请输入接收超时时间' }]}
              >
                <Input size='small' />
              </Form.Item>
              <Form.Item label='模式' name='mode' rules={[{ required: true, message: '请选择模式' }]}>
                <Select
                  size='small'
                  options={[
                    { label: '自动', value: 'auto' },
                    { label: '手动', value: 'manual' },
                  ]}
                />
              </Form.Item>
              <Form.Item label='站点编号' name='stationId' rules={[{ required: true, message: '请输入站点编号' }]}>
                <Input size='small' />
              </Form.Item>
              <Form.Item label='编码类型' name='encodingType' rules={[{ required: true, message: '请选择编码类型' }]}>
                <Select
                  size='small'
                  options={[
                    { label: 'ASCII', value: 'ascii' },
                    { label: 'HEX', value: 'hex' },
                  ]}
                />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </div>
    </div>
  );
};

export default DrawNavigationParamsPanel;
