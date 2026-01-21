I will implement the requested enhancements for the WorkflowDesigner component.

### 1. Refactor Store for History & Node Library
*   **Update `useWorkflowStore.ts`**:
    *   Add `past` and `future` arrays to `WorkflowState` to store snapshots of `{ nodes, edges }`.
    *   Implement `undo` and `redo` actions.
    *   Wrap state-changing actions (`addNode`, `deleteNode`, `onConnect`, `onNodesChange`) to push the current state to `past` before modification.
    *   Add `nodeLibrary` state (array of node templates) and actions (`addNodeTemplate`, `updateNodeTemplate`, `deleteNodeTemplate`) to allow managing the sidebar items.
    *   Add `validateWorkflow` action to check for disconnected nodes and update `nodes` with validation status.

### 2. Update UI for Dark Mode
*   **Theme Integration**:
    *   Modify `WorkflowDesigner/index.tsx` to use dark backgrounds (`bg-gray-900`, `bg-[#1f1f1f]`) and light text.
    *   Update `Sidebar.tsx` and `PropertiesPanel.tsx` to match the dark theme (dark borders, dark input fields).
    *   Update `BaseNode.tsx` to use dark mode compatible colors (e.g., `bg-gray-800`, `text-white`).
    *   Configure `<ReactFlow colorMode="dark" />`.
    *   Update `MiniMap` and `Controls` styling if necessary.

### 3. Implement Handle Click & Auto-connect
*   **Enhance `BaseNode.tsx`**:
    *   Add `onClick` handler to `Handle` components.
    *   When clicked, invoke a store action or callback to set "connecting source" state and show the context menu.
*   **Update `Canvas.tsx`**:
    *   Reuse the existing context menu logic but trigger it from the handle click.
    *   Ensure the new node is placed automatically (e.g., to the right of the source node) and connected.

### 4. Node Library Management (Sidebar)
*   **Enhance `Sidebar.tsx`**:
    *   Read `nodeLibrary` from the store instead of a hardcoded list.
    *   Add "Add Node", "Edit", "Delete" buttons/icons for each item in the sidebar.
    *   Implement a simple Modal (using Ant Design) to add/edit node templates.

### 5. Documentation
*   **Create `README.md`**:
    *   Document component usage, props, node types, and store actions in Chinese.

### Execution Plan
1.  **Modify Store**: Add history (undo/redo), node library, and validation logic.
2.  **Update Components for Dark Mode**: Systematically update `index.tsx`, `Sidebar`, `PropertiesPanel`, `BaseNode`, `Canvas`.
3.  **Implement Features**:
    *   Add Sidebar management (Add/Edit/Delete).
    *   Implement Handle click auto-connect.
    *   Implement Validation highlighting in `BaseNode`.
4.  **Documentation**: Write the README.

