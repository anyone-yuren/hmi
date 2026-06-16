import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';
import { useEditorStore } from '../../store/editorStore';

export default function ContextMenu() {
  const { setModelSelect } = useModelStore(
    useShallow((store) => ({
      setModelSelect: store.setModelSelect,
    })),
  );
  const {
    contextMenuVisible,
    contextMenuPosition,
    selected,
    hideContextMenu,
    showPanel,
    setPanelTab,
  } = useEditorStore(
    useShallow((store) => {
      return {
        showPanel: store.showPanel,
        contextMenuVisible: store.contextMenuVisible,
        contextMenuPosition: store.contextMenuPosition,
        selected: store.selected,
        hideContextMenu: store.hideContextMenu,
        setPanelTab: store.setPanelTab,
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
        { key: '1', label: '通用' },
        { key: '2', label: '叉分' },
        { key: '3', label: '全向车' },
        { key: '4', label: '双舵' },
        { key: '5', label: '单舵' },
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

    if (selected?.name === 'fork-left') {
      return [
        { key: '1', label: '前移' },
        { key: '2', label: '横移' },
        { key: '3', label: '俯仰' },
        { key: '4', label: '横滚' },
        { key: '5', label: '升降' },
        { key: '6', label: '叉间距' },
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
              if (selected?.name === 'fork-left') {
                setPanelTab(item.key);
                showPanel('fork');
              } else if (selected?.name === 'body') {
                setPanelTab(item.key);
                showPanel('body');
              } else {
                showPanel(item.key as any); // ⭐ 打开面板
              }
              hideContextMenu();
            }}
            className='hover:bg-blue-600 px-3 py-1 cursor-pointer text-sm rounded transition-colors'
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  );
}
