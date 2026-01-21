# MES 工作流设计器组件文档

## 简介

`WorkflowDesigner` 是一个基于 React Flow 和 Zustand 构建的，专为 MES (制造执行系统) 场景设计的工作流编辑器。它支持拖拽创建节点、自动连接、属性编辑、撤销/重做、暗黑模式等高级功能。

## 功能特性

*   **节点拖拽**: 从侧边栏拖拽节点到画布。
*   **智能连接**: 
    *   拖拽连接线到空白处弹出菜单创建新节点。
    *   **点击节点右侧句柄**自动弹出菜单创建并连接新节点。
*   **节点管理**: 侧边栏支持新增、编辑和删除节点模板。
*   **属性编辑**: 选中节点后，右侧面板可编辑节点名称、描述及特定参数。
*   **历史记录**: 支持撤销 (Undo) 和重做 (Redo) 操作。
*   **流程验证**: 保存时自动检查节点连接完整性，并高亮显示未连接的节点。
*   **暗黑模式**: 深度集成的暗黑 UI 风格。

## 安装与使用

### 引入组件

```tsx
import WorkflowDesigner from 'packages/app-global/src/WorkflowDesigner';

const App = () => {
  return (
    <div style={{ height: '100vh' }}>
      <WorkflowDesigner />
    </div>
  );
};
```

## 核心概念

### 节点类型 (WorkflowNodeType)

系统预置了以下节点类型：

*   `start`: 开始节点
*   `end`: 结束节点
*   `data-acquisition`: 数据采集
*   `processing`: 处理节点
*   `control`: 控制逻辑
*   `execution`: 执行动作
*   `integration`: 系统集成
*   `sub-process`: 子流程

### 数据结构

#### WorkflowNodeData

```typescript
interface WorkflowNodeData {
  label: string;           // 节点显示名称
  type: WorkflowNodeType;  // 节点类型
  description?: string;    // 描述
  status?: 'pending' | 'running' | 'success' | 'failure'; // 运行状态
  isValid?: boolean;       // 验证状态（false 时显示红色边框）
  params?: Record<string, any>; // 动态参数（如 API URL, 设备ID）
}
```

## 状态管理 (Zustand Store)

`useWorkflowStore` 提供了对工作流状态的全面控制：

*   `nodes` / `edges`: 当前画布上的节点和连线。
*   `nodeLibrary`: 侧边栏可用的节点模板列表。
*   `history`: 撤销/重做栈。
*   `validateWorkflow()`: 验证流程连通性。
*   `addNodeTemplate()` / `updateNodeTemplate()` / `deleteNodeTemplate()`: 管理节点库。

## 开发指南

### 自定义节点

在 `components/Nodes` 目录下创建新的 React 组件，并使用 `BaseNode` 进行包装。然后在 `Canvas.tsx` 的 `nodeTypes` 中注册。

### 添加新属性字段

修改 `components/PropertiesPanel.tsx`，根据 `selectedNode.data.type` 渲染不同的 Form Item。

### 样式定制

组件使用 Tailwind CSS 进行样式开发。暗黑模式主要使用了 `bg-[#1f1f1f]`, `bg-[#2a2a2a]`, `border-gray-700` 等颜色变量。
