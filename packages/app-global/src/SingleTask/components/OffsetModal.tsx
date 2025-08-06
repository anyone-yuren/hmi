import LoadingButton from '@mui/lab/LoadingButton';
import { Button, ThemeProvider, createTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import { forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import useConstants from '../useConstants';
const Info = (props) => {
  const { vertexTypeHashMap } = useConstants();
  const { t } = useTranslation();
  const renderTypeText = useMemo(() => {
    return props.types
      .map((item) => {
        return vertexTypeHashMap[item];
      })
      .join('、');
  }, [vertexTypeHashMap, props.types]);
  return (
    <div className='w-full bg-[white] text-black p-[20px]'>
      <div className='flex justify-between items-center text-[20px]'>
        <div>
          {t('deployer.singleTask.point')}: {props.id}
        </div>
        <div>
          {t('deployer.singleTask.pointType')}: {renderTypeText}
        </div>
      </div>
      <div className='flex justify-between'>
        <div>
          X{t('deployer.singleTask.axis')}:{props.origin_x}
        </div>
        <div>
          Y{t('deployer.singleTask.axis')}:{props.origin_y}
        </div>
        <div>
          {t('deployer.singleTask.offset')}X:{props.offsetX || '-'}
        </div>
        <div>
          {t('deployer.singleTask.offset')}Y:{props.offsetY || '-'}
        </div>
      </div>
    </div>
  );
};

const OffsetModal = forwardRef((props: any, ref) => {
  const { type, point, setOffsetModalVisible } = props;
  const { t } = useTranslation();
  if (!type) return;
  if (type === 'Info') {
    return <Info {...point} />;
  }
  const [offsetInput, setOffsetInput] = useState({
    id: null,
    offsetX: null,
    offsetY: null,
  });

  useEffect(() => {
    setOffsetInput({
      id: point.id,
      offsetX: point.offsetX,
      offsetY: point.offsetY,
    });
  }, [point.id, point.offsetX, point.offsetY]);

  const valueChange = (event, key) => {
    const value = event.target.value;
    setOffsetInput({
      ...offsetInput,
      [key]: value,
    });
  };
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#00D1D1',
          },
        },
        typography: {
          fontSize: 20,
        },
      })}
    >
      <div className='w-full flex flex-col gap-[10px] p-[20px] bg-[white] text-black'>
        <TextField
          label={t('deployer.singleTask.point')}
          variant='filled'
          value={offsetInput.id}
          onChange={(event) => {
            valueChange(event, 'id');
          }}
        />
        <TextField
          label={t('deployer.singleTask.offset') + 'X'}
          variant='filled'
          value={offsetInput.offsetX}
          onChange={(event) => {
            valueChange(event, 'offsetX');
          }}
        />
        <TextField
          label={t('deployer.singleTask.offset') + 'Y'}
          variant='filled'
          value={offsetInput.offsetY}
          onChange={(event) => {
            valueChange(event, 'offsetY');
          }}
        />
        <div className='w-full flex'>
          <Button
            onClick={() => {
              setOffsetModalVisible(false);
            }}
            style={{ flex: 1, fontSize: '18px', color: '#888888' }}
          >
            {t('common.cancel')}
          </Button>
          <div
            style={{
              width: '1px',
              height: '48px',
              background: 'rgba(0, 0, 0, 0.1)',
            }}
          ></div>
          <LoadingButton loading={false} onClick={() => {}} style={{ flex: 1, color: '#00D1D1', fontSize: '18px' }}>
            {t('common.confirm')}
          </LoadingButton>
        </div>
      </div>
    </ThemeProvider>
  );
});

export default memo(OffsetModal);
