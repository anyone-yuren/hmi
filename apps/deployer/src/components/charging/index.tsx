import { CloseOutlined } from '@ant-design/icons';
import { useVehicleStore } from '@gbeata/store';
import { Modal } from 'antd';
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
  const [modal, contextHolder] = Modal.useModal();
  const { chargePileStatus, powerStatus } = useVehicleStore(
    useShallow((store) => ({
      chargePileStatus: store.chargePileStatus,
      powerStatus: store.powerStatus,
    })),
  );
  return (
    <ChargingContainer>
      <div className='text'>{powerStatus?.power || 0}%</div>
      <CloseOutlined
        className='absolute top-4 right-4 z-20'
        style={{
          fontSize: 48,
        }}
        onClick={(e) => {
          modal.confirm({
            title: t('common.charging.close'),
            content: t('common.charging.closeContent'),
            okText: t('common.confirm'),
            okType: 'danger',
            onOk: () => {
              props?.onClick?.(e);
            },
          });
        }}
      />
      {chargePileStatus?.charge_status === 2 ? (
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
      {contextHolder}
    </ChargingContainer>
  );
};

export default memo(Charging);
