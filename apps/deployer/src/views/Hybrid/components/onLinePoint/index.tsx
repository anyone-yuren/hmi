import PageLoading from '@/components/PageLoading';
import { Add } from '@mui/icons-material';
import { List, ListItem, ListItemText, styled, Typography } from '@mui/material';
import { useLatest, useRequest } from 'ahooks';
import { Button, ConfigProvider, Space, theme } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { relocatePoint } from '../../service';
import { useHybirdStore } from '../../store/hybird.store';
import MwConfirm from '../MwConfirm';
import InputWidthKeyboard from '../inputWithKeyboard';
const ControlList = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 0,
    paddingRight: 0,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});
const OnlinePoint = () => {
  const { t } = useTranslation();
  const { setOnlineData } = useHybirdStore(
    useShallow((store) => {
      return {
        setOnlineData: store.setOnlineData,
      };
    }),
  );
  const [linePoint, setLinePoint] = React.useState([]);
  const {
    data: onlinePoint,
    loading,
    runAsync: run,
  } = useRequest(relocatePoint, {
    manual: true,
  });

  const getLinePoint = async () => {
    const res: any = await run({ cmd_type: 4 });
    if (res.error_code === 10000) {
      setLinePoint(res.point_list);
      setOnlineData(res);
    } else {
      res?.error_description && toast.error(res?.error_description);
      // toast.error(t('获取上线点失败'));
    }
  };
  React.useEffect(() => {
    getLinePoint();
  }, []);

  const generate = React.useMemo(() => {
    return linePoint?.map((item: any) => (
      <ListItem
        key={item.point_id}
        component='div'
        disablePadding
        sx={{
          '& .MuiListItemSecondaryAction-root': {
            right: 0,
          },
        }}
        secondaryAction={
          <Space>
            <Button
              type='link'
              ghost
              size='small'
              onClick={() => {
                MwConfirm.confirm({
                  title: t('deployer.hybrid.online') as string,
                  content: t('deployer.hybrid.isOnline'),
                  onOk: async () => {
                    const res: any = await run({
                      cmd_type: 3,
                      point_id: item.point_id,
                    });
                    if (res.error_code === 10000) {
                      toast.success(t('common.actionSuccess'));
                    } else {
                      toast.error(t('common.actionFail'));
                    }
                  },
                });
              }}
            >
              {t('deployer.hybrid.online')}
            </Button>
            <Button
              type='link'
              danger
              size='small'
              onClick={() => {
                MwConfirm.confirm({
                  title: t('common.delete') as string,
                  content: t('deployer.hybrid.isDelete'),
                  onOk: async () => {
                    const res: any = await run({
                      cmd_type: 2,
                      point_id: item.point_id,
                    });
                    if (res.error_code === 10000) {
                      toast.success(t('common.actionSuccess'));
                      getLinePoint();
                    } else {
                      toast.error(t('common.actionFail'));
                    }
                  },
                });
              }}
            >
              {t('common.delete')}
            </Button>
          </Space>
        }
      >
        <ListItemText primary={item.point_id} />
      </ListItem>
    ));
  }, [linePoint]);

  const [newPoint, setNewPoint] = React.useState();
  const latestInputText = useLatest(newPoint);

  const addPoint = async () => {
    MwConfirm.confirm({
      title: t('deployer.hybrid.onlineId') as string,
      content: (
        <>
          <InputWidthKeyboard
            mode='numbers'
            input={''}
            placeholder={t('common.plsInput')}
            setInput={setNewPoint}
          ></InputWidthKeyboard>
        </>
      ),

      onOk: async () => {
        const addFloorNumber = Number(latestInputText.current);
        const res: any = await run({
          cmd_type: 1,
          point_id: addFloorNumber,
        });
        if (res.error_code === 10000) {
          toast.success(t('common.actionSuccess'));
          getLinePoint();
        } else {
          toast.error(t('deployer.hybrid.addFail'));
        }
      },
    });
  };
  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <div className='w-full'>
        <Typography variant='subtitle2' component={'div'} sx={{ mt: 2 }} className='flex justify-between items-center'>
          {t('deployer.hybrid.onlineList')}
          <Add onClick={addPoint}></Add>
        </Typography>
        {loading ? (
          <PageLoading></PageLoading>
        ) : (
          <ControlList component='nav' disablePadding>
            {generate}
          </ControlList>
        )}
      </div>
    </ConfigProvider>
  );
};

export default OnlinePoint;
