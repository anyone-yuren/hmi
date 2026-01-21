I will implement a complete MES Workflow Designer component in `packages/app-global/src/WorkflowDesigner`. This will be a feature-rich, drag-and-drop editor built with React Flow and Zustand.

### 1. Project Structure

I will create the following directory structure:

```
packages/app-global/src/WorkflowDesigner/
├── components/
│   ├── Canvas.tsx           # Main React Flow canvas
│   ├── Sidebar.tsx          # Node toolbox (Drag & Drop)
│   ├── PropertiesPanel.tsx  # Attribute editor for selected nodes
│   ├── Nodes/               # Custom Node Components
│   │   ├── BaseNode.tsx     # Generic wrapper (Header, Status, Handles)
│   │   ├── StartEndNode.tsx
│   │   ├── ProcessNode.tsx
│   │   └── ... (other types)
│   └── Controls/            # Toolbar (Save, Undo, etc.)
├── store/
│   └── useWorkflowStore.ts  # Zustand state management
├── types/
│   └── index.ts             # Type definitions (NodeData, NodeType, etc.)
├── hooks/
│   └── useDnD.ts            # Drag and drop logic helpers
└── index.tsx                # Main entry point
```

### 2. Implementation Details

**Step 1: Core Types & Store**

* Define `WorkflowNode`, `WorkflowEdge`, and `NodeData` types.

* Create `useWorkflowStore` to manage:

  * `nodes` & `edges` (using `applyNodeChanges`, `applyEdgeChanges`)

  * `selectedNode`

  * `workflowVariables`

  * Actions: `addNode`, `deleteNode`, `onConnect`, `updateNodeData`.

**Step 2: Custom Node System**

* **`BaseNode`**: A reusable wrapper component that provides:

  * Standard styling (Tailwind CSS card style).

  * Status indicators (Running, Success, Error).

  * Context menu trigger (for "Click handle to add").

  * Dynamic input/output handles based on configuration.

* **Node Variants**: Implement specific renderers for `DataAcquisition`, `Processing`, `Control`, etc., reusing `BaseNode`.

**Step 3: Interaction Features**

* **Drag & Drop**: Allow dragging nodes from `Sidebar` onto `Canvas`.

* **Smart Connection**: Implement "Click output handle -> Select Node -> Auto-create & Connect" logic.

* **Property Editing**: Clicking a node populates the `PropertiesPanel` to edit parameters (e.g., set API URL, define variables).

**Step 4: UI & Styling**

* Use **Tailwind CSS** for a modern, dark-mode compatible look (consistent with your reference image).

* Use **Ant Design** for form inputs in the Property Panel and Menus.

* Implement a **MiniMap** and standard **Controls** (Zoom).

**Step 5: Integration**

* Create the main `WorkflowDesigner` component that layouts the Sidebar, Canvas, and Property Panel.

* Provide a mock `save/load` API function.

### 3. Execution Order

1. Create types and store.
2. Create the `BaseNode` and specific node components.
3. Implement the `Canvas` with React Flow setup.
4. Implement `Sidebar` and `PropertiesPanel`.
5. Assemble everything in `index.tsx`.

