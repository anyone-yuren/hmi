import * as signalR from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';

interface SlotSocketType {
  url?: string;
}

const useSlotSocket = (props: SlotSocketType = {}) => {
  const { url = '/wms/messaging-hub' } = props;
  const connection = useRef<signalR.HubConnection>();
  const [eventData, setEventData] = useState<any>({});
  const [slotDeleted, setSlotDeleted] = useState(false);
  const [slotCreated, setSlotCreated] = useState(false);

  const eventDataRef = useRef<any>({});

  useEffect(() => {
    connection.current = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect([3000, 4000, 10000, 10000]) // 自动重连
      .build();

    connection.current.on('SlotGoodsChanged', (res: any) => {
      console.log('socket SlotChanged 更新库位数据', res);
      if (res) {
        const responseData = res[0];
        const slotNo = responseData.slotNo;
        // console.log('更新库位数据', res, {
        //   ...eventDataRef.current,
        //   [no]: res
        // })
        setEventData({
          ...eventDataRef.current,
          [slotNo]: responseData,
        });
        eventDataRef.current = {
          ...eventDataRef.current,
          [slotNo]: responseData,
        };
      }
    });

    connection.current.on('SlotDeleted', () => {
      setSlotDeleted(true);
    });

    connection.current.on('SlotCreated', () => {
      setSlotCreated(true);
    });

    connection.current.start().catch((err) => {
      console.log('Error while starting connection: ', err);
    });

    return () => {
      connection.current?.stop();
      connection.current = undefined;
      setEventData({});
      eventDataRef.current = {};
    };
  }, []);

  const resetEventData = () => {
    setEventData({});
    eventDataRef.current = {};
  };

  const resetSlotState = () => {
    setSlotDeleted(false);
    setSlotCreated(false);
  };

  return { eventData, resetEventData, slotDeleted, slotCreated, resetSlotState };
};

export default useSlotSocket;
