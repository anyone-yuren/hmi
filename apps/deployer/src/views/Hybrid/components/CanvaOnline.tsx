import { Circle, Group, Text } from 'react-konva';

import { useRequest } from 'ahooks';
import { Modal } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { relocatePoint } from '../service';
import { useHybirdStore } from '../store/hybird.store';
import NewAgv from './newAgv';

const translateAngel = (angel: number) => {
  return 180 - (angel || 0) * (180 / Math.PI);
};
const DeviceList = () => {
  const { t } = useTranslation();
  const { onlineData } = useHybirdStore(
    useShallow((state) => {
      return {
        onlineData: state.onlineData,
      };
    }),
  );
  const { runAsync: run } = useRequest(relocatePoint, {
    manual: true,
  });
  const meterToPixel = (meter: number) => {
    return Math.floor(meter * 20);
  };

  const onClickEvent = (e) => {
    const target = e.target;
    const targetName = target.className;
    const id = target.attrs.id;
    if (targetName === 'Circle' || targetName === 'Text') {
      Modal.confirm({
        title: t('common.tips'),
        content: t('deployer.hybrid.confirmOnlineTips'),
        okText: t('common.confirm'),
        cancelText: t('common.cancel'),
        onOk: async () => {
          const res: any = await run({
            cmd_type: 3,
            point_id: id,
          });
          if (res?.error_code === 10000) {
            toast.success(t('deployer.hybrid.onlineSuccess'));
          } else {
            toast.error(t('deployer.hybrid.onlineFail'));
          }
        },
      });
    }
  };
  return (
    <>
      <Group name='device' onClick={onClickEvent} onTap={onClickEvent}>
        {onlineData?.point_list?.map((item) => {
          return (
            <>
              {false && (
                <Circle
                  radius={4}
                  fill='#FF0000'
                  key={item.point_id}
                  id={item.point_id}
                  name='onlinePoint'
                  x={meterToPixel(item.pose_x)}
                  y={0 - meterToPixel(item.pose_y)}
                ></Circle>
              )}
              {true && (
                <NewAgv
                  key={item.point_id}
                  id={item.point_id}
                  radius={8}
                  stroke={'black'}
                  x={meterToPixel(item.pose_x)}
                  y={0 - meterToPixel(item.pose_y)}
                  rotation={translateAngel(item.pose_theta) + 270}
                ></NewAgv>
              )}
              <Text
                x={meterToPixel(item.pose_x)}
                y={0 - meterToPixel(item.pose_y)}
                id={item.point_id}
                text={item.point_id}
                offsetY={15}
                offsetX={3}
                fontSize={12}
                fill='#FF0000'
              ></Text>
            </>
          );
        })}
      </Group>
    </>
  );
};
export default memo(DeviceList);
