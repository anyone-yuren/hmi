import useObsError from '@/components/NotificationGlobal/obsError';
import { Icon } from '@iconify/react';
import { ArrowRight } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import {
  ButtonBaseProps,
  createTheme,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material';
import Switch from '@mui/material/Switch';
import { useRequest } from 'ahooks';
import { Badge } from 'antd';
import { useResponsive } from 'antd-style';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { getDeviceList } from '../service';
import { useSafetyStore } from '../store/safety.store';

interface HandleButtonProps extends ButtonBaseProps {
  selected?: boolean;
}

const ControlList = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 0,
    paddingRight: 0,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 6,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

const StatusPanel = (prop) => {
  const { xl } = useResponsive();
  const { t, i18n } = useTranslation();
  const { obstacleData, obstacleIndex, handleChange } = prop;
  const { data: deviceList } = useRequest(getDeviceList);
  const { getObsMsg } = useObsError();
  const { goodsInfo, obsInfo, setCloudCategory, cloudCategory } = useSafetyStore(
    useShallow((store) => ({
      goodsInfo: store.goodsInfo,
      obsInfo: store.obsInfo,
      setCloudCategory: store.setCloudCategory,
      cloudCategory: store.cloudCategory,
    })),
  );

  const serviceLanguage = useMemo(() => {
    return i18n.language;
  }, [i18n.language]);

  const controls = useMemo(() => {
    if (!deviceList || !obstacleData || !obstacleIndex) return null;
    const ary = obstacleData?.data?.find((item: any) => item.scheme_id === obstacleIndex)?.sensor_enable;
    return deviceList?.data
      ? deviceList?.data
          ?.filter((item) => ary.includes(item.id))
          ?.map((item) => {
            return (
              <ListItem component='div' disablePadding key={item?.id}>
                <ListItemIcon
                  sx={{
                    width: '10px',
                    justifyContent: 'center',
                  }}
                >
                  <Badge
                    status={obsInfo.sensor_names?.includes(item?.id) ? 'processing' : 'default'}
                    color={obsInfo.sensor_names?.includes(item?.id) ? 'red' : '#999'}
                    styles={{
                      indicator: {
                        width: obsInfo.sensor_names?.includes(item?.id) ? 12 : 8,
                        height: obsInfo.sensor_names?.includes(item?.id) ? 12 : 8,
                      },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  id='switch-list-label-bluetooth'
                  disableTypography
                  sx={{ color: 'text.primary', fontSize: '14px' }}
                  primary={serviceLanguage.includes('zh') ? item.ch_name : item.name}
                />
                <Switch
                  edge='end'
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCloudCategory([...cloudCategory, item?.id]);
                    } else {
                      setCloudCategory(cloudCategory.filter((v) => v !== item?.id));
                    }
                  }}
                  checked={cloudCategory?.includes(item?.id)}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-bluetooth',
                  }}
                />
              </ListItem>
            );
          })
      : [];
  }, [deviceList, obsInfo.sensor_sources, cloudCategory, serviceLanguage, obstacleData, obstacleIndex]);

  return (
    <>
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: 'light',
            primary: {
              main: '#00D1D1',
            },
          },
        })}
      >
        <Paper
          sx={{
            width: xl ? '280px' : '240px',
          }}
          className={`flex items-baseline flex-col justify-between absolute  z-[9999] text-black p-2 left-2 top-2`}
        >
          <ControlList
            component='nav'
            disablePadding
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          >
            <Typography sx={{ my: 0 }} variant='subtitle2' component='div'>
              {t('deployer.safety.status')}
            </Typography>
            <ListItemButton sx={{ py: 0, minHeight: 32, fontSize: '14px' }}>
              <ListItemIcon sx={{ marginRight: 0 }}>
                <Icon fontSize={20} icon='ep:tools' />
              </ListItemIcon>
              <ListItemText
                disableTypography
                sx={{ color: 'text.primary', fontSize: '14px' }}
                primary={t('deployer.safety.vehicleStatus')}
              />
            </ListItemButton>
            <ListItemButton sx={{ py: 0, minHeight: 32, fontSize: '14px' }}>
              <ListItemIcon>
                <Icon fontSize={20} icon='stash:radar-duotone' />
              </ListItemIcon>
              <ListItemText
                disableTypography
                sx={{ color: 'text.primary', fontSize: '14px' }}
                primary={t('deployer.safety.obsType')}
              />
              {getObsMsg(obsInfo.type as number) || '-'}
            </ListItemButton>

            <ListItemButton sx={{ py: 0, minHeight: 32, fontSize: '14px' }}>
              <ListItemIcon>
                <Icon fontSize={20} icon='eos-icons:compare-states-outlined' />
              </ListItemIcon>
              <ListItemText
                disableTypography
                sx={{ color: 'text.primary', fontSize: '14px' }}
                primary={t('deployer.safety.goodsStatus')}
              />
              {goodsInfo?.good_status ? t('deployer.safety.hasGoods') : t('deployer.safety.noGoods')}
            </ListItemButton>
            <ListItemButton sx={{ py: 0, minHeight: 32, fontSize: '14px' }}>
              <ListItemIcon>
                <Icon fontSize={20} icon='grommet-icons:share-option' />
              </ListItemIcon>
              <ListItemText
                disableTypography
                sx={{ color: 'text.primary', fontSize: '14px' }}
                primary={t('deployer.safety.currentScheme')}
              />
              {obsInfo.scheme_id || '-'}
              <Tooltip title={t('common.setting')}>
                <IconButton
                  onClick={() => handleChange(obsInfo.scheme_id)}
                  size='large'
                  sx={{
                    marginLeft: '8px',
                    '& svg': {
                      color: 'rgba(0,0,0,0.8)',
                      transition: '0.2s',
                      transform: 'translateX(0) rotate(0)',
                    },
                    '&:hover, &:focus': {
                      bgcolor: 'unset',
                      '& svg:first-of-type': {
                        transform: 'translateX(-4px) rotate(-20deg)',
                      },
                      '& svg:last-of-type': {
                        right: 0,
                        opacity: 1,
                      },
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      height: '40%',
                      display: 'block',
                      left: 0,
                      width: '1px',
                      bgcolor: 'divider',
                    },
                  }}
                >
                  <EditIcon />
                  <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                </IconButton>
              </Tooltip>
            </ListItemButton>
            <Divider sx={{ marginBlock: '10px' }} />
            <Typography sx={{ my: 0 }} variant='subtitle2' component='div'>
              {t('deployer.safety.sensorCloud')}
            </Typography>
            {controls}
          </ControlList>
        </Paper>
      </ThemeProvider>
    </>
  );
};
export default memo(StatusPanel);
