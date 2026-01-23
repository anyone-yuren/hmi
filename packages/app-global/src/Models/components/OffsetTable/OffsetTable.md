# 库位点偏移表组件 (OffsetTable)

## 1. 概述

`OffsetTable` 是一个基于 React Three Fiber 的 3D 场景组件，用于可视化和编辑库位点的偏移量。它提供了直观的交互方式，允许用户通过点击或框选来选择库位点，并批量修改其偏移值。

## 2. 功能特性

### 2.1 3D 渲染
- **库位点**: 使用 `InstancedMesh` 渲染大量库位点（支持 10k+），大幅提升渲染性能。
- **标签显示**: 智能显示库位点 ID，仅在相机缩放级别足够大（放大查看）时显示，并限制同屏最大显示数量（50个），避免 DOM 性能瓶颈。
- **颜色标识**:
  - **默认**: 灰色 (`#d9d9d9`)
  - **选中**: 蓝色 (`#1890ff`)
  - **有偏移**: 黄色 (`#faad14`)
  - 选中状态的颜色优先级高于偏移状态。

### 2.2 交互操作
- **选择**:
  - **单选 (Ctrl/Meta + Click)**: 按住 `Ctrl` 或 `Cmd` 键点击单个库位点，可叠加选择。
  - **框选**: 鼠标左键拖拽绘制矩形框，选中框内的所有库位点。支持 `Ctrl` 叠加框选。
  - **右键菜单**: 右键点击库位点，选中该点并直接弹出偏移修改面板。
- **导航**:
  - **平移**: 鼠标右键拖拽。
  - **缩放**: 鼠标滚轮滚动。
- **编辑**:
  - **偏移量修改**: 选中库位点后，弹出可拖拽的编辑面板 (`Rnd` 组件)。
  - **批量修改**: 输入偏移值后，所有选中的库位点将同步更新。

## 3. 技术实现

### 3.1 核心依赖
- `@react-three/fiber`: 3D 渲染引擎。
- `@react-three/drei`: 提供 `MapControls`, `Html`, `Instances` 等实用组件。
- `three`: 基础 3D 库。
- `zustand`: 状态管理 (`useOffsetTableStore`)。
- `react-rnd`: 可拖拽 UI 面板。

### 3.2 关键逻辑

#### 性能优化 (InstancedMesh)
使用 `THREE.InstancedMesh` 替代数千个独立的 `Mesh` 对象。
- **矩阵更新**: 初始化时计算所有点位的变换矩阵。
- **颜色更新**: 当选中状态或偏移数据变化时，直接更新 `instanceColor` 缓冲区，避免重新创建几何体。

#### 智能标签 (OptimizedLabels)
- **视锥体剔除**: 每一帧（节流）计算视锥体，仅筛选出视野内的点位。
- **Zoom 阈值**: 仅当相机 Zoom > 25 时才开始计算和显示标签。
- **数量限制**: 强制限制同屏渲染的 HTML 标签数量（Max 50），优先显示视口内的前 50 个点。

#### 框选判定
利用屏幕空间投影算法：
1. 将所有点位的 3D 坐标投影到 2D 屏幕坐标。
2. 判断投影点是否位于鼠标拖拽形成的矩形框内。

## 4. 目录结构

```
src/Models/components/OffsetTable/
├── index.tsx            # 入口组件，场景配置与交互逻辑
├── store.ts             # Zustand 状态管理
├── OffsetTableUI.tsx    # 偏移量编辑弹窗
├── components/
│   ├── PointsLayer.tsx  # InstancedMesh 点位渲染层
│   └── LabelsLayer.tsx  # 智能标签渲染层
└── OffsetTable.md       # 本文档
```

## 5. 使用示例

```tsx
import OffsetTableScene from './components/OffsetTable';
import OffsetTableUI from './components/OffsetTable/OffsetTableUI';

// 在 Canvas 内部
<OffsetTableScene />

// 在 Canvas 外部 (UI 层)
<OffsetTableUI />
```
