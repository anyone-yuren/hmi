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

  const paddingX = 40;
  const paddingY = 40;
  const gapX = 60; // 水平间距
  const gapY = 80; // 垂直间距 (子节点)

  const positionMap = new Map<string, { x: number; y: number }>();

  const nodes: Node<CapabilityNodeData>[] = [];
  const edges: Edge[] = []; // 改为手动收集 Edge，以便过滤

  let currentX = paddingX;
  const startY = 300; // 主节点所在的 Y 轴基线

  // 1. 布局主节点
  CAPABILITY_STRUCTURE.forEach((config) => {
    const { id, children } = config;

    // 假设每个节点的宽度自适应，这里先给个估算值，或者后续可以动态测量
    // 但 ReactFlow 布局通常需要预先计算位置。
    // 为了让宽度自适应，我们在 Node 组件里不限制 width，但在布局计算时假设一个最小宽度
    const estimatedWidth = 150;

    const x = currentX;
    const y = startY;

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
      // 子节点垂直排列在主节点上方
      // 计算子节点的总高度
      // 子节点从下往上排，最底下的子节点离主节点一定距离

      // 子节点 X 坐标与主节点对齐 (或者稍微偏移)
      const childX = x; // 左对齐

      children!.forEach((childId, childIndex) => {
        // childIndex 0 是第一个子节点，放在最上面还是最下面？
        // 需求：子节点纵向垂直排列
        // 我们可以从主节点上方开始往上排
        // index 0: y - gapY
        // index 1: y - gapY - height - gapY ...

        // 反过来，从最上面往下排？
        // 让我们假设子节点是向上生长的树枝
        // 最后一个子节点离主节点最近
        // childIndex 0 (lidar_2d) -> 最上面
        // childIndex 2 (lidar_loc) -> 最下面 (离 lidar 最近)

        // 或者简单的：从下往上排
        // 第 i 个子节点 y = startY - (children.length - i) * gapY

        // 调整顺序：让列表里的第一个元素在最上面
        const reverseIndex = children!.length - 1 - childIndex;
        const childY = y - (reverseIndex + 1) * gapY;

        positionMap.set(childId, { x: childX, y: childY });

        nodes.push({
          id: childId,
          type: 'capability',
          position: { x: childX, y: childY },
          // style: { width: estimatedWidth }, // 让它自适应
          data: {
            label: CAPABILITY_LABEL[childId],
            status: statusMap[childId],
          },
        });
      });
    }

    currentX += estimatedWidth + gapX;
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

    // 特殊处理子节点到父节点的连线
    // 子节点在上方 (y 小)，父节点在下方 (y 大)
    // source (child) -> target (parent)
    // dy > 0
    // 垂直排列时，连线最好是 Bottom -> Top

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
            ? '#00d1d1'
            : statusMap[source] === 'ready'
            ? '#faad14'
            : '#d9d9d9',
        strokeWidth: 2,
      },
    });
  });

  return { nodes, edges };
}
