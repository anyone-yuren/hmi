import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useOffsetTableStore } from './store';

export default function OffsetTableUI({
  boundsRef,
}: {
  boundsRef: React.RefObject<Element>;
}) {
  const { editModal, closeEditModal, updateOffset, points } =
    useOffsetTableStore();
  const [offsetValue, setOffsetValue] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Initialize value when modal opens
  useEffect(() => {
    if (editModal.visible && editModal.targetIds.length > 0) {
      // If single selection, show its value
      if (editModal.targetIds.length === 1) {
        const point = points.find((p) => p.id === editModal.targetIds[0]);
        if (point) setOffsetValue(point.offset);
      } else {
        // Multiple selection: check if all have same value
        const targetPoints = points.filter((p) =>
          editModal.targetIds.includes(p.id),
        );
        const firstVal = targetPoints[0]?.offset || 0;
        const allSame = targetPoints.every((p) => p.offset === firstVal);
        setOffsetValue(allSame ? firstVal : { x: 0, y: 0 });
      }
    }
  }, [editModal.visible, editModal.targetIds, points]);

  if (!editModal.visible) return null;

  const handleSave = () => {
    updateOffset(editModal.targetIds, offsetValue);
    closeEditModal();
  };

  return (
    <Rnd
      default={{
        x: editModal.x + 20, // Offset slightly from mouse
        y: editModal.y - 180,
        width: 240,
        height: 260,
      }}
      bounds={boundsRef.current}
      className='z-50 bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-xl overflow-hidden'
      dragHandleClassName='modal-header'
    >
      <div className='flex flex-col h-full text-gray-200'>
        <div className='modal-header flex items-center justify-between p-3 border-b border-gray-700 cursor-move bg-[#2a2a2a]'>
          <span className='font-medium'>修改偏移量</span>
          <CloseOutlined
            className='cursor-pointer hover:text-red-400'
            onClick={closeEditModal}
          />
        </div>

        <div className='p-4 flex-1 flex flex-col gap-4'>
          <div className='text-xs text-gray-400'>
            已选择: {editModal.targetIds.length} 个库位
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-sm'>偏移值x:</span>
            <InputNumber
              value={offsetValue.x}
              onChange={(val) =>
                setOffsetValue({ ...offsetValue, x: Number(val) })
              }
              className='flex-1'
              autoFocus
              size='small'
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm'>偏移值y:</span>
            <InputNumber
              value={offsetValue.y}
              size='small'
              onChange={(val) =>
                setOffsetValue({ ...offsetValue, y: Number(val) })
              }
              className='flex-1'
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
          </div>

          <div className='mt-auto flex justify-end'>
            <Button
              type='primary'
              size='small'
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    </Rnd>
  );
}
