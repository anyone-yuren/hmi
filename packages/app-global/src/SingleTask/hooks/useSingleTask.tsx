import { useWebSocket } from 'ahooks';
import YAML from 'js-yaml';
import React from 'react';
// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10009' // 开发环境使用代理
  : `ws://${currentHost}:10009`; // 生产环境使用真实地址

const createOnMessageHandler = ({
  keys = [],
  yaml = YAML,
  onChange = () => {},
  whiteList = [],
  updateInterval = 200,
}: any = {}) => {
  const lastDataByKeys = {};

  return (messageEvent) => {
    const { data } = messageEvent;

    keys.forEach((key) => {
      if (data.includes(key)) {
        const lastEntry = lastDataByKeys[key];
        let currentYAMLData;
        try {
          currentYAMLData = yaml.load(data);
        } catch (e) {
          console.error(`YAML 解析失败 for key=${key}:`, data, e);
          return;
        }

        const now = Date.now();

        // 白名单 key 直接更新，不进行比较
        if (whiteList.includes(key)) {
          onChange?.(key, currentYAMLData, lastEntry?.parsed || null);
          return;
        }

        // 首次匹配
        if (!lastEntry) {
          console.log(`首次匹配 key=${key}`, currentYAMLData);
          lastDataByKeys[key] = {
            raw: data,
            parsed: currentYAMLData,
            timestamp: now,
          };
          onChange?.(key, currentYAMLData, null);
        } else if (data !== lastEntry.raw) {
          const timeDiff = now - lastEntry.timestamp;

          if (timeDiff < updateInterval) {
            console.log(`key=${key} 更新间隔小于 ${updateInterval}ms，忽略更新`);
            return;
          }

          console.log(`key=${key} 数据发生了变化`);
          console.log('旧数据:', lastEntry.parsed);
          console.log('新数据:', currentYAMLData);

          // 更新数据和时间戳
          lastDataByKeys[key] = {
            raw: data,
            parsed: currentYAMLData,
            timestamp: now,
          };

          onChange?.(key, currentYAMLData, lastEntry.parsed);
        } else {
          // 数据未变化，不触发更新
          // console.log(`key=${key} 数据没有变化`);
        }
      }
    });
  };
};

export const useIo = ({ keys }) => {
  const fnHashMap = {
    '/sirius/topics/rcs_info': (data) => {
      // 判断车在不在线上
    },
    '/sirius/topics/test_task_info': (data) => {
      // 刷新详情
    },
  };
  const messageChange = (key, newData, oldData) => {
    fnHashMap[key](newData);
  };
  const onMessage = React.useCallback(
    createOnMessageHandler({
      keys,
      yaml: YAML,
      onChange: messageChange,
      whiteList: ['/sirius/topics/test_task_info'],
      updateInterval: 200,
    }),
    [keys],
  );

  const { sendMessage, latestMessage, readyState, disconnect } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage,
  });
  const singleTaskWssResponse = React.useMemo(() => ({}), []);
  return { wssResponse: singleTaskWssResponse, disconnect };
};
