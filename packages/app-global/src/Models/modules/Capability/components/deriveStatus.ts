import type { CapabilityStatus } from '../types';

/**
 * 根据已完成的 capability，推导所有节点状态
 */
export function deriveCapabilityStatus(
  order: readonly string[],
  doneSet: Set<string>,
): Record<string, CapabilityStatus> {
  const statusMap: Record<string, CapabilityStatus> = {};

  for (let i = 0; i < order.length; i++) {
    const id = order[i];

    if (doneSet.has(id)) {
      statusMap[id] = 'done';
      continue;
    }

    const prev = order[i - 1];
    if (!prev || doneSet.has(prev)) {
      statusMap[id] = 'ready';
    } else {
      statusMap[id] = 'disabled';
    }
  }

  return statusMap;
}
