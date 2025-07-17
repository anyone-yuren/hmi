import { useWebSocket } from 'ahooks';
import YAML from 'js-yaml';
import React, { useState } from 'react';
// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10009' // 开发环境使用代理
  : `ws://${currentHost}:10009`; // 生产环境使用真实地址

const createOnMessageHandler = (keys, YAML, onChange) => {
  const lastDataByKeys = {};

  return (messageEvent) => {
    const { data } = messageEvent;

    keys.forEach((key) => {
      if (data.includes(key)) {
        const lastEntry = lastDataByKeys[key];
        const currentYAMLData = YAML.load(data);
        const now = Date.now();

        // 判断是否满足更新条件
        if (!lastEntry) {
          // 首次匹配
          console.log(`首次匹配 key=${key}`, currentYAMLData);
          lastDataByKeys[key] = {
            raw: data,
            parsed: currentYAMLData,
            timestamp: now,
          };
          onChange?.(key, currentYAMLData, null);
        } else if (data !== lastEntry.raw) {
          const timeDiff = now - lastEntry.timestamp;

          if (timeDiff < 200) {
            console.log(`key=${key} 更新间隔小于 200ms，忽略更新`);
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
          // console.log(`key=${key} 数据没有变化`);
        }
      }
    });
  };
};

export const useIo = ({ keys }) => {
  const [input, setInput] = useState({});
  const [output, setOutput] = useState({});

  const fnHashMap = {
    '/sirius/topics/robot_status_isensor': (data) => {
      setInput(data);
    },
    '/sirius/topics/robot_status_osensor': (data) => {
      setOutput(data);
    },
  };
  const messageChange = (key, newData, oldData) => {
    fnHashMap[key](newData);
  };
  const onMessage = React.useCallback(createOnMessageHandler(keys, YAML, messageChange), [keys]);

  const { sendMessage, latestMessage, readyState, disconnect } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage,
  });
  const ioWssResponse = React.useMemo(() => ({ io_input_config: input, io_output_config: output }), [input, output]);
  return { ioWssResponse, disconnect };
};
