import { useEffect, useState } from 'react';

export * from './context';

export interface ISystemConfig {
  titlePrefix: string; // 网站标题前缀
  appList: { label: string; link: string }[];
  favicon: string;
  logo_mini: string;
  logo_origin: string;
  wcs_log_url: string;
}

export const useSystemConfig = (systemConfigPath = './config/') => {
  const [systemConfig, setSystemConfig] = useState<Partial<ISystemConfig>>({});

  useEffect(() => {
    fetch(`${systemConfigPath}config.json`)
      .then((res) => res.json())
      // eslint-disable-next-line consistent-return
      .then((data) => {
        if (!data?.common) return console.warn('Faild to load config.json or incorrectly formatted json');
        const newSystemConfig: ISystemConfig = {
          ...data.common,
          logo_mini: data.common.logo_mini ? systemConfigPath + data.common.logo_mini : '',
          logo_origin: data.common.logo_origin ? systemConfigPath + data.common.logo_origin : '',
          favicon: data.common.favicon ? systemConfigPath + data.common.favicon : '',
        };
        setSystemConfig(newSystemConfig);

        // set favicon
        const faviconLinkEl = document.querySelector('link[rel=icon]');
        newSystemConfig.favicon && faviconLinkEl?.setAttribute('href', newSystemConfig.favicon);

        // set document title
        document.title = (data?.common?.titlePrefix || '') + document.title; // 修改网站标题前缀
      });
  }, []);

  return systemConfig;
};
