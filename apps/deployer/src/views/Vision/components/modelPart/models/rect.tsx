import { TextField } from '@mui/material';
import { useGetState, useSize } from 'ahooks';
import { forwardRef, memo, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import MwConfirm from '../../MwConfirm';
import InputWidthKeyboard from '../../inputWithKeyboard';
import { IRectProps } from '../index.d';
import ParamsSetting from '../paramsSetting/setting';
import RectAnnotation from './rectAnnotation';

const Rect = forwardRef((props: IRectProps, ref) => {
  const [propsState, setPropsState] = useGetState({ ...props });
  const [width, setWidth] = useState(props?.width);
  const [height, setHeight] = useState(props?.height);
  const [, setInput, getInput] = useGetState();
  const divRef = useRef(null);
  const divSize = useSize(divRef);

  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    getParams: () => {
      const { type, id, name } = props;
      return { ...props, ...propsState, id, type, width, height, name };
    },
  }));

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  const scale = useMemo(() => {
    if (!divSize?.width || !width || !height) return 0;
    const obj = {
      width: divSize?.width / width,
      height: divSize?.height / height,
    };
    return Math.min(obj.width, obj.height) * 0.9;
  }, [width, height, divSize]);

  const handleSizeArea = (key: string) => {
    const configHashMap: any = {
      title: {
        width: t('deployer.vision.width'),
        height: t('deployer.vision.height'),
      },
      value: {
        width,
        height,
      },
      onChange: {
        width: setWidth,
        height: setHeight,
      },
      validation: {
        width: (val: string) => {
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
          toast.error(t('高度不能超过1500且宽度不能超过5000'));
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
          style={{
            width: width * scale,
            height: height * scale,
            background: '#0fd7d7',
            marginTop: ((divSize?.height || 0) - height * scale) / 2,
            position: 'relative',
          }}
        >
          {props.showMarks && !!scale && (
            <RectAnnotation {...props} {...{ width, height }} handleSizeArea={handleSizeArea}></RectAnnotation>
          )}
        </div>
      </div>
      {props?.showMarks && <ParamsSetting propsState={propsState} setPropsState={setPropsState}></ParamsSetting>}
    </div>
  );
});

export default memo(Rect);
