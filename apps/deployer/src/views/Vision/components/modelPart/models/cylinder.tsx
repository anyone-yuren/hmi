import { TextField } from '@mui/material';
import { useGetState, useSize } from 'ahooks';
import { forwardRef, memo, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import MwConfirm from '../../MwConfirm';
import InputWidthKeyboard from '../../inputWithKeyboard';
import ParamsSetting from '../paramsSetting/setting';
import CylinderAnnotation from './cylinderAnnotation';

const Cylinder = forwardRef((props: any, ref: any) => {
  const [propsState, setPropsState] = useState({ ...props });
  const [diameter, setDiameter] = useState(props?.diameter);
  const [height, setHeight] = useState(props?.height);
  const [, setInput, getInput] = useGetState();
  const divRef = useRef(null);
  const divSize = useSize(divRef); // 可以理解为画布大小

  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    getParams: () => {
      const { type, id, name } = props;
      return { ...props, ...propsState, id, type, diameter, height, name };
    },
  }));

  const scale = useMemo(() => {
    if (!divSize?.width || !props.diameter || !props.height) return 0;
    const obj = {
      width: divSize?.width / props?.diameter,
      height: divSize?.height / props?.height,
    };
    return Math.min(obj.width, obj.height) * 0.6;
  }, [props?.height, props?.diameter, divSize]);

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  const handleSizeArea = (key: string) => {
    const configHashMap: any = {
      title: {
        diameter: t('deployer.vision.diameter'),
        height: t('deployer.vision.height'),
      },
      value: {
        diameter,
        height,
      },
      onChange: {
        diameter: setDiameter,
        height: setHeight,
      },
      validation: {
        diameter: (val: string) => {
          return Number(val) > 5000;
        },
        height: (val: string) => {
          return Number(val) > 1500;
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
          toast.error(t('deployer.vision.basicSizeValidateTips'));
          return Promise.reject();
        }
        configHashMap.onChange[key] && configHashMap.onChange[key](val);
      },
    });
  };

  return (
    <div className='flex flex-col w-full h-full'>
      <div ref={divRef} className='flex flex-1 w-full h-full justify-center'>
        <div
          className='cylinder relative'
          style={{
            width: diameter * scale,
            height: height * scale,
            background: '#0fd7d7',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: ((divSize?.height || 0) - height * scale) / 2,
          }}
        >
          {props.showMarks && !!scale && (
            <CylinderAnnotation
              {...props}
              {...{ diameter, height }}
              handleSizeArea={handleSizeArea}
            ></CylinderAnnotation>
          )}
        </div>
      </div>
      {props?.showMarks && <ParamsSetting propsState={propsState} setPropsState={setPropsState}></ParamsSetting>}
    </div>
  );
});

export default memo(Cylinder);
