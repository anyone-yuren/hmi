import { HubConnectionBuilder } from '@microsoft/signalr';
import { useAsyncEffect, useRafInterval } from 'ahooks';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { rcsLanguageDict } from '@/enums/dict';

import { useSignalRStore } from './store/signalR';
import useQueue from './useQueue';

import type { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  keyMessage?: string[];
}

const SignalR: FC<IProps> = (props: IProps) => {
  const { children, keyMessage } = props;
  const [newConnection, setNewConnection] = useState<any>(null);
  const {
    updateVehicles,
    updateMonitorMessage,
    wssLocationStateHashMap,
    setWssLocationStateHashMap,
    updateChargingStationState,
  } = useSignalRStore(
    useShallow((state: any) => ({
      updateVehicles: state.updateVehicles,
      updateVehiclesMap: state.updateVehiclesMap,
      updateMonitorMessage: state.updateMonitorMessage,
      wssLocationStateHashMap: state.wssLocationStateHashMap,
      setWssLocationStateHashMap: state.setWssLocationStateHashMap,
      updateChargingStationState: state.updateChargingStationState,
    })),
  );
  const { i18n } = useTranslation();

  const connection = new HubConnectionBuilder()
    .withUrl(
      `/hive-messaging-hub?culture=en&keyMessage=${keyMessage?.toString()}&language=${rcsLanguageDict?.[i18n.language] || 'en'}`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      },
    )
    .withAutomaticReconnect([3000, 4000, 10000, 10000])
    .build();

  const { enqueue, dequeue, size, peek } = useQueue();

  useAsyncEffect(async () => {
    if (newConnection) {
      try {
        await newConnection.invoke('UpdateLanguage', rcsLanguageDict?.[i18n.language] || 'en');
      } catch (err) {
        //
      }
    }
  }, [i18n.language]);

  useRafInterval(() => {
    if (size() >= 1) {
      updateVehicles(peek());
      dequeue();
    }
  }, 150);

  useEffect(() => {
    if (!connection || !keyMessage?.length) return;
    let connectSuccess = false;
    connection
      .start()
      .then(function () {
        console.log('websocket:连接成功。');
        setNewConnection(connection);
        connectSuccess = true;
      })
      .catch(function (err) {
        console.error('websocket:连接失败:', err.toString());
      });

    connection.on('MonitorMessage', (data) => {
      // console.log('[SignalR]:首页大屏监控信息', data);
      updateMonitorMessage(data);
    });
    connection.on('VehicleStateMessage', async (data) => {
      if (!data.length) return;
      updateVehicles(data);
    });
    connection.on('StorageStateMessage', async (data) => {
      const newData = typeof data === 'string' ? JSON.parse(data) : data;
      // state 0 无货 1 有货
      setWssLocationStateHashMap({
        ...wssLocationStateHashMap,
        [newData.pointId]: {
          state: newData.state,
        },
      });
    });

    connection.on('ChargingStationState', async (data) => {
      // console.log('ChargingStationState', data);
      updateChargingStationState(data);
      // state 0 无货 1 有货
    });

    // eslint-disable-next-line
    return () => {
      console.log('websocket: 准备断开', connectSuccess, connection);
      connection.off('MonitorMessage');
      connection.off('VehicleStateMessage');
      connection.off('ShuttleStateMessage');
      connection.off('StorageStateMessage');
      if (connection.state === 'Connected') {
        connection.stop().then(() => {
          console.log('websocket:链接断开');
        });
      }
      return null;
    };
  }, [keyMessage]);

  return children;
};

export default memo(SignalR);
