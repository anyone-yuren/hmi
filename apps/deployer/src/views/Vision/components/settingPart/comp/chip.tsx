import { Chip } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const ChipComp = ({ isOnline }: any) => {
  const { t } = useTranslation();
  const title = isOnline ? t('deployer.vision.turnOn') : t('deployer.vision.turnOff');
  const color = isOnline ? 'success' : 'warning';
  return <Chip label={title} color={color} size='small' />;
};

export default memo(ChipComp);
