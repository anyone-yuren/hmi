import type { TreeDataNode } from 'antd';
import { Transfer, Tree, theme } from 'antd';
import React, { useState } from 'react';

interface FileNode extends TreeDataNode {
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface TreeTransferProps {
  dataSource: FileNode[];
  targetKeys: string[];
  onChange: (keys: string[]) => void;
}

const flattenFiles = (nodes: FileNode[], collector: TreeDataNode[] = []) => {
  nodes.forEach((node) => {
    if (node.type === 'file') collector.push({ ...node });
    if (node.children) flattenFiles(node.children, collector);
  });
  return collector;
};

const generateTree = (nodes: FileNode[], expandedKeys: string[] = []): TreeDataNode[] =>
  nodes.map(({ children, ...rest }) => ({
    ...rest,
    icon: rest.type === 'folder' ? '📁' : '📄',
    children: children ? generateTree(children, expandedKeys) : undefined,
  }));

const collectAllFiles = (node: FileNode): string[] => {
  let keys: string[] = [];
  if (node.type === 'file') keys.push(node.key as string);
  if (node.children) node.children.forEach((child) => keys.push(...collectAllFiles(child)));
  return keys;
};

const TreeTransfer: React.FC<TreeTransferProps> = ({ dataSource, targetKeys, onChange }) => {
  const { token } = theme.useToken();
  const transferDataSource = flattenFiles(dataSource);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const handleTreeCheck = (checkedKeys: any, info: any) => {
    const keys = info.checkedNodes.flatMap((node: any) => {
      // 选中目录则收集所有子文件
      if (node.type === 'folder') return collectAllFiles(node);
      return node.key;
    });
    onChange(keys);
  };

  return (
    <Transfer
      dataSource={transferDataSource}
      targetKeys={targetKeys}
      onChange={onChange}
      showSelectAll={false}
      render={(item) => item.title as string}
      listStyle={{ width: 350, height: 400 }}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        const mergedCheckedKeys = direction === 'left' ? [...selectedKeys, ...targetKeys] : selectedKeys;
        return (
          <div style={{ padding: token.paddingSM }}>
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              treeData={generateTree(dataSource, expandedKeys)}
              checkedKeys={mergedCheckedKeys}
              draggable
              onDrop={(info) => {
                console.log('拖拽移动模拟:', info);
              }}
              onCheck={handleTreeCheck}
              onSelect={(_, info) => {
                const node = info.node as FileNode;
                const keys = node.type === 'folder' ? collectAllFiles(node) : [node.key as string];
                keys.forEach((key) => onItemSelect(key, !selectedKeys.includes(key)));
              }}
            />
          </div>
        );
      }}
    </Transfer>
  );
};

// ---------------- 模拟系统文件结构 ----------------
const fileTree: FileNode[] = [
  {
    key: '/home',
    title: 'home',
    type: 'folder',
    children: [
      {
        key: '/home/user',
        title: 'user',
        type: 'folder',
        children: [
          { key: '/home/user/readme.txt', title: 'readme.txt', type: 'file' },
          { key: '/home/user/avatar.png', title: 'avatar.png', type: 'file' },
        ],
      },
      {
        key: '/home/data',
        title: 'data',
        type: 'folder',
        children: [
          {
            key: '/home/data/images',
            title: 'images',
            type: 'folder',
            children: [
              { key: '/home/data/images/1.png', title: '1.png', type: 'file' },
              { key: '/home/data/images/2.png', title: '2.png', type: 'file' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: '/etc',
    title: 'etc',
    type: 'folder',
    children: [
      { key: '/etc/hosts', title: 'hosts', type: 'file' },
      { key: '/etc/resolv.conf', title: 'resolv.conf', type: 'file' },
    ],
  },
  {
    key: '/var',
    title: 'var',
    type: 'folder',
    children: [
      {
        key: '/var/log',
        title: 'log',
        type: 'folder',
        children: [
          { key: '/var/log/app.log', title: 'app.log', type: 'file' },
          { key: '/var/log/error.log', title: 'error.log', type: 'file' },
        ],
      },
    ],
  },
];

const App = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  return (
    <div style={{ padding: 20 }}>
      <TreeTransfer dataSource={fileTree} targetKeys={targetKeys} onChange={setTargetKeys} />
    </div>
  );
};

export default App;
