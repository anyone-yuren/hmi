import { useWebSocket } from 'ahooks';
import dayjs from 'dayjs';
import { isEqual } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast as sonnerToast } from 'sonner';
import { toast } from '../components/CustomToast';
import useObsError from './useObsError';

// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10009' // 开发环境使用代理
  : `ws://${currentHost}:10009`; // 生产环境使用真实地址

export const useNotification = () => {
  const { t, i18n } = useTranslation();
  const obsMsg = useRef<any>();
  const activeErrorToasts = useRef<Record<string, string>>({}); // 用于记录已弹出的 error toast
  const { getObsMsg } = useObsError();
  const [obsInfo, setObsInfo] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<any>();
  const { sendMessage, latestMessage, readyState } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (message) => {
      if (message?.data?.includes('/sirius/topics/safety_obs_info')) {
        const data = JSON.parse(message.data);
        setObsInfo((prev) => {
          if (prev?.type === data.type) return prev;
          return data.type;
        });
      }

      if (message?.data?.includes('/sirius/topics/error_description')) {
        const data = JSON.parse(message.data);
        setErrorMessage((prev) => {
          if (isEqual(prev, data.data)) return prev;
          return data.data;
        });
      }
    },
  });
  // 定义异常严重程度，0普通 1警告 2错误 3失败
  const levelColor = ['!bg-gray-300', '!bg-[#f59e0b]', '!bg-[#d90707]', '!bg-[#991b1b]'];

  // 分别弹出每条错误信息
  useEffect(() => {
    const currentToasts = activeErrorToasts.current;

    // 如果没有错误信息，清除所有旧的弹窗
    if (!errorMessage || errorMessage.length === 0) {
      Object.values(currentToasts).forEach((id) => sonnerToast.dismiss(id));
      activeErrorToasts.current = {};
      return;
    }

    // 处理新的错误信息
    const newToastKeys: Record<string, string> = {};

    errorMessage.forEach((item: any) => {
      const key = item.error_code?.toString() || Math.random().toString();
      const level = item.level;
      const exists = currentToasts[key];

      // 若该错误未展示过，则弹出
      if (!exists) {
        const toastId = toast({
          title: (
            <div className='flex items-center justify-between'>
              <div className='text-white font-bold'>{t('common.errorMsg.title')}</div>
            </div>
          ),
          description: (
            <div>
              <p>{item?.description || '-'}</p>
              <div className='opacity-50'>
                <p>{item?.solution}</p>
                <p>{dayjs.unix(item?.time).format('YYYY-MM-DD HH:mm:ss')}</p>
              </div>
            </div>
          ),
          className: levelColor[level ?? 0],
          closable: true,
        });
        newToastKeys[key] = toastId;
      } else {
        newToastKeys[key] = exists; // 保留已有的
      }
    });

    // 移除已不在 errorMessage 列表中的旧 toast
    Object.entries(currentToasts).forEach(([key, id]) => {
      const stillExists = errorMessage.some((item: any) => item.error_code?.toString() === key);
      if (!stillExists) sonnerToast.dismiss(id);
    });

    // 更新记录
    activeErrorToasts.current = newToastKeys;
  }, [errorMessage, i18n.language]);

  // 处理避障提示
  useEffect(() => {
    if (obsInfo !== 1 && getObsMsg(obsInfo)) {
      if (obsMsg.current) {
        sonnerToast.dismiss(obsMsg.current);
      }
      obsMsg.current = toast({
        title: t('common.obsError.title'),
        description: getObsMsg(obsInfo),
        closable: true,
      });
    } else {
      if (obsMsg.current) {
        sonnerToast.dismiss(obsMsg.current);
      }
    }
  }, [obsInfo, i18n.language]);

  // 初始化订阅
  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: ['/sirius/topics/safety_obs_info', '/sirius/topics/error_description'],
        }),
      );
    }
  }, [readyState]);

  return {
    sendMessage,
    latestMessage,
    readyState,
  };
};
