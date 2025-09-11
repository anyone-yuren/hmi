import { App as AntApp, ConfigProvider, theme } from 'antd';
import enUS from 'antd/es/locale/en_US';
import frFR from 'antd/es/locale/fr_FR';
import jaJP from 'antd/es/locale/ja_JP';
import koKR from 'antd/es/locale/ko_KR';
import zhCN from 'antd/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useTranslation } from 'react-i18next';

import SvgIcon from '../SvgIcon';
import useStyles from './style';

import type { ConfigProviderProps } from 'antd/es/config-provider';
import type { FC } from 'react';

dayjs.locale('zh-cn');
type WaveConfig = NonNullable<Parameters<typeof ConfigProvider>[0]['wave']>;
const createDot = (holder: HTMLElement, color: string, left: number, top: number, size: number = 0) => {
  const dot = document.createElement('div');
  dot.style.position = 'absolute';
  dot.style.left = `${left}px`;
  dot.style.top = `${top}px`;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  dot.style.borderRadius = '50%';
  dot.style.background = color;
  dot.style.transform = 'translate(-50%, -50%)';
  dot.style.transition = 'all 1s ease-out';
  holder.appendChild(dot);

  return dot;
};
const createHolder = (node: HTMLElement) => {
  const { borderWidth } = getComputedStyle(node);
  const borderWidthNum = parseInt(borderWidth, 10);

  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.inset = `-${borderWidthNum}px`;
  div.style.borderRadius = 'inherit';
  div.style.background = 'transparent';
  div.style.zIndex = '999';
  div.style.pointerEvents = 'none';
  div.style.overflow = 'hidden';
  node.appendChild(div);

  return div;
};
const showInsetEffect: WaveConfig['showEffect'] = (node, { event, component }) => {
  //   if (component !== 'Button') {
  //     return;
  //   }

  const holder = createHolder(node);

  const rect = holder.getBoundingClientRect();

  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;

  const dot = createDot(holder, 'rgba(255, 255, 255, 0.65)', left, top);

  // Motion
  requestAnimationFrame(() => {
    dot.ontransitionend = () => {
      holder.remove();
    };

    dot.style.width = '400px';
    dot.style.height = '400px';
    dot.style.opacity = '0';
  });
};
export interface GlobalConfigProps extends ConfigProviderProps {}
const GlobalConfig: FC<GlobalConfigProps> = ({ children, ...rest }) => {
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const localeMap: Record<string, any> = {
    zh_CN: zhCN,
    en_US: enUS,
    ja_JP: jaJP,
    ko_KR: koKR,
    fr_FR: frFR,
  };
  const localeConfig = localeMap[locale] || zhCN;

  const { styles } = useStyles();
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <SvgIcon name='ic_content' size={120} />
      <p>{t('global.noData')}</p>
    </div>
  );

  return (
    <ConfigProvider
      wave={{ showEffect: showInsetEffect }}
      card={{ className: styles['custom-card'] }}
      renderEmpty={customizeRenderEmpty}
      locale={localeConfig}
      theme={{
        // token: { colorTextHeading: '#fff' },
        token: {
          colorPrimary: '#00D1D1',
          colorText: 'white',
          fontFamily:
            'Microsoft YaHei, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        algorithm: theme.darkAlgorithm,
        components: {
          Table: {
            /* 这里是你的组件 token */
            // headerColor: 'white',
          },
          Segmented: {
            itemActiveBg: '#00D1D1',
            itemSelectedBg: '#00D1D1',
            // itemSelectedColor: 'white',
          },
        },
      }}
      {...rest}
    >
      <AntApp className='h-full'>{children}</AntApp>
    </ConfigProvider>
  );
};
export default GlobalConfig;
