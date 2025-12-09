import { TextField } from '@mui/material';
import { useGetState, useSize } from 'ahooks';
import { forwardRef, memo, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import MwConfirm from '../../MwConfirm';
import InputWidthKeyboard from '../../inputWithKeyboard';
import ParamsSetting from '../paramsSetting/setting';
import { InSideAnnotation, OutSideAnnotation } from './concentricAnnotation';

const Concentric = forwardRef((props: any, ref: any) => {
  const [propsState, setPropsState] = useState({ ...props });
  const [maxDiameter, setMaxDiameter] = useState(props?.maxDiameter);
  const [minDiameter, setMinDiameter] = useState(props?.minDiameter);
  const [, setInput, getInput] = useGetState();

  const divRef = useRef(null);
  const divSize = useSize(divRef);

  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    getParams: () => {
      const { type, id, name } = props;
      return {
        ...props,
        ...propsState,
        id,
        type,
        maxDiameter,
        minDiameter,
        name,
      };
    },
  }));

  const scale = useMemo(() => {
    if (!divSize?.width || !props.maxDiameter || !props.maxDiameter) return 0;
    const obj = {
      width: divSize?.width / props?.maxDiameter,
      height: divSize?.height / props?.maxDiameter,
    };
    return Math.min(obj.width, obj.height) * 0.8;
  }, [props.maxDiameter, divSize]);

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  const handleSizeArea = (key: string) => {
    const configHashMap: any = {
      title: {
        maxDiameter: t('deployer.vision.outDiameter'),
        minDiameter: t('deployer.vision.inDiameter'),
      },
      value: {
        maxDiameter,
        minDiameter,
      },
      onChange: {
        maxDiameter: setMaxDiameter,
        minDiameter: setMinDiameter,
      },
      validation: {
        maxDiameter: (val: string) => {
          return Number(val) > 5000;
        },
        minDiameter: (val: string) => {
          return Number(val) > 4900;
        },
      },
    };
    setInput(configHashMap.value[key]);

    MwConfirm.confirm({
      title: configHashMap.title[key],
      content: (
        <>
          {isMultiwayAgv ? (
            <InputWidthKeyboard
              input={configHashMap.value[key] + ''}
              setInput={(val: any) => {
                setInput(val);
              }}
              placeholder={`${t('common.plsInput')}`}
              mode={'numbers'}
            ></InputWidthKeyboard>
          ) : (
            <TextField
              fullWidth
              autoFocus
              defaultValue={!configHashMap.value[key] ? '' : configHashMap.value[key]}
              onChange={(event) => {
                setInput(event.target.value as any);
              }}
            ></TextField>
          )}
        </>
      ),
      onOk: async () => {
        const val: any = getInput();
        if (!/^\d+$/.test(val)) {
          toast.error(t('deployer.vision.plsInputNumber'));
          return Promise.reject();
        }
        const isValidation = configHashMap.validation[key](val);
        if (isValidation) {
          toast.error(t('deployer.vision.concentricValidateTips'));
          return Promise.reject();
        }
        configHashMap.onChange[key] && configHashMap.onChange[key](val);
      },
    });
  };

  return (
    <div className='flex items-center w-full h-full'>
      {props?.showMarks && <ParamsSetting propsState={propsState} setPropsState={setPropsState}></ParamsSetting>}

      <div
        ref={divRef}
        className='flex flex-1 w-full h-full justify-center'
        style={{ marginInline: propsState?.showMarks ? '50px' : '0px' }}
      >
        <div
          style={{
            width: maxDiameter * scale,
            height: maxDiameter * scale,
            background: '#0fd7d7',
            borderRadius: maxDiameter * scale,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: ((divSize?.height || 0) - maxDiameter * scale) / 2,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: minDiameter * scale,
              height: minDiameter * scale,
              background: 'white',
              borderRadius: maxDiameter * scale,
              position: 'relative',
            }}
          >
            {props.showMarks && !!scale && (
              <InSideAnnotation minDiameter={minDiameter} handleSizeArea={handleSizeArea}></InSideAnnotation>
            )}
          </div>
          {props.showMarks && !!scale && (
            <OutSideAnnotation maxDiameter={maxDiameter} handleSizeArea={handleSizeArea}></OutSideAnnotation>
          )}
        </div>
      </div>
    </div>
  );
});

export default memo(Concentric);
