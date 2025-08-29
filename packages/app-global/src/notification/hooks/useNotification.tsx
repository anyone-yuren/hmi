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
  const errorMsg = useRef<any>();
  const obsMsg = useRef<any>();
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
          if (prev?.type === data.type) {
            return prev;
          }
          return data.type;
        });
      }
      if (message?.data?.includes('/sirius/topics/error_description')) {
        // TODO 此处需要改造成json格式
        const data = JSON.parse(message.data);
        setErrorMessage((prev) => {
          if (isEqual(prev, data.data)) {
            return prev;
          }
          return data.data;
        });
      }
    },
  });
  useEffect(() => {
    if (errorMessage && errorMessage?.length) {
      if (errorMsg.current) {
        sonnerToast.dismiss(errorMessage.current);
      }
      errorMsg.current = toast({
        title: (
          <>
            <div className='flex items-center justify-between'>
              <div className='text-white font-bold'>{t('common.errorMsg.title')}</div>
            </div>
          </>
        ),
        description: (
          <div className=''>
            {errorMessage.map((item: any, index) => {
              return (
                <div key={item.error_code} className='mb-2'>
                  <p>
                    {index + 1} {item?.description}
                  </p>
                  <div className=''>
                    <p className='opacity-50'>{item?.solution}</p>
                    <p className='opacity-50'>{dayjs.unix(item?.time).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ),
        className: 'bg-[#d90707]',
      });
    } else {
      if (errorMsg.current) {
        sonnerToast.dismiss(errorMsg.current);
      }
    }
  }, [errorMessage, i18n.language]);

  useEffect(() => {
    if (obsInfo !== 1 && getObsMsg(obsInfo)) {
      if (obsMsg.current) {
        sonnerToast.dismiss(obsMsg.current);
      }
      console.log(2);

      obsMsg.current = toast({
        title: t('common.obsError.title'),
        description: getObsMsg(obsInfo),
        button: {
          label: t('common.obsError.view'),
          onClick: () => {},
        },
      });
    }
  }, [obsInfo, i18n.language]);

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
