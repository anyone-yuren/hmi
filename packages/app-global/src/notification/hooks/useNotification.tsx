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
  const { t } = useTranslation();
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
              <div className=' text-white font-bold'>{t('common.errorMsg.title')}</div>
            </div>
          </>
        ),
        description: (
          <div className=''>
            {errorMessage.map((item: string, index) => {
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
        className: ' bg-[#d90707]',
        // button: {
        //   label: t('common.obsError.view'),
        //   onClick: () => {
        //     console.log('查看通知');
        //   },
        // },
      });
    } else {
      // errorMsg.current?.close();
      sonnerToast.dismiss(errorMsg.current);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (obsInfo !== 1 && getObsMsg(obsInfo)) {
      if (obsMsg.current) {
        sonnerToast.dismiss(obsMsg.current);
      }
      obsMsg.current = toast({
        title: t('common.obsError.title'),
        description: getObsMsg(obsInfo),
        button: {
          label: t('common.obsError.view'),
          onClick: () => {
            console.log('查看通知');
          },
        },
      });
    } else {
      sonnerToast.dismiss(obsMsg.current);
    }
  }, [obsInfo]);
  return {
    sendMessage,
    latestMessage,
    readyState,
  };
};
