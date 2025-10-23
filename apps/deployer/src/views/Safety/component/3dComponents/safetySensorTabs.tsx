import { Space, Switch } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../../store/safety.store';

interface ISensor {
  name: string;
  topic: string;
  select: boolean;
  ch_name: string;
  type: number;
}

interface IProps {
  sensors: ISensor[];
}

function SafetySensorTabs({ sensors }: IProps) {
  const { t, i18n } = useTranslation();
  const { setSensorPointsKey, isDensePointCloud, setIsDensePointCloud, setSensorPoints } = useSafetyStore(
    useShallow((store) => ({
      setSensorPointsKey: store.setSensorPointsKey,
      isDensePointCloud: store.isDensePointCloud,
      setIsDensePointCloud: store.setIsDensePointCloud,
      setSensorPoints: store.setSensorPoints,
    })),
  );

  const [sensorList, setSensorList] = useState<ISensor[]>([]);

  const lidarTypeHashMap = useMemo(() => {
    return {
      4: '2D' + t('deployer.safety.lidar'),
      5: '3D' + t('deployer.safety.lidar'),
    };
  }, [i18n.language]);

  useEffect(() => {
    setIsDensePointCloud(false);
  }, []);
  useEffect(() => {
    console.log('初始化传感器列表', sensors);
    if (!sensors?.length) return;
    let ary: any = [];
    for (let index = 0; index < sensors.length; index++) {
      const sensor: any = sensors[index];
      ary.push({
        name: sensor.name,
        topic: sensor.topic,
        type: sensor.type,
        ch_name: sensor.ch_name,
        select: true,
      });
    }
    setSensorList(ary);
    return () => {
      setSensorPointsKey([]);
    };
  }, [sensors]);

  const handleSensor = (sensor: ISensor) => {
    setSensorPoints(sensor.topic, []);
    const ary = sensorList.map((item) => {
      if (item.name === sensor.name) {
        return {
          ...item,
          select: !item.select,
        };
      }
      return item;
    });
    setSensorList(ary);
  };

  useEffect(() => {
    if (!sensorList.length) return;
    const topics = sensorList.filter((item) => item.select).map((item) => item.topic);
    setSensorPointsKey(topics);
  }, [sensorList]);

  const onPointTypeChange = (select) => {
    setIsDensePointCloud(select);
    const topics = sensorList.filter((item) => item.select).map((item) => item.topic);
    setSensorPointsKey(topics);
  };

  return (
    <div className='absolute z-10 bottom-4 left-[0px]'>
      <Space size={'middle'}>
        <div className='bg-[#319796] text-[white] rounded-lg flex p-2 items-center gap-2'>
          <div>
            <div className='text-[14px]'>{t('deployer.safety.densePointCloud')}</div>
            <div className='text-[12px]'>{t('deployer.safety.densePointCloudTips')}</div>
          </div>
          <Switch value={isDensePointCloud} onChange={onPointTypeChange} />
        </div>
        {sensorList?.map((sensor) => {
          return (
            <div key={sensor.topic} className='bg-[#319796] text-[white] rounded-lg flex p-2 items-center gap-2'>
              <div>
                <div className='text-[14px]'>{sensor.ch_name}</div>
                <div className='text-[12px]'>{lidarTypeHashMap?.[sensor.type]}</div>
              </div>
              <Switch value={sensor.select} onChange={() => handleSensor(sensor)} />
            </div>
          );
        })}
      </Space>
    </div>
  );
}

export default SafetySensorTabs;
