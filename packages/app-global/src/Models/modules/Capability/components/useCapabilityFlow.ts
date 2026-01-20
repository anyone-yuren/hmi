import type { Edge, Node } from '@xyflow/react';
import type { CapabilityNodeData } from '../types';
import { deriveCapabilityStatus } from './deriveStatus';
import { CAPABILITY_LABEL, CAPABILITY_ORDER, EDGES } from './topology';

export function buildCapabilityFlow(done: string[], containerWidth: number) {
  const doneSet = new Set(done);
  const statusMap = deriveCapabilityStatus(CAPABILITY_ORDER, doneSet);

  const columns = 4;
  const colGap = 40;
  const rowGap = 100;

  const nodeWidth = (containerWidth - colGap * (columns - 1)) / columns;
  const positionMap = new Map<string, { x: number; y: number }>();

  const nodes: Node<CapabilityNodeData>[] = CAPABILITY_ORDER.map(
    (id, index) => {
      const row = Math.floor(index / columns);
      const colInRow = index % columns;
      const isReverseRow = row % 2 === 1;

      const col = isReverseRow ? columns - 1 - colInRow : colInRow;

      const x = col * (nodeWidth + colGap);
      const y = row * rowGap;

      positionMap.set(id, { x, y });

      return {
        id,
        type: 'capability',
        position: { x, y },
        data: {
          label: CAPABILITY_LABEL[id],
          status: statusMap[id],
        },
      };
    },
  );

  const edges: Edge[] = EDGES.map(([source, target]) => {
    const sourcePos = positionMap.get(source)!;
    const targetPos = positionMap.get(target)!;

    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;

    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    let sourceHandle: string;
    let targetHandle: string;

    if (isHorizontal) {
      const leftToRight = dx > 0;
      sourceHandle = leftToRight ? 'right' : 'left-source';
      targetHandle = leftToRight ? 'left' : 'right-target';
    } else {
      const topToBottom = dy > 0;
      sourceHandle = topToBottom ? 'bottom' : 'top';
      targetHandle = topToBottom ? 'top' : 'bottom';
    }

    return {
      id: `${source}-${target}`,
      source,
      target,
      sourceHandle,
      targetHandle,
      animated: statusMap[source] === 'done',
      style: {
        stroke:
          statusMap[source] === 'done'
            ? '#52c41a'
            : statusMap[source] === 'ready'
            ? '#faad14'
            : '#d9d9d9',
        strokeWidth: 2,
      },
    };
  });

  return { nodes, edges };
}
