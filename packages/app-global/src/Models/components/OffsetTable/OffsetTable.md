# 库位点偏移表组件 (OffsetTable)

## 1. 概述

`OffsetTable` 是一个基于 React Three Fiber 的 3D 场景组件，用于可视化和编辑库位点的偏移量。它提供了直观的交互方式，允许用户通过点击或框选来选择库位点，并批量修改其偏移值。

## 2. 功能特性

### 2.1 3D 渲染
- **库位点**: 使用 `Mesh` (BoxGeometry) 渲染库位点，位置基于网格分布。
- **颜色标识**:
  - **默认**: 灰色 (`#d9d9d9`)
  - **选中**: 蓝色 (`#1890ff`)
  - **有偏移**: 黄色 (`#faad14`)
  - 选中状态的颜色优先级高于偏移状态。

### 2.2 交互操作
- **选择**:
  - **单选**: 鼠标左键点击单个库位点。
  - **多选 (Ctrl)**: 按住 `Ctrl` 或 `Cmd` 键点击，可叠加选择。
  - **框选**: 鼠标左键拖拽，绘制矩形框，选中框内的所有库位点。支持 `Ctrl` 叠加框选。
  - **取消选择**: 点击空白区域（不按 `Ctrl`）可清空选择。
- **导航**:
  - **平移**: 鼠标右键拖拽。
  - **缩放**: 鼠标滚轮滚动。
  - **重置**: 双击画布空白处（保留扩展接口）。

### 2.3 数据编辑
- **偏移量修改**: 选中库位点后，右下角会出现编辑面板。
- **批量修改**: 输入偏移值后，所有选中的库位点将同步更新。

## 3. 技术实现

### 3.1 核心依赖
- `@react-three/fiber`: 3D 渲染引擎。
- `@react-three/drei`: 提供 `MapControls`, `Html` 等实用组件。
- `three`: 基础 3D 库。

### 3.2 关键逻辑

#### 坐标转换 (World to Screen)
组件内部维护了 `getScreenPos` 方法，利用 `vector.project(camera)` 将 3D 世界坐标转换为 2D 屏幕坐标，用于框选判定。

#### 框选判定
在 `pointerup` 事件中，计算每个库位点的屏幕投影是否位于框选矩形范围内 (AABB 测试)。

#### 状态管理
- `points`: 存储所有库位点数据 `{ id, position, offset }`。
- `selectedIds`:存储当前选中的库位点 ID 集合 `Set<string>`。
- `selectionBox`: 存储框选的起始和结束屏幕坐标。

## 4. 使用示例

```tsx
import OffsetTableScene from './components/OffsetTable';

// 在 Canvas 中使用
<Canvas>
  <OffsetTableScene />
</Canvas>
```

## 5. 待优化项
- 大量数据（>1000点）时建议迁移至 `InstancedMesh` 以提升性能。
- 目前偏移修改仅在前端 State 中生效，需对接后端 API 进行持久化。
