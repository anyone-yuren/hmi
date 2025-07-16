import { Divider, ListItemText, MenuItem, MenuList, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../../store/hybird.store';
const HybirdStatus = () => {
  const { t } = useTranslation();
  const navigationTypes = {
    1: t('反光板'),
    2: t('SLAM'),
    5: t('二维码'),
  };
  const naviStatus = {
    0: t('正常'),
    1: t('定位丢失'),
  };

  const { robot_current_status } = useHybirdStore(
    useShallow((state) => ({
      robot_current_status: state.robot_current_status,
    })),
  );

  const {
    navigation_type,
    navi_status,
    system_status,
    floor_number,
  }: {
    navigation_type: number;
    navi_status: number;
    system_status: number;
    floor_number: number;
  } = robot_current_status || {};
  return (
    <MenuList className='w-full'>
      <MenuItem sx={{ padding: '4px' }}>
        <ListItemText disableTypography sx={{ color: 'text.primary', fontSize: '14px', fontWeight: 'bold' }}>
          {t('导航模式')}
        </ListItemText>
        <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
          {navigationTypes[navigation_type] || t('未知')}
        </Typography>
      </MenuItem>
      <MenuItem sx={{ padding: '8px' }}>
        <ListItemText disableTypography sx={{ color: 'text.primary', fontSize: '14px', fontWeight: 'bold' }}>
          {t('状态')}
        </ListItemText>
        <Typography variant='body2' color={navi_status === 0 ? 'primary' : 'error'} sx={{ fontWeight: 'bold' }}>
          {system_status !== 0 ? t('建图中') : naviStatus[navi_status]}
        </Typography>
      </MenuItem>
      <MenuItem sx={{ padding: '8px' }}>
        <ListItemText disableTypography sx={{ color: 'text.primary', fontSize: '14px', fontWeight: 'bold' }}>
          {t('当前楼层')}
        </ListItemText>
        <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
          {floor_number || ''}
        </Typography>
      </MenuItem>
      <Divider />
    </MenuList>
  );
};
export default HybirdStatus;
