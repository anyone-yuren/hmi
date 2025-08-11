import { useVehicleStore } from '@gbeata/store';
import { t } from 'i18next';
import type { FC, MouseEventHandler, PropsWithChildren } from 'react';
import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import ChargingContainer from './styles';
interface IChargingProps {
  battery?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  status?: any;
}

const Charging: FC<PropsWithChildren<IChargingProps>> = (props) => {
  const { status } = props;
  const { charge_pile_status, powerStatus } = useVehicleStore(
    useShallow((store) => ({
      charge_pile_status: store.charge_pile_status,
      powerStatus: store.powerStatus,
    })),
  );

  return (
    <ChargingContainer onClick={props.onClick}>
      <div className='text'>{powerStatus?.power || 0}%</div>
      {charge_pile_status?.charge_status === 2 ? (
        <div className='text text-gray-50 mt-10 opacity-50 animate-fadeIn'>{t('common.charging.waitting')}</div>
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
    </ChargingContainer>
  );
};

export default memo(Charging);
