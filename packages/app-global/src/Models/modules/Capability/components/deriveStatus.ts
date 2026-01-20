import type { CapabilityStatus } from '../types';

/**
 * 根据已完成的 capability，推导所有节点状态
 */
export function deriveCapabilityStatus(
  order: readonly string[],
  edges: string[][] | readonly string[][],
  doneSet: Set<string>,
): Record<string, CapabilityStatus> {
  const statusMap: Record<string, CapabilityStatus> = {};
  const dependencies: Record<string, string[]> = {};

  // 构建依赖关系
  for (const [source, target] of edges) {
    if (!dependencies[target]) {
      dependencies[target] = [];
    }
    dependencies[target].push(source);
  }

  for (const id of order) {
    if (doneSet.has(id)) {
      statusMap[id] = 'done';
      continue;
    }

    const deps = dependencies[id] || [];
    const isReady = deps.every((dep) => doneSet.has(dep));

    if (isReady) {
      statusMap[id] = 'ready';
    } else {
      statusMap[id] = 'disabled';
    }
  }

  return statusMap;
}
