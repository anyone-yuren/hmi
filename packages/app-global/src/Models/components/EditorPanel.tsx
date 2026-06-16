import { useRef, useState, useEffect } from 'react';
import BodyOutlinePanel from './BodyOutlinePanel';
import { useEditorStore } from '../store/editorStore';
import { useBodyOutlineStore } from '../store/bodyOutlineStore';
import { useShallow } from 'zustand/react/shallow';

interface EditorPanelProps {
  bodyDimensions?: {
    width: number;
    height: number;
    length: number;
  };
}

/**
 * 编辑器面板容器
 * 根据 panelType 和 panelTab 渲染不同的配置面板
 */
export default function EditorPanel({ bodyDimensions }: EditorPanelProps) {
  const { panelType, panelTab } = useEditorStore(
    useShallow((state) => ({
      panelType: state.panelType,
      panelTab: state.panelTab,
    })),
  );

  // 渲染相应的面板内容
  const renderPanelContent = () => {
    // 车体轮廓配置面板
    if (panelType === 'body' && panelTab === 'bodyOutline') {
      return <BodyOutlinePanel bodyDimensions={bodyDimensions} />;
    }

    // 可以在这里添加其他面板类型
    // if (panelType === 'fork') { return <ForkConfigPanel />; }
    // if (panelType === 'calibration') { return <CalibrationPanel />; }

    return null;
  };

  return <>{renderPanelContent()}</>;
}
