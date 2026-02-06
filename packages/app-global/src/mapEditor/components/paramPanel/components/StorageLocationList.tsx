import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, List, Popconfirm, Tooltip, Modal, Input, Form } from 'antd';
import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStorageLocationStore } from '../../../three/components/drawStorageLocation/store/storageLocationStore';

const StorageLocationList: React.FC = () => {
  const { 
    storageLocations, 
    removeStorageLocation, 
    select, 
    selectedIds, 
    updateStorageLocation,
    setShowBindVehicleDialog 
  } = useStorageLocationStore(
    useShallow((state) => ({
      storageLocations: state.storageLocations,
      removeStorageLocation: state.removeStorageLocation,
      select: state.select,
      selectedIds: state.selectedIds,
      updateStorageLocation: state.updateStorageLocation,
      setShowBindVehicleDialog: state.setShowBindVehicleDialog,
    }))
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [form] = Form.useForm();

  const handleEdit = (item: any) => {
    setEditingLocation(item);
    form.setFieldsValue({ name: item.name });
    setIsEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingLocation) {
        updateStorageLocation(editingLocation.id, { name: values.name });
        setIsEditModalOpen(false);
        setEditingLocation(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-gray-700">
        <span className="text-white font-bold">库位列表 ({storageLocations.length})</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <List
          dataSource={storageLocations}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-800 transition-colors px-4 py-2 ${
                selectedIds.includes(item.id) ? 'bg-blue-900/30' : ''
              }`}
              onClick={() => select([item.id])}
              actions={[
                <Tooltip title="绑定车型">
                  <Button
                    type="text"
                    icon={<LinkOutlined />}
                    size="small"
                    className="text-green-500 hover:text-green-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      select([item.id]);
                      setShowBindVehicleDialog(true);
                    }}
                  />
                </Tooltip>,
                <Tooltip title="修改名称">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    className="text-blue-500 hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  />
                </Tooltip>,
                <Popconfirm
                  title="确认删除该库位?"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    removeStorageLocation(item.id);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                  okText="是"
                  cancelText="否"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>,
              ]}
            >
              <div className="flex flex-col">
                <span className="text-white">{item.name}</span>
                <span className="text-gray-500 text-xs">
                  {item.position.x.toFixed(2)}, {item.position.y.toFixed(2)}
                </span>
              </div>
            </List.Item>
          )}
        />
      </div>

      <Modal
        title="修改库位"
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="库位名称"
            rules={[{ required: true, message: '请输入库位名称' }]}
          >
            <Input placeholder="请输入库位名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StorageLocationList;
