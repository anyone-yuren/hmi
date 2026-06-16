import { Checkbox, Modal } from 'antd';
import { useState } from 'react';
import { SelectableItem } from './type';
export function SelectionFilterModal({ open, candidates, onConfirm, onCancel }) {
  const [selectPoints, setSelectPoints] = useState(true);
  const [pointTypes, setPointTypes] = useState<SelectableItem['pointType'][]>([]);

  const filtered = candidates.filter((c) => {
    return c.type === 'point' && selectPoints && pointTypes.includes(c.pointType || 'normal');
  });

  return (
    <Modal title='框选过滤' open={open} onOk={() => onConfirm(filtered)} onCancel={onCancel}>
      <Checkbox checked={selectPoints} onChange={(e) => setSelectPoints(e.target.checked)}>
        点
      </Checkbox>

      <Checkbox.Group
        className='mt-2'
        value={pointTypes}
        onChange={(v) => setPointTypes(v as any)}
        options={[
          { label: '普通点', value: 'normal' },
          { label: '库位点', value: 'bin' },
          { label: '待命点', value: 'standby' },
        ]}
      />

      <div className='mt-2 text-gray-400'>命中数量：{filtered.length}</div>
    </Modal>
  );
}
