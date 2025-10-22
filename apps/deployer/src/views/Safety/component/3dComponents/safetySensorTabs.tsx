import { Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../../store/safety.store';
interface ISensor {
  name: string;
  topic: string;
  select: boolean;
}

interface IProps {
  sensors: ISensor[];
}

function SafetySensorTabs({ sensors }: IProps) {
  const { obsInfo, setSensorPointsKey, clearSensorPoints, setSensorPoints } = useSafetyStore(
    useShallow((store) => ({
      setSensorPointsKey: store.setSensorPointsKey,
      clearSensorPoints: store.clearSensorPoints,
      obsInfo: store.obsInfo,
      setSensorPoints: store.setSensorPoints,
    })),
  );

  const [sensorList, setSensorList] = useState<ISensor[]>([]);

  useEffect(() => {
    console.log('初始化传感器列表', sensors);
    if (!sensors?.length) return;
    let ary: any = [];
    for (let index = 0; index < sensors.length; index++) {
      const sensor: any = sensors[index];
      ary.push({
        name: sensor.name,
        topic: sensor.topic,
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

  return (
    <div className='absolute z-10 bottom-[0px] left-[0px]'>
      <Space.Compact block>
        {sensorList?.map((sensor) => {
          return (
            <Button
              type={sensor.select ? 'primary' : 'default'}
              onClick={() => {
                handleSensor(sensor);
              }}
            >
              {sensor.name}
            </Button>
          );
        })}
      </Space.Compact>
    </div>
  );
}

export default SafetySensorTabs;
