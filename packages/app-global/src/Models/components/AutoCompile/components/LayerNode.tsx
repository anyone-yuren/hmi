import { Handle, NodeProps, Position } from '@xyflow/react';
import { Checkbox, List, Select, Tooltip, Typography } from 'antd';
import { memo } from 'react';
import { DEPENDENCIES, useAutoCompileStore } from '../store';
import { LayerType } from '../types';

const { Text } = Typography;

interface LayerNodeData {
  layerId: LayerType;
  isHistoryView?: boolean;
}

const LayerNode = ({ data }: NodeProps<any>) => {
  const { layerId } = data as LayerNodeData;
  const layer = useAutoCompileStore((state) => state.layers[layerId]);
  const layers = useAutoCompileStore((state) => state.layers);
  const setLayerItem = useAutoCompileStore((state) => state.setLayerItem);
  const selectedHistoryId = useAutoCompileStore(
    (state) => state.selectedHistoryId,
  );
  const isReadOnly = !!selectedHistoryId;

  if (!layer) return null;

  const checkItemDependency = (itemId: string) => {
    const deps = DEPENDENCIES[itemId];
    if (!deps || deps.length === 0) return { disabled: false, message: '' };

    const allItems = Object.values(layers).flatMap((l) => l.items);
    const checkedIds = new Set(
      allItems.filter((i) => i.checked).map((i) => i.id),
    );

    for (const depId of deps) {
      if (!checkedIds.has(depId)) {
        return { disabled: true, message: `依赖项 ${depId} 未选中` };
      }
    }
    return { disabled: false, message: '' };
  };

  return (
    <div className='w-[300px] bg-black/10 rounded-md shadow-md border border-gray-200'>
      <div className='p-3 border-b border-gray-100 bg-black/20 rounded-t-md'>
        <Text strong>{layer.title}</Text>
      </div>

      {/* Input Handle (Target) - Top */}
      {layerId !== 'dependency' && (
        <Handle
          type='target'
          position={Position.Top}
          className='w-2 h-2 bg-blue-500'
        />
      )}

      <div className='p-2'>
        <List
          dataSource={layer.items}
          renderItem={(item) => {
            const { disabled: depDisabled, message: depMessage } =
              checkItemDependency(item.id);
            const disabled = isReadOnly || (!item.checked && depDisabled); // Disable only if trying to check, or if readonly.
            // Wait, if item IS checked, but dependencies are missing (e.g. unchecked later), should we disable unchecking? No.
            // Requirement: "Limit whether checkable".
            // Logic: If unchecked, and deps missing -> Disabled (Cannot check).
            // If checked, and deps missing -> Should allow uncheck? Yes.
            // If checked, and deps satisfied -> Allow uncheck.

            // Refined Logic:
            // Checkbox disabled if:
            // 1. isReadOnly
            // 2. !item.checked AND depDisabled (Cannot enable if deps missing)

            return (
              <List.Item className='!p-2 !border-b-0'>
                <div className='flex items-center justify-between w-full gap-2'>
                  <div className='flex items-center gap-2 flex-1 overflow-hidden nodrag'>
                    <Tooltip
                      title={!item.checked && depDisabled ? depMessage : ''}
                    >
                      <Checkbox
                        checked={item.checked}
                        disabled={disabled}
                        onChange={(e) =>
                          setLayerItem(layerId, item.id, {
                            checked: e.target.checked,
                          })
                        }
                      />
                    </Tooltip>
                    <Text ellipsis className='flex-1' title={item.name}>
                      {item.name}
                    </Text>
                  </div>
                  <Select
                    size='small'
                    value={item.version}
                    disabled={isReadOnly}
                    onChange={(val) =>
                      setLayerItem(layerId, item.id, { version: val })
                    }
                    className='w-[110px] nodrag'
                    options={item.versions.map((v) => ({
                      label: v,
                      value: v,
                    }))}
                  />
                </div>
              </List.Item>
            );
          }}
        />
      </div>

      {/* Output Handle (Source) - Bottom */}
      {layerId !== 'application' && (
        <Handle
          type='source'
          position={Position.Bottom}
          className='w-2 h-2 bg-blue-500'
        />
      )}
    </div>
  );
};

export default memo(LayerNode);
