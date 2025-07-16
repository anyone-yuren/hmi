import { Circle, Group, Text } from 'react-konva';

import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { useRequest } from 'ahooks';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { relocatePoint } from '../service';
import MwConfirm from './MwConfirm';

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
      MwConfirm.confirm({
        title: t('上线') as string,
        content: t('是否上线'),
        onOk: async () => {
          const res: any = await run({
            cmd_type: 3,
            point_id: id,
          });
          if (res?.error_code === 10000) {
            toast.success(t('上线成功'));
          } else {
            toast.error(t('上线失败'));
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
              <Circle
                radius={4}
                fill='#FF0000'
                key={item.point_id}
                id={item.point_id}
                name='onlinePoint'
                x={meterToPixel(item.pose_x)}
                y={0 - meterToPixel(item.pose_y)}
              ></Circle>
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
