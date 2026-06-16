import { Rnd } from 'react-rnd';
import { useShallow } from 'zustand/react/shallow';
import { Button, Form, InputNumber, Table, Space, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useStorageLocationStore } from '../store/storageLocationStore';
import { useMapEditorStore } from '../../../../store';
import { useState, useEffect } from 'react';
import * as THREE from 'three';

interface ShelfConfigPanelProps {
  boundsRef: React.RefObject<Element>;
}

const ShelfConfigPanel = ({ boundsRef }: ShelfConfigPanelProps) => {
  const {
    showShelfConfigDialog,
    setShowShelfConfigDialog,
    selectedIds,
    storageLocations,
    updateStorageLocation,
  } = useStorageLocationStore(
    useShallow((store) => ({
      showShelfConfigDialog: store.showShelfConfigDialog,
      setShowShelfConfigDialog: store.setShowShelfConfigDialog,
      selectedIds: store.selectedIds,
      storageLocations: store.storageLocations,
      updateStorageLocation: store.updateStorageLocation,
    }))
  );

  const [layers, setLayers] = useState<any[]>([]);

  // Initialize layers from the first selected location if available
  useEffect(() => {
    if (showShelfConfigDialog && selectedIds.length > 0) {
      const firstLocation = storageLocations.find((l) => l.id === selectedIds[0]);
      if (firstLocation && firstLocation.shelfConfig?.layers) {
        setLayers(firstLocation.shelfConfig.layers.map((l, index) => ({ ...l, key: index })));
      } else {
        // Default one layer
        setLayers([{ key: 0, height: 1.5, offsetX: 1.0, offsetY: 0, angle: 0 }]);
      }
    }
  }, [showShelfConfigDialog, selectedIds]);

  if (!showShelfConfigDialog) return null;

  const handleSave = () => {
    const config = {
      layers: layers,
    };

    selectedIds.forEach((id) => {
      updateStorageLocation(id, {
        type: 'shelf',
        shelfConfig: config,
      });
    });

    message.success(`已更新 ${selectedIds.length} 个库位的货架配置`);
    setShowShelfConfigDialog(false);
  };

  const columns = [
    {
      title: '层级',
      render: (_: any, __: any, index: number) => `第 ${index + 1} 层`,
      width: 80,
    },
    {
      title: '高度(m)',
      dataIndex: 'height',
      render: (val: number, record: any, index: number) => (
        <InputNumber
          value={val}
          onChange={(v) => {
            const newLayers = [...layers];
            newLayers[index].height = v;
            setLayers(newLayers);
          }}
          step={0.1}
          size="small"
        />
      ),
    },
    {
      title: '偏移X(m)',
      dataIndex: 'offsetX',
      render: (val: number, record: any, index: number) => (
        <InputNumber
          value={val}
          onChange={(v) => {
            const newLayers = [...layers];
            newLayers[index].offsetX = v;
            setLayers(newLayers);
          }}
          step={0.1}
          size="small"
        />
      ),
    },
    {
      title: '偏移Y(m)',
      dataIndex: 'offsetY',
      render: (val: number, record: any, index: number) => (
        <InputNumber
          value={val}
          onChange={(v) => {
            const newLayers = [...layers];
            newLayers[index].offsetY = v;
            setLayers(newLayers);
          }}
          step={0.1}
          size="small"
        />
      ),
    },
    {
      title: '操作',
      render: (_: any, record: any, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            const newLayers = layers.filter((_, i) => i !== index);
            setLayers(newLayers);
          }}
        />
      ),
      width: 60,
    },
  ];

  return (
    <Rnd
      default={{
        x: 400,
        y: 200,
        width: 500,
        height: 400,
      }}
      minWidth={400}
      minHeight={300}
      bounds={boundsRef.current!}
      className="bg-[#1e1e1e] rounded-md shadow-lg flex flex-col"
      style={{ zIndex: 10000 }}
      cancel=".ant-table, .ant-input-number, button"
    >
      <div className="h-10 px-3 flex items-center justify-between border-b border-[#333] cursor-move shrink-0">
        <span className="text-white">货架配置</span>
        <span
          className="cursor-pointer text-white"
          onClick={() => setShowShelfConfigDialog(false)}
        >
          ✕
        </span>
      </div>

      <div className="flex-1 p-3 overflow-auto flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">
            配置选中库位的货架层级信息。每层将生成对应的停车点。
          </span>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setLayers([
                ...layers,
                { key: Date.now(), height: 1.5, offsetX: 1.0, offsetY: 0, angle: 0 },
              ]);
            }}
          >
            添加层
          </Button>
        </div>

        <Table
          dataSource={layers}
          columns={columns}
          pagination={false}
          size="small"
          scroll={{ y: 240 }}
          rowKey="key"
        />
      </div>

      <div className="p-3 border-t border-[#333] flex justify-end gap-2 shrink-0">
        <Button onClick={() => setShowShelfConfigDialog(false)}>取消</Button>
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
      </div>
    </Rnd>
  );
};

export default ShelfConfigPanel;
