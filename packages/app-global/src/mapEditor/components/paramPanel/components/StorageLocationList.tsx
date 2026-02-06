import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Select,
  Tooltip,
} from 'antd';
import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useVehicleModelStore } from '../../../../VehicleModelManagement/store/useVehicleModelStore';
import { useMapEditorStore } from '../../../store';
import { useStorageLocationStore } from '../../../three/components/drawStorageLocation/store/storageLocationStore';

const StorageLocationList: React.FC = () => {
  const {
    storageLocations,
    removeStorageLocation,
    select,
    selectedIds,
    updateStorageLocation,
    setShowBindVehicleDialog,
    editingPoint,
    setEditingPoint,
    setFocusTarget,
  } = useStorageLocationStore(
    useShallow((state) => ({
      storageLocations: state.storageLocations,
      removeStorageLocation: state.removeStorageLocation,
      select: state.select,
      selectedIds: state.selectedIds,
      updateStorageLocation: state.updateStorageLocation,
      setShowBindVehicleDialog: state.setShowBindVehicleDialog,
      editingPoint: state.editingPoint,
      setEditingPoint: state.setEditingPoint,
      setFocusTarget: state.setFocusTarget,
    })),
  );

  const { models } = useVehicleModelStore(
    useShallow((store) => ({ models: store.models })),
  );

  const { staticPoints, setStaticPoints } = useMapEditorStore(
    useShallow((state) => ({
      staticPoints: state.staticPoints,
      setStaticPoints: state.setStaticPoints,
    })),
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [form] = Form.useForm();
  const [pointForm] = Form.useForm();

  const handleRemoveLocation = (id: string) => {
    // 1. Remove points
    const newStaticPoints = staticPoints.filter(
      (p) => p.storageLocationId !== id,
    );
    setStaticPoints(newStaticPoints);
    // 2. Remove location
    removeStorageLocation(id);
  };

  const handleEdit = (item: any) => {
    setEditingLocation(item);
    form.setFieldsValue({
      name: item.name,
      storageType: item.storageType,
      allowedVehicleModelIds: item.allowedVehicleModelIds || [],
    });
    setIsEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingLocation) {
        updateStorageLocation(editingLocation.id, {
          name: values.name,
          storageType: values.storageType,
          allowedVehicleModelIds: values.allowedVehicleModelIds,
        });
        setIsEditModalOpen(false);
        setEditingLocation(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Group storage locations by storageType
  const groupedLocations = storageLocations.reduce((acc, loc) => {
    const type = loc.storageType || '其他';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(loc);
    return acc;
  }, {} as Record<string, typeof storageLocations>);

  const handlePointEdit = (point: any) => {
    setEditingPoint(point);
    // Calculate relative offset
    const location = storageLocations.find(
      (l) => l.id === point.storageLocationId,
    );
    if (location) {
      pointForm.setFieldsValue({
        offsetX: point.position.x - location.position.x,
        offsetY: point.position.y - location.position.y,
      });
    }
  };

  const savePointOffset = async () => {
    try {
      const values = await pointForm.validateFields();
      const location = storageLocations.find(
        (l) => l.id === editingPoint.storageLocationId,
      );
      if (location && editingPoint) {
        const newPosition = {
          x: location.position.x + values.offsetX,
          y: location.position.y + values.offsetY,
          z: editingPoint.position.z, // Keep Z
        };

        const newStaticPoints = staticPoints.map((p) =>
          p.id === editingPoint.id ? { ...p, position: newPosition } : p,
        );
        setStaticPoints(newStaticPoints);
        setEditingPoint(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='p-2 border-b border-gray-700'>
        <span className='text-white font-bold'>
          库位列表 ({storageLocations.length})
        </span>
      </div>
      <div className='flex-1 overflow-y-auto'>
        <Collapse
          defaultActiveKey={Object.keys(groupedLocations)}
          ghost
          items={Object.keys(groupedLocations).map((type) => ({
            key: type,
            label: (
              <span className='text-white font-bold'>
                {type} ({groupedLocations[type].length})
              </span>
            ),
            children: (
              <List
                dataSource={groupedLocations[type]}
                renderItem={(item) => (
                  <List.Item
                    className={`cursor-pointer hover:bg-gray-800 transition-colors px-4 py-2 ${
                      selectedIds.includes(item.id) ? 'bg-blue-900/30' : ''
                    }`}
                    onClick={() => {
                      select([item.id]);
                      setFocusTarget(item.id);
                    }}
                    actions={[
                      <Tooltip title='绑定车型'>
                        <Button
                          type='text'
                          icon={<LinkOutlined />}
                          size='small'
                          className='text-green-500 hover:text-green-400'
                          onClick={(e) => {
                            e.stopPropagation();
                            select([item.id]);
                            setShowBindVehicleDialog(true);
                          }}
                        />
                      </Tooltip>,
                      <Tooltip title='修改属性'>
                        <Button
                          type='text'
                          icon={<EditOutlined />}
                          size='small'
                          className='text-blue-500 hover:text-blue-400'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                        />
                      </Tooltip>,
                      <Popconfirm
                        title='确认删除该库位?'
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          handleRemoveLocation(item.id);
                        }}
                        onCancel={(e) => e?.stopPropagation()}
                        okText='是'
                        cancelText='否'
                      >
                        <Button
                          type='text'
                          danger
                          icon={<DeleteOutlined />}
                          size='small'
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>,
                    ]}
                  >
                    <div className='flex flex-col'>
                      <span className='text-white'>{item.name}</span>
                      <span className='text-gray-500 text-xs'>
                        {item.position.x.toFixed(2)},{' '}
                        {item.position.y.toFixed(2)}
                      </span>
                    </div>
                  </List.Item>
                )}
              />
            ),
          }))}
        />
      </div>

      <Modal
        title='修改库位属性'
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalOpen(false)}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            label='库位名称'
            rules={[{ required: true, message: '请输入库位名称' }]}
          >
            <Input placeholder='请输入库位名称' />
          </Form.Item>
          <Form.Item
            name='storageType'
            label='库位类型'
            initialValue='平库工位'
          >
            <Select
              placeholder='请选择库位类型'
              options={[
                { label: '平库工位', value: '平库工位' },
                { label: '货架工位', value: '货架工位' },
                { label: '堆叠工位', value: '堆叠工位' },
              ]}
            />
          </Form.Item>
          <Form.Item name='allowedVehicleModelIds' label='允许绑定的车型'>
            <Select
              mode='multiple'
              placeholder='选择允许的车型'
              options={models.map((m) => ({ label: m.name, value: m.id }))}
            />
          </Form.Item>

          <div className='mt-4 border-t pt-4'>
            <h4 className='font-bold mb-2'>已绑定车型</h4>
            {editingLocation?.vehicleModelIds?.length > 0 ? (
              <List
                size='small'
                dataSource={editingLocation.vehicleModelIds}
                renderItem={(id: string) => {
                  const model = models.find((m) => m.id === id);
                  return <List.Item>{model?.name || id}</List.Item>;
                }}
              />
            ) : (
              <div className='text-gray-400'>暂无绑定车型</div>
            )}
          </div>

          <div className='mt-4 border-t pt-4'>
            <h4 className='font-bold mb-2'>生成的停车点 (点击编辑偏移)</h4>
            <List
              size='small'
              dataSource={staticPoints.filter(
                (p) => p.storageLocationId === editingLocation?.id,
              )}
              renderItem={(point: any) => (
                <List.Item
                  actions={[
                    <Button
                      type='link'
                      size='small'
                      onClick={() => handlePointEdit(point)}
                    >
                      编辑偏移
                    </Button>,
                  ]}
                >
                  <div className='flex flex-col'>
                    <span>{point.name}</span>
                    <span className='text-xs text-gray-500'>
                      Offset: X=
                      {(
                        point.position.x - (editingLocation?.position.x || 0)
                      ).toFixed(2)}
                      , Y=
                      {(
                        point.position.y - (editingLocation?.position.y || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Form>
      </Modal>

      <Modal
        title='编辑停车点偏移'
        open={!!editingPoint}
        onOk={savePointOffset}
        onCancel={() => setEditingPoint(null)}
        destroyOnClose
      >
        <Form form={pointForm} layout='vertical'>
          <Form.Item
            name='offsetX'
            label='偏移量 X'
            rules={[{ required: true }]}
          >
            <InputNumber className='w-full' />
          </Form.Item>
          <Form.Item
            name='offsetY'
            label='偏移量 Y'
            rules={[{ required: true }]}
          >
            <InputNumber className='w-full' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StorageLocationList;
