import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../../store/editorStore';

export default function ContextMenu() {
  const { contextMenuVisible, contextMenuPosition, selected, hideContextMenu, showPanel } = useEditorStore(
    useShallow((store) => {
      return {
        showPanel: store.showPanel,
        contextMenuVisible: store.contextMenuVisible,
        contextMenuPosition: store.contextMenuPosition,
        selected: store.selected,
        hideContextMenu: store.hideContextMenu,
      };
    }),
  );

  const ref = useRef<HTMLDivElement>(null);

  // ⭐ 点击任意位置关闭
  useEffect(() => {
    if (!contextMenuVisible) return;

    const onMouseDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        hideContextMenu();
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, [contextMenuVisible]);

  const items = useMemo(() => {
    if (!selected) return [];

    if (selected instanceof THREE.Points) {
      return [
        { key: 'clip', label: '裁剪设置' },
        { key: 'density', label: '点云密度' },
        { key: 'delete', label: '删除点云' },
      ];
    }
    if (selected.name === 'body') {
      return [
        { key: 'focus', label: '聚焦物体' },
        { key: 'hide', label: '隐藏' },
        { key: 'delete', label: '删除' },
      ];
    }

    if (selected.name === 'radar') {
      return [
        { key: 'focus', label: '点云标定' },
        { key: 'hide', label: '隐藏' },
        { key: 'delete', label: '删除' },
      ];
    }

    if (selected?.name?.includes('camera')) {
      return [
        { key: 'focus', label: '标定' },
        { key: 'hide', label: '隐藏' },
        { key: 'delete', label: '删除' },
      ];
    }
    return []; // 预留默认弹窗
  }, [selected]);

  if (!contextMenuVisible || !contextMenuPosition) return null;

  return (
    items.length > 0 && (
      <div
        ref={ref}
        className='bg-black rounded-md p-2'
        style={{
          position: 'fixed',
          left: contextMenuPosition.x,
          top: contextMenuPosition.y,
          minWidth: 160,
          zIndex: 9999,
          color: '#fff',
        }}
      >
        {items.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              console.log('menu:', item.key, selected);
              showPanel(item.key as any); // ⭐ 打开面板
              hideContextMenu();
            }}
            className='px-2 py-1 cursor-pointer'
            onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  );
}
