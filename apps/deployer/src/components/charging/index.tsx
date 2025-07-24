import { useVehicleStore } from '@/store/vehicleStore';
import { Icon } from '@iconify/react';
import { Timeline } from 'antd';
import { t } from 'i18next';
import type { FC, MouseEventHandler, PropsWithChildren } from 'react';
import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import ChargingContainer from './styles';
interface IChargingProps {
  battery: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  status?: any;
}

const Charging: FC<PropsWithChildren<IChargingProps>> = (props) => {
  const { status } = props;
  const { charge_pile_status } = useVehicleStore(
    useShallow((store) => ({
      charge_pile_status: store.charge_pile_status,
    })),
  );

  const chargeStatus = ['', '', t('准备充电'), t('充电中'), t('充电完成'), t('充电失败')];
  return (
    <ChargingContainer onClick={props.onClick}>
      <div className='text'>{props.battery || 0}%</div>
      {charge_pile_status?.charge_status === 2 ? (
        <div className='text text-gray-50 mt-10 opacity-50 animate-fadeIn'>{t('等待充电')}</div>
      ) : null}
      <div className='contrast'>
        {/* 小球 */}
        {new Array(15).fill(0).map((item, index) => (
          <span key={index}></span>
        ))}
        {/* 底部的 */}
        <div className='circle'></div>
        {/* 下面的 */}
        <div className='button'></div>
      </div>
      {charge_pile_status?.charge_status !== 0 ? (
        <div className='!absolute flex justify-between items-end bottom-2 w-full left-0 px-4'>
          <div>
            <p className='font-bold mb-2 text-xl'>{t('common.charging.battery')}</p>
            <Timeline
              reverse={true}
              items={[
                charge_pile_status?.pe_charge_input &&
                  ({
                    children: t('common.charging.chargeingOutput') + charge_pile_status?.pe_charge_input,
                  } as any),
                charge_pile_status?.pe_charge_output && {
                  children: t('common.charging.chargeingOutput') + charge_pile_status?.pe_charge_output,
                },
                {
                  children: `${t('common.charging.chargePile')} ${t('common.charging.Voltage')} ：${
                    charge_pile_status?.output_voltage
                  }V/${charge_pile_status?.output_current}A`,
                },
                {
                  children: `${t('common.charging.battery')} ${t('common.charging.Voltage')} ：${status?.power}V/${status?.current}A`,
                },
                {
                  children: `${t('common.charging.errorCode')} ：${charge_pile_status?.error_code}`,
                },
                {
                  dot: <Icon icon='svg-spinners:clock' />,
                  children: `${t('common.charging.brushBoardStatus')} :
                    ${charge_pile_status?.brush_board_status === 0 ? t('伸出') : t('收回')}`,
                },
                {
                  dot: <Icon icon='svg-spinners:clock' />,
                  children: `${t('common.charging.chargeStatus')}：${chargeStatus[charge_pile_status?.charge_status]}`,
                },
              ]}
            />
          </div>
        </div>
      ) : null}
    </ChargingContainer>
  );
};

export default memo(Charging);
