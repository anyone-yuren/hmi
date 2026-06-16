import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BodyOutlineConfig {
  width: number;
  height: number;
  length: number;
  color: string;
  opacity: number;
  lineWidth: number;
  enabled: boolean;
}

interface BodyOutlineState {
  bodyOutlineConfig: BodyOutlineConfig;
  setBodyOutlineConfig: (config: Partial<BodyOutlineConfig>) => void;
  resetBodyOutlineConfig: (defaultWidth: number, defaultHeight: number, defaultLength: number) => void;
  toggleBodyOutline: (enabled: boolean) => void;
}

// 默认轮廓配置
const DEFAULT_CONFIG: BodyOutlineConfig = {
  width: 200, // 默认宽度
  height: 150, // 默认高度
  length: 300, // 默认长度
  color: '#00ff00', // 默认绿色
  opacity: 0.6, // 默认透明度
  lineWidth: 2, // 线宽
  enabled: true, // 默认启用
};

export const useBodyOutlineStore = create<BodyOutlineState>()(
  persist(
    (set) => ({
      bodyOutlineConfig: DEFAULT_CONFIG,
      
      setBodyOutlineConfig: (config) => {
        set((state) => ({
          bodyOutlineConfig: {
            ...state.bodyOutlineConfig,
            ...config,
          },
        }));
      },
      
      resetBodyOutlineConfig: (defaultWidth, defaultHeight, defaultLength) => {
        set({
          bodyOutlineConfig: {
            ...DEFAULT_CONFIG,
            width: defaultWidth,
            height: defaultHeight,
            length: defaultLength,
          },
        });
      },
      
      toggleBodyOutline: (enabled) => {
        set((state) => ({
          bodyOutlineConfig: {
            ...state.bodyOutlineConfig,
            enabled,
          },
        }));
      },
    }),
    {
      name: 'body-outline-store',
      partialize: (state) => ({
        bodyOutlineConfig: state.bodyOutlineConfig,
      }),
    },
  ),
);
