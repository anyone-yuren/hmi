import { StyledComponent } from '@emotion/styled';
import { Grid, GridProps, Input, MenuItem, Popover, styled } from '@mui/material';
import { t } from 'i18next';
import { memo, useMemo, useRef, useState } from 'react';

import { useSize } from 'ahooks';

import IconLabelButton from './IconLabelButton';

export type TItemKey = string | number | null | undefined;
type TPointOrLine = {
  id?: string | number;
  x?: number;
  y?: number;
  label?: string | null;
};
export interface IPointOrLineBoxProps {
  title?: string | number | null;
  titleStyle?: Record<string, any>;
  subTitle?: string | null;
  subTitleStyle?: Record<string, any>;
  list?: Array<TPointOrLine>;
  onChange?: (key: TItemKey) => void;
  name?: string;
}

const PointOrLineBox = (props: IPointOrLineBoxProps) => {
  const { title = null, subTitle, onChange, list = [], titleStyle = {}, subTitleStyle = {}, name } = props;

  const [inputValue, setInputValue] = useState<any>('');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const labelBoxRef = useRef(null);
  const labelBoxSize = useSize(labelBoxRef);

  const Title = styled('div')(() => ({
    color: 'white',
    fontSize: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Microsoft YaHei',
    ...titleStyle,
  }));

  const SubTitle = styled('div')(() => ({
    color: 'white',
    fontSize: '12px',
    ...subTitleStyle,
  }));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    Promise.resolve().then(() => {
      setInputValue('');
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleItemClick = (item: TItemKey) => {
    onChange && onChange(item);
    handleClose();
    setInputValue('');
  };

  const titleLabel = useMemo(() => {
    if (!title) {
      return '-';
    }
    const obj = list.filter((it: any) => it?.id === title);
    return obj.length ? obj[0]?.label || obj[0]?.id : '-';
  }, [title, list]);
  return (
    <div>
      <div ref={labelBoxRef}>
        <IconLabelButton
          icon={<Title>{titleLabel || '-'}</Title>}
          label={title ? null : <SubTitle>{subTitle}</SubTitle>}
          onClick={handleClick}
        ></IconLabelButton>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ maxHeight: '300px', overflow: 'auto', position: 'relative' }}>
          {name === 'right_action_panel' && (
            <Input
              value={inputValue}
              sx={{ width: labelBoxSize?.width, paddingInline: '20px' }}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
            />
          )}
          {list.length ? (
            list
              ?.filter((item) => {
                return inputValue ? String(item?.id).includes(inputValue) : true;
              })
              ?.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item?.label || item.id}
                  sx={{
                    width: labelBoxSize?.width,
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                  onClick={() => handleItemClick(item.id)}
                >
                  {item?.label || item.id}
                </MenuItem>
              ))
          ) : (
            <MenuItem
              key='nodata'
              sx={{
                width: labelBoxSize?.width,
                justifyContent: 'center',
                fontSize: '18px',
                padding: '15px 0px',
              }}
            >
              {t('common.noData')}
            </MenuItem>
          )}
        </div>
      </Popover>
    </div>
  );
};

export const PointCardContainer: StyledComponent<GridProps> = styled(Grid)(() => ({
  height: '50px',
  borderRadius: '10px',
  background: '#d8d8d833',
}));
export default memo(PointOrLineBox);
