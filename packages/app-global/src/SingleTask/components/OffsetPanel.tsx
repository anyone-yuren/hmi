import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import { useSize } from 'ahooks';
import { Input } from 'antd';
import { ThemeProvider } from 'antd-style';
import dayjs from 'dayjs';
import List from 'rc-virtual-list';
import { forwardRef, memo, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import 'swiper/css';
import MwConfirm from '../components/MwConfirm';
import { deleteOffsetTable } from '../services/index';
import { MapTaskPanel, MapTaskPanelHeader, TaskItem } from '../Style';
import DeleteIcon from './SvgIcon/DeleteIcon';
import EditIcon from './SvgIcon/EditIcon';
import PointsAdd from './SvgIcon/PointsAdd';

export type IActive = 'task' | 'template';
const OffsetPanel = forwardRef((props: any, ref) => {
  const { setOffsetVisible, offsetList, setOffsetModalVisible, setOffsetModalConfig, getOffsetList } = props;
  const [searchText, setSearchText] = useState('');
  const { t } = useTranslation();
  const virtualListRef = useRef<any>(null);
  const size = useSize(virtualListRef);

  const renderOffsetList = useMemo(() => {
    const originList = offsetList?.data ? offsetList.data : [];
    const ary = originList?.filter((item: any) => {
      return !searchText ? true : item.point_id && item.point_id.toString().indexOf(searchText) > -1;
    });
    return ary;
  }, [offsetList, searchText]);

  const handleCreateOffset = () => {
    setOffsetModalConfig({
      type: 'Offset',
      point: {},
    });
    setOffsetModalVisible(true);
  };

  const handleUpdateOffset = (point: any) => {
    setOffsetModalConfig({
      type: 'Offset',
      point: {
        id: point.point_id,
        offsetX: point.x,
        offsetY: point.y,
      },
    });
    setOffsetModalVisible(true);
  };

  const handleDeleteOffset = (point: any) => {
    MwConfirm.confirm({
      title: t('deployer.singleTask.deleteOffset'),
      content: t('deployer.singleTask.confirmDeleteOffsetTips'),

      onOk: async () => {
        const params = {
          point_id: point.point_id,
        };
        const { code }: any = await deleteOffsetTable(params);
        if (code === 200) {
          toast.success(t('common.actionSuccess'));
          getOffsetList();
        }
      },
    });
  };

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
          <PointsAdd fontSize={18} onClick={handleCreateOffset}></PointsAdd>
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
      <div ref={virtualListRef} className='flex flex-col h-full overflow-hidden'>
        <List data={renderOffsetList} height={size?.height} itemHeight={10} itemKey={'point_id'}>
          {(point, index) => {
            return (
              <TaskItem>
                <div className='flex flex-col w-full'>
                  <div className='flex pt-[5px] justify-between items-center'>
                    <div className='text-[18px]'>
                      {t('deployer.singleTask.point')}: {point.point_id}
                    </div>
                    <div className='w-[70px] flex items-center justify-center gap-[20px]'>
                      <div
                        onClick={() => {
                          handleUpdateOffset(point);
                        }}
                      >
                        <EditIcon fontSize={20}></EditIcon>
                      </div>

                      <DeleteIcon
                        fontSize={20}
                        isActive
                        onClick={() => {
                          handleDeleteOffset(point);
                        }}
                      ></DeleteIcon>
                    </div>
                  </div>
                  <div className='flex pb-[5px] pt-[3px] justify-between items-center text-[12px]'>
                    <div className='flex-1 flex gap-[6px]'>
                      <span className='inline-block'>
                        {t('deployer.singleTask.offset')}X: {point.x}
                      </span>
                      <span className='inline-block'>
                        {t('deployer.singleTask.offset')}Y: {point.y}
                      </span>
                    </div>
                    <div className='text-[#ccc]'>
                      <span>{point.time ? dayjs.unix(point.time).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
                    </div>
                  </div>
                </div>
              </TaskItem>
            );
          }}
          {/* {renderOffsetList?.map((point, index) => {
            return (
              
            );
          })} */}
        </List>
      </div>
    </MapTaskPanel>
  );
});

export default memo(OffsetPanel);
