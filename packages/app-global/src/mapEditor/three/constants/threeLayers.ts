/**
 * Three.js Layer 统一定义
 *
 * 0 是 three.js 默认层，不要用
 * 编辑器中的可选物体统一放到 draw 层
 */

export const THREE_LAYERS = {
  /** 默认层（three.js 内置） */
  DEFAULT: 0,
  LABEL: 2, // Sprite / Html / 文本
  UI: 3, // 编辑器 UI（控制点 / 包围盒）
  DEBUG: 4, // 调试用
  /** 编辑器绘制层（点 / 线 / 面 / 设备） */
  DRAW: 10,
  /** 辅助层（网格 / 坐标轴 / helper） */
  HELPER: 11,
} as const;
