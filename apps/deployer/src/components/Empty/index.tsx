import { t } from 'i18next';
// 暂无数据
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Empty from '../SvgIcon/Empty';

const StyleBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

interface IEmptyProps {
  title?: string | React.ReactNode;
  backgroundColor?: string;
  iconColor?: string;
  titleColor?: string;
}

const EmptyBox = (props: IEmptyProps) => {
  const { title, backgroundColor, iconColor = 'rgb(255 255 255 / 50%)', titleColor = '#FFFFFF' } = props;
  return (
    <StyleBox
      sx={{
        textAlign: 'center',
        backgroundColor: backgroundColor || '#fff',
        color: iconColor,
      }}
    >
      <Empty />
      <span
        style={{
          fontSize: '16px',
          color: titleColor,
          opacity: 0.5,
          marginTop: '10px',
        }}
      >
        {title || t('common.noData')}
      </span>
    </StyleBox>
  );
};

export default EmptyBox;
