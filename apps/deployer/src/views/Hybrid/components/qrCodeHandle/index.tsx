import { Icon } from '@iconify/react';
import { Button as ButtonBase, ButtonBaseProps, Divider, styled } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { qrcode_mapping } from '../../service';
import { useHybirdStore } from '../../store/hybird.store';
import { isShowNavigation } from '../../utils';
interface HandleButtonProps extends ButtonBaseProps {
  selected?: boolean;
}
const HandleButton = styled(ButtonBase)<HandleButtonProps>(({ theme, selected }) => ({
  color: selected ? 'red' : theme.palette.text.primary,
  '&:active': {
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.action.selected,
  },
}));

const QrCodeHandle = () => {
  const { t } = useTranslation();
  const { navigationType, robot_current_status } = useHybirdStore(
    useShallow((state) => ({
      robot_current_status: state.robot_current_status,
      navigationType: state.navigationType,
    })),
  );

  const { system_status } = robot_current_status || {};

  const isQrcode = isShowNavigation(navigationType, 'QRCODE');

  const showQrCodeHandle = useMemo(() => {
    return isQrcode ? (
      <>
        <HandleButton
          variant='contained'
          onClick={() => {}}
          className='flex-1 flex  gap-1 items-center justify-center text-sm'
        >
          {t('deployer.hybrid.createCode')}
        </HandleButton>
        <Divider orientation='vertical' variant='middle' flexItem />
      </>
    ) : null;
  }, [isQrcode]);

  const qrCodeMapping = useCallback(async (type: number) => {
    const res: any = await qrcode_mapping({ cmd_type: type });
    if (res.error_code === 10000) {
    } else {
      toast.error(res?.error_description);
    }
  }, []);

  const isQrcodeBuilding = useMemo(() => {
    if (isQrcode && system_status === 8) {
      return (
        <>
          <HandleButton
            variant='contained'
            onClick={() => qrCodeMapping(2)}
            className='flex-1 flex  gap-1 items-center justify-center text-sm'
          >
            <Icon fontSize={24} icon='ix:success' />
            {t('common.success')}
          </HandleButton>
          <Divider orientation='vertical' variant='middle' flexItem />

          <HandleButton
            variant='contained'
            onClick={() => qrCodeMapping(2)}
            className='flex-1 flex  gap-1 items-center justify-center text-sm'
          >
            <Icon fontSize={24} icon='material-symbols:cancel-outline' />
            {t('common.cancel')}
          </HandleButton>
        </>
      );
    }
  }, [isQrcode, system_status]);

  return {
    showQrCodeHandle,
    isQrcodeBuilding,
  };
};

export const QrCodeHandleButton = () => {
  const { showQrCodeHandle } = QrCodeHandle();
  return <>{showQrCodeHandle}</>;
};

export const QrCodeHandleBuilding = () => {
  const { isQrcodeBuilding } = QrCodeHandle();
  return <>{isQrcodeBuilding}</>;
};
