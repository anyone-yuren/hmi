import ClearIcon from '@mui/icons-material/Clear';
import { Chip, IconButton, ListItemText, MenuItem } from '@mui/material';
import { useRequest } from 'ahooks';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getModelList } from '@/views/Vision/services/index';
import CustomSelect from './customSelect';
import TextUpdateRow from './textUpdateRow';

interface IProps {
  title?: string;
  value: [];
  onChange: (value: []) => void;
  className?: string;
}
const ModelListSelect = (props: IProps) => {
  const { title, value, onChange } = props;
  const { data: modelList } = useRequest(() => getModelList(), {});
  const { t } = useTranslation();

  const modelHashMap = useMemo(() => {
    const hashMap: any = {};
    modelList?.data?.forEach((item: any) => {
      hashMap[item.id] = item.name;
    });
    return hashMap;
  }, [modelList]);

  return (
    <TextUpdateRow>
      <div>{title || t('模型')}</div>
      <div className='relative'>
        <CustomSelect
          multiple
          variant='standard'
          value={value}
          renderValue={(value: any) => {
            return (
              <div className='flex flex-wrap'>
                {value?.map((item: any, index: number) => {
                  return (
                    <Chip
                      key={item.id + (index + '')}
                      className='mt-1 mr-10'
                      label={modelHashMap?.[item] || '-'}
                      size='small'
                    />
                  );
                })}
              </div>
            );
          }}
          onChange={(event: any) => {
            onChange && onChange(event.target.value);
          }}
        >
          {modelList?.data?.map((item: any) => (
            <MenuItem
              key={item.id}
              value={item.id}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#00d1d1ad', // 修改选中项的背景色
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#00d1d1ad', // 修改选中项的背景色
                },
              }}
            >
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </CustomSelect>
        {value?.length > 0 && (
          <IconButton
            onClick={() => {
              onChange && onChange([]);
            }}
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </div>
    </TextUpdateRow>
  );
};

export default memo(ModelListSelect);
