# MES 工作流设计器 (WorkflowDesigner) 前端设计文档

## 1. 概述

`WorkflowDesigner` 是一个基于 React Flow 和 Zustand 构建的，专为 MES (制造执行系统) 场景设计的工作流编辑器。它旨在提供一个直观、高效的界面，用于设计、配置和管理复杂的生产流程。

## 2. 核心功能

*   **可视化编排**: 支持通过拖拽节点和连线来直观地设计工作流。
*   **丰富的节点库**: 预置了多种 MES 专用节点（如数据采集、处理、控制、执行、集成等），并支持动态扩展。
*   **智能交互**:
    *   **拖拽创建**: 从侧边栏直接拖拽节点到画布。
    *   **自动连接**: 点击节点句柄或拖拽连线到空白处，可自动弹出菜单创建并连接新节点。
*   **属性配置**: 选中节点后，右侧面板自动展开，支持编辑节点基本信息及特定参数，支持动态添加自定义参数。
*   **历史记录**: 内置撤销/重做栈，并通过可视化面板展示操作历史。
*   **流程验证**: 保存前自动检查流程连通性，高亮显示异常节点。
*   **UI/UX**: 深度集成的暗黑模式，流畅的面板展开/收起动画 (Framer Motion)。

## 3. 架构设计

### 3.1 技术栈

*   **核心库**: `React`, `TypeScript`
*   **可视化引擎**: `@xyflow/react` (React Flow)
*   **状态管理**: `Zustand`
*   **UI 组件库**: `Ant Design`
*   **样式库**: `Tailwind CSS`
*   **动画库**: `Framer Motion`

### 3.2 目录结构

```
packages/app-global/src/WorkflowDesigner/
├── components/
│   ├── Canvas.tsx           # 核心画布组件，封装 React Flow
│   ├── Sidebar.tsx          # 左侧节点库面板，支持拖拽
│   ├── PropertiesPanel.tsx  # 右侧属性配置面板，支持动态参数
│   ├── HistoryPanel.tsx     # 左侧历史记录面板
│   ├── Nodes/               # 自定义节点组件
│   │   ├── BaseNode.tsx     # 基础节点包装器（处理通用逻辑和样式）
│   │   ├── StartNode.tsx    # 开始节点
│   │   ├── EndNode.tsx      # 结束节点
│   │   └── CommonNode.tsx   # 通用业务节点
│   └── Controls/            # 画布控制条（缩放、适配等）
├── store/
│   └── useWorkflowStore.ts  # Zustand Store，管理所有状态和逻辑
├── types/
│   └── index.ts             # 类型定义
├── hooks/                   # 自定义 Hooks
└── index.tsx                # 组件入口，布局容器
```

## 4. 数据模型

### 4.1 节点类型 (WorkflowNodeType)

```typescript
type WorkflowNodeType =
  | 'start'
  | 'end'
  | 'data-acquisition'
  | 'processing'
  | 'control'
  | 'execution'
  | 'integration'
  | 'sub-process'
  | 'condition'    // 新增
  | 'classifier';  // 新增
```

### 4.2 节点数据 (WorkflowNodeData)

```typescript
interface WorkflowNodeData {
  label: string;           // 节点显示名称
  type: WorkflowNodeType;  // 节点类型
  description?: string;    // 描述
  status?: 'pending' | 'running' | 'success' | 'failure'; // 运行状态
  isValid?: boolean;       // 验证状态
  params?: Record<string, any>; // 动态参数
}
```

### 4.3 状态管理 (Store)

`useWorkflowStore` 是整个组件的大脑，负责：

*   **节点/连线管理**: `nodes`, `edges`, `addNode`, `deleteNode`, `onConnect` 等。
*   **历史记录**: `history` (past/future), `undo`, `redo`。每次状态变更自动入栈。
*   **节点库管理**: `nodeLibrary`, `addNodeTemplate`, `updateNodeTemplate`。
*   **验证逻辑**: `validateWorkflow`，遍历图结构检查连通性。

## 5. 交互设计细节

### 5.1 节点创建流程

1.  **侧边栏拖拽**:
    *   用户从 `Sidebar` 拖拽图标。
    *   `Canvas` 监听 `onDrop` 事件，计算坐标并调用 `addNode`。
2.  **句柄交互**:
    *   用户悬停在节点右侧句柄，出现 `+` 图标。
    *   点击 `+` 或句柄，触发 `workflow:handle-click` 自定义事件。
    *   `Canvas` 捕获事件，在对应位置显示 `Dropdown` 菜单。
    *   用户选择节点类型，系统自动创建节点并生成 `Edge` 连接。

### 5.2 属性编辑

*   面板使用 `Framer Motion` 实现平滑的滑入/滑出效果。
*   当 `selectedNodeId` 变化时，面板自动更新表单值。
*   支持 `Form.List` 动态添加 Key-Value 参数对，满足灵活配置需求。

### 5.3 历史记录

*   所有对 `nodes` 和 `edges` 的修改操作都会自动触发 `saveHistory`。
*   `HistoryPanel` 展示操作栈的长度和简单的记录列表。
*   支持 `Undo` (撤销) 和 `Redo` (重做)。

## 6. 扩展性

*   **新增节点**: 只需在 `types` 中定义新类型，在 `store` 的 `nodeLibrary` 中添加模板，并在 `Canvas` 的 `nodeTypes` 中注册组件即可。
*   **自定义渲染**: `BaseNode` 提供了通用的外壳，内部可以通过 `children` 渲染任意 React 内容。

## 7. 后续规划

*   支持子流程节点的展开编辑。
*   集成后端 API 实现真实的流程保存和加载。
*   添加更多高级控制节点（如循环、并发控制）。
