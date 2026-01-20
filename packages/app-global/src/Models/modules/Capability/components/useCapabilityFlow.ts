import type { Edge, Node } from '@xyflow/react';
import type { CapabilityNodeData } from '../types';
import { deriveCapabilityStatus } from './deriveStatus';
import {
  CAPABILITY_LABEL,
  CAPABILITY_ORDER,
  CAPABILITY_STRUCTURE,
  EDGES,
} from './topology';

export function buildCapabilityFlow(
  done: string[],
  containerWidth: number,
  expandedNodes: Record<string, boolean>,
  onToggleExpand: (id: string, expanded: boolean) => void,
) {
  const doneSet = new Set(done);
  const statusMap = deriveCapabilityStatus(CAPABILITY_ORDER, EDGES, doneSet);

  const columns = 4;
  const colGap = 40;
  const rowGap = 140; // 增加行间距以容纳子节点

  const nodeWidth = (containerWidth - colGap * (columns - 1)) / columns;
  const positionMap = new Map<string, { x: number; y: number }>();

  const nodes: Node<CapabilityNodeData>[] = [];
  const edges: Edge[] = []; // 改为手动收集 Edge，以便过滤

  // 1. 布局主节点
  CAPABILITY_STRUCTURE.forEach((config, index) => {
    const { id, children } = config;

    const row = Math.floor(index / columns);
    const colInRow = index % columns;
    const isReverseRow = row % 2 === 1;

    const col = isReverseRow ? columns - 1 - colInRow : colInRow;

    const x = col * (nodeWidth + colGap);
    const y = row * rowGap;

    positionMap.set(id, { x, y });

    const hasChildren = !!children && children.length > 0;
    const isExpanded = expandedNodes[id] ?? true; // 默认展开

    nodes.push({
      id,
      type: 'capability',
      position: { x, y },
      data: {
        label: CAPABILITY_LABEL[id],
        status: statusMap[id],
        hasChildren,
        expanded: isExpanded,
        onToggleExpand: (val) => onToggleExpand(id, val),
      },
    });

    // 2. 布局子节点 (仅当展开时)
    if (hasChildren && isExpanded) {
      const childCount = children!.length;
      // 子节点放置在主节点上方
      // 计算子节点的起始 X 坐标，使其居中对齐
      // 假设每个子节点占用的宽度（含间距）
      // 这里的 nodeWidth 是主节点的宽度，子节点宽度假设相同
      // 为了不堆叠，我们可以缩小一点子节点的宽度，或者就在主节点宽度范围内挤一挤？
      // 或者向外扩展。

      // 简单策略：子节点并排在主节点上方，间距稍微紧凑一点
      const childWidth = nodeWidth * 0.8; // 子节点稍微小一点？或者保持一致
      const childGap = 10;
      const totalChildWidth =
        childCount * childWidth + (childCount - 1) * childGap;

      // 主节点中心 X
      const centerX = x + nodeWidth / 2;
      const startX = centerX - totalChildWidth / 2;

      // 上方偏移
      const offsetY = -80;

      children!.forEach((childId, childIndex) => {
        const childX = startX + childIndex * (childWidth + childGap);
        const childY = y + offsetY;

        positionMap.set(childId, { x: childX, y: childY });

        nodes.push({
          id: childId,
          type: 'capability',
          position: { x: childX, y: childY },
          style: { width: childWidth }, // 如果需要调整宽度
          data: {
            label: CAPABILITY_LABEL[childId],
            status: statusMap[childId],
          },
        });
      });
    }
  });

  // 3. 生成连线 (仅当源和目标节点都在图中时)
  EDGES.forEach(([source, target]) => {
    const sourcePos = positionMap.get(source);
    const targetPos = positionMap.get(target);

    // 如果任一节点不存在（可能被收起了），则不生成连线
    if (!sourcePos || !targetPos) return;

    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;

    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    let sourceHandle: string;
    let targetHandle: string;

    // 特殊处理子节点到父节点的连线（通常是垂直的，上方连下来）
    // 我们的子节点在上方，父节点在下方
    // source (child) -> target (parent)
    // dy > 0 (parent is below child)
    // sourceHandle: bottom
    // targetHandle: top

    if (isHorizontal) {
      const leftToRight = dx > 0;
      sourceHandle = leftToRight ? 'right' : 'left-source';
      targetHandle = leftToRight ? 'left' : 'right-target';
    } else {
      const topToBottom = dy > 0;
      sourceHandle = topToBottom ? 'bottom' : 'top';
      targetHandle = topToBottom ? 'top' : 'bottom';
    }

    edges.push({
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
    });
  });

  return { nodes, edges };
}
