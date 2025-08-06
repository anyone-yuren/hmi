import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import { Input } from 'antd';
import { forwardRef, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import { MapTaskPanel, MapTaskPanelHeader, TaskItem } from '../Style';
import DeleteIcon from './SvgIcon/DeleteIcon';
import EditIcon from './SvgIcon/EditIcon';
import PointsAdd from './SvgIcon/PointsAdd';

import { ThemeProvider } from 'antd-style';

export type IActive = 'task' | 'template';
const OffsetPanel = forwardRef((props: any, ref) => {
  const { setOffsetVisible, offsetList } = props;
  const [searchText, setSearchText] = useState('');
  const { t } = useTranslation();
  const renderOffsetList = useMemo(() => {
    const originList = offsetList ? offsetList : [];
    const ary = originList?.filter((item: any) => {
      return !searchText ? true : item.PointNumber && item.PointNumber.toString().indexOf(searchText) > -1;
    });
    return ary;
  }, [offsetList, searchText]);

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
        <Input.Search
          allowClear
          placeholder={t('deployer.singleTask.plsInputPoint')}
          variant='filled'
          onSearch={(value: any) => {
            setSearchText(value);
          }}
        />
      </ThemeProvider>
      <div className='flex flex-col'>
        {renderOffsetList?.map((point, index) => {
          return (
            <TaskItem>
              <div className='flex pt-[5px] justify-between items-center'>
                <div className='text-[18px]'>
                  {t('deployer.singleTask.point')}: {point.PointNumber}
                </div>
                <div className='w-[70px] flex items-center justify-center gap-[20px]'>
                  <EditIcon fontSize={20}></EditIcon>
                  <DeleteIcon fontSize={20} isActive onClick={() => {}}></DeleteIcon>
                </div>
              </div>
              <div className='flex pb-[5px] pt-[3px] justify-between items-center text-[12px]'>
                <div>
                  <span className='w-[80px] inline-block'>
                    {t('deployer.singleTask.offset')}X: {point.X}
                  </span>
                  <span className='w-[80px] inline-block'>
                    {t('deployer.singleTask.offset')}Y: {point.Y}
                  </span>
                </div>
                <div className='text-[#ccc]'>
                  <span>2025/01/01 12:00:00</span>
                </div>
              </div>
            </TaskItem>
          );
        })}
      </div>
    </MapTaskPanel>
  );
});

export default memo(OffsetPanel);
