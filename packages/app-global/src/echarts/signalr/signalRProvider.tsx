import * as SignalR from '@microsoft/signalr';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
// import { useSignalRStore } from '../store/index';
import { useMonitorSignalRStore } from '@gbeata/store';
interface IProps {
  keyMessage?: string[];
}
export const createSignalRConnection = (url: string) => {
  return new SignalR.HubConnectionBuilder()
    .withUrl(url)
    .withAutomaticReconnect()
    .configureLogging(SignalR.LogLevel.Information)
    .build();
};
const RcsEchartsSignalRProvider = (props: IProps) => {
  const { keyMessage } = props;
  const { updateMonitorMessage } = useMonitorSignalRStore(
    useShallow((state) => ({
      updateMonitorMessage: state.updateMonitorMessage,
    })),
  );

  useEffect(() => {
    if (!keyMessage || !keyMessage.length) return;
    const connection = createSignalRConnection(`/hive-messaging-hub?culture=en&keyMessage=${keyMessage?.toString()}`);
    connection.start().then(() => {
      // 这里全部接收
      connection.on('MonitorMessage', (data) => {
        console.log('[RcsEchartsSignalRProvider]:首页大屏监控信息', data);
        updateMonitorMessage(data);
      });
    });
    return () => {
      connection.stop();
    };
  }, [keyMessage]);
  return null;
};
export default RcsEchartsSignalRProvider;
