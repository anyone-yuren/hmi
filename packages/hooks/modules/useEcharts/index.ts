import * as echarts from 'echarts';
import { type MutableRefObject, useCallback, useEffect, useState } from 'react';
import { bind, clear } from 'size-sensor';

import type { EChartsOption, EChartsType, ResizeOpts } from 'echarts';
import type { RendererType } from 'echarts/types/src/util/types';

export interface UseEchartsOption {
  autoResize?: boolean;
  renderer?: RendererType;
  theme?: string | object;
  width?: number | 'auto';
  height?: number | 'auto';
  echartsOption?: EChartsOption;
  updateOptionConfig?: {
    notMerge?: boolean;
  };
}

const defaultResizeOpt = {
  width: 'auto',
  height: 'auto',
};
export default function useEcharts(el: MutableRefObject<HTMLElement | null>, opt: UseEchartsOption = {}) {
  // echarts实例
  const [instance, setInstance] = useState<EChartsType | null>(null);
  useEffect(() => {
    if (el.current) initChart(el.current);
    return dispose;
  }, []);

  const updateOption = useCallback(
    (option: EChartsOption) => {
      hideLoading();
      instance?.setOption(option, opt.updateOptionConfig?.notMerge);
    },
    [instance],
  );

  const showLoading = () => {
    // if (!instance) initChart(el.current!)
    instance?.showLoading();
  };
  const hideLoading = () => {
    instance?.hideLoading();
  };
  const resize = (opt: ResizeOpts = {}) => {
    try {
      instance?.resize(opt || (defaultResizeOpt as ResizeOpts));
    } catch (e) {
      console.warn(e);
    }
  };
  const dispose = () => {
    const ele = el.current;
    if (instance && !instance.isDisposed()) {
      try {
        clear(ele);
      } catch (e) {
        console.warn(e);
      }
      instance.dispose();
    }
  };

  const initChart = (el: HTMLElement) => {
    if (!el) return;
    const {
      autoResize = true,
      renderer = 'canvas',
      theme = 'default',
      width = 'auto',
      height = 'auto',
      echartsOption = {},
    } = opt;
    const newInstance = echarts.init(el as HTMLElement, theme, {
      renderer,
      width,
      height,
    });
    newInstance.setOption(echartsOption);
    setInstance(newInstance);
    if (autoResize) {
      bind(el, () => {
        newInstance.resize({
          width: el.clientWidth,
          height: el.clientHeight,
        });
      });
    }
  };

  useEffect(() => {
    const onWindowResize = () => resize();
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [instance]);
  return {
    updateOption,
    showLoading,
    hideLoading,
  };
}

export { echarts };
