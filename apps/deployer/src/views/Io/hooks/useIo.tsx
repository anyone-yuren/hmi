import { useWebSocket } from 'ahooks';
import YAML from 'js-yaml';
import React, { useState } from 'react';
// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10009' // 开发环境使用代理
  : `ws://${currentHost}:10009`; // 生产环境使用真实地址

export const useIo = () => {
  const [input, setInput] = useState({});
  const [output, setOutPut] = useState({});

  const { sendMessage, latestMessage, readyState, disconnect } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (e) => {
      if (e?.data?.includes('/sirius/topics/robot_status_isensor')) {
        const data = YAML.load(e?.data);
        if (JSON.stringify(data) == JSON.stringify(input)) {
          return;
        } else {
          console.log('不相等,才写入');
          setInput(data);
        }
      }
      if (e?.data?.includes('/sirius/topics/robot_status_osensor')) {
        const data = YAML.load(e?.data);
        if (JSON.stringify(data) == JSON.stringify(output)) {
          return;
        } else {
          setOutPut(data);
        }
      }
    },
  });
  const ioWssResponse = React.useMemo(() => ({ io_input_config: input, io_output_config: output }), [input, output]);
  return { ioWssResponse, disconnect };
};
