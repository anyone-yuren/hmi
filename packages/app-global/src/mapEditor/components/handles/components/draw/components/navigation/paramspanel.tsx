import { Checkbox, Collapse, ColorPicker, Form, Input, InputNumber, Tree } from 'antd';
import { useEffect, useMemo, useState } from 'react';
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
      title: '库位点',
      key: 'libraryPoint',
      children: new Array(10).fill(0).map((_, index) => ({
        title: `库位点 ${index + 1}`,
        key: `libraryPoint-${index + 1}`,
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
    // if (!floorOffset) {
    //   form.resetFields();
    //   return;
    // }
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
      <div className='flex-1 rounded-sm p-2 overflow-auto w-full'>
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
            <Collapse.Panel header='楼层属性' key='1'>
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
            <Collapse.Panel header='楼层数据' key='3'>
              <Tree
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
              />
            </Collapse.Panel>
          </Collapse>
        </Form>
      </div>
    </div>
  );
};

export default DrawNavigationParamsPanel;
