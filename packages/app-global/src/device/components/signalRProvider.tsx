import { useDeviceStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { v1DeviceRealTimeInfo } from 'apis';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { createSinalRConnection } from './signalr';
export const SignalRProvider = () => {
  const { setDeviceRealTimeInfos, setDeviceStatisticsInfo, setDeviceInfoChanged, setDeviceLoading, setDeviceList } =
    useDeviceStore(
      useShallow((state) => {
        return {
          setDeviceRealTimeInfos: state.setDeviceRealTimeInfos,
          setDeviceStatisticsInfo: state.setDeviceStatisticsInfo,
          setDeviceInfoChanged: state.setDeviceInfoChanged,
          setDeviceLoading: state.setDeviceLoading,
          setDeviceList: state.setDeviceList,
        };
      }),
    );

  const { runAsync: getAllDevices, loading } = useRequest(v1DeviceRealTimeInfo, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        setDeviceList(res);
      }
      // console.log(res);
      // setCountUnread(res);
    },
  });
  useEffect(() => {
    getAllDevices();
  }, []);

  useEffect(() => {
    setDeviceLoading(loading);
  }, [loading]);

  useEffect(() => {
    const connection = createSinalRConnection('/hive-device-hub');
    connection.start().then(() => {
      // 设备实时信息，全推
      connection.on('DeviceRealTimeInfo', async (hubName: string, message: any) => {
        const { data } = message;
        if (data) {
          setDeviceRealTimeInfos(data);
        }
      });
      // 设备统计信息，全推
      connection.on('DeviceStatisticsInfo', async (hubName: string, message: any) => {
        const { data } = message;
        if (data) {
          setDeviceStatisticsInfo(data);
        }
      });
      // 设备信息变更，全推
      connection.on('DeviceInfoChanged', async (hubName: string, message: any) => {
        const { data } = message;
        if (data) {
          setDeviceInfoChanged(data);
        }
      });
    });

    return () => {
      connection.stop();
    };
  }, []);
  return null;
};
