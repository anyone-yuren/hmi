import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import { Input } from 'antd';
import { forwardRef, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import { MapTaskPanel, MapTaskPanelHeader, TaskItem } from '../Style';
import DeleteIcon from './SvgIcon/DeleteIcon';
import EditIcon from './SvgIcon/EditIcon';
import PointsAdd from './SvgIcon/PointsAdd';

import { ThemeProvider } from 'antd-style';

export type IActive = 'task' | 'template';
const TaskPanel = forwardRef((props: any, ref) => {
  const { setOffsetVisible, offsetList } = props;
  const { t } = useTranslation();
  const renderOffsetList = useMemo(() => {
    return offsetList ? offsetList : [];
  }, [offsetList]);

  return (
    <MapTaskPanel>
      <MapTaskPanelHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Typography sx={{ fontSize: '20px' }} variant='h5'>
            {t('deployer.singleTask.offsetTable')}
          </Typography>
          <PointsAdd
            fontSize={18}
            onClick={() => {
              console.log('handle add');
            }}
          ></PointsAdd>
        </div>
        <CloseIcon
          fontSize={'large'}
          onClick={() => {
            setOffsetVisible(false);
          }}
        ></CloseIcon>
      </MapTaskPanelHeader>
      <ThemeProvider
        defaultThemeMode='dark'
        theme={{
          components: {
            Input: {
              activeBg: '#00d1d11a',
            },
          },
        }}
      >
        <Input.Search placeholder='请输入点号' variant='filled' />
      </ThemeProvider>
      <div className='flex flex-col'>
        {renderOffsetList?.map((point, index) => {
          return (
            <TaskItem>
              <div className='flex pt-[5px] justify-between items-center'>
                <div className='text-[18px]'>点号: {point.PointNumber}</div>
                <div className='w-[70px] flex items-center justify-center gap-[20px]'>
                  <EditIcon fontSize={20}></EditIcon>
                  <DeleteIcon fontSize={20} isActive onClick={() => {}}></DeleteIcon>
                </div>
              </div>
              <div className='flex pb-[5px] pt-[3px] justify-between items-center text-[12px]'>
                <div>
                  <span className='w-[80px] inline-block'>偏移X: {point.X}</span>
                  <span className='w-[80px] inline-block'>偏移Y: {point.Y}</span>
                </div>
                <div className='text-[#ccc]'>
                  <span>2025/01/01 12:00:00</span>
                </div>
              </div>
              {/* <div className='flex w-full'>
                <div className='flex-1 py-[3px]'>
                  <div className='text-[16px]'>点号: {point.PointNumber}</div>
                  <div className='text-[12px]'>
                    <span className='w-[80px] inline-block'>偏移X: {point.X}</span>
                    <span className='w-[80px] inline-block'>偏移Y: {point.Y}</span>
                  </div>
                </div>

                <div className='w-[70px] flex items-center justify-center gap-[20px]'>
                  <EditIcon fontSize={20}></EditIcon>
                  <DeleteIcon fontSize={20} isActive onClick={() => {}}></DeleteIcon>
                </div>
              </div> */}
            </TaskItem>
          );
        })}
      </div>
    </MapTaskPanel>
  );
});

export default memo(TaskPanel);
