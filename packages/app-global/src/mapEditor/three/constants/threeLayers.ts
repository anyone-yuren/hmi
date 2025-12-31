/**
 * Three.js Layer 统一定义
 *
 * 0 是 three.js 默认层，不要用
 * 编辑器中的可选物体统一放到 draw 层
 */

export const THREE_LAYERS = {
  /** 默认层（three.js 内置） */
  DEFAULT: 0,

  /** 编辑器绘制层（点 / 线 / 面 / 设备） */
  DRAW: 10,

  /** 辅助层（网格 / 坐标轴 / helper） */
  HELPER: 11,

  /** UI 层（sprite label / gizmo / 控制器） */
  UI: 12,
} as const;
