import { TextField } from '@mui/material';
import { useGetState, useSize } from 'ahooks';
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import MwConfirm from '../../MwConfirm';
import InputWidthKeyboard from '../../inputWithKeyboard';
import ParamsSetting from '../paramsSetting/setting';
import ShelfAnnotation from './shelfAnnotation';

const Shelf = forwardRef((props: any, ref) => {
  const [propsState, setPropsState] = useState<any>({});

  const [, setInput, getInput] = useGetState();
  const divRef = useRef(null);
  const divSize = useSize(divRef);
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    getParams: () => {
      return { ...propsState };
    },
  }));

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  const handleSizeArea = (key: string) => {
    const configHashMap: any = {
      title: {
        storage_width: t('deployer.vision.width'),
        goods_width: t('deployer.vision.goodsWidth'),
      },
      value: {
        storage_width: propsState.storage_width,
        goods_width: propsState.goods_width,
      },
      onChange: {
        storage_width: (value: any) => {
          setPropsState({
            ...propsState,
            storage_width: Number(value),
          });
        },
        goods_width: (value: any) => {
          setPropsState({
            ...propsState,
            goods_width: Number(value),
          });
        },
      },
      validation: {
        storage_width: (val: string) => {
          const { goods_nums, goods_width } = propsState;
          const gap = (Number(val) - goods_nums * goods_width) / (goods_nums + 1);
          if (gap <= 0) {
            toast.error(t('deployer.vision.goodsMaxWidthTips'));
            return true;
          }
          return false;
        },
        goods_width: (val: string) => {
          const { storage_width, goods_nums } = propsState;
          const gap = (storage_width - goods_nums * Number(val)) / (goods_nums + 1);
          if (gap <= 0) {
            toast.error(t('deployer.vision.goodsMaxWidthTips'));
            return true;
          }
          return false;
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
          return Promise.reject();
        }
        configHashMap.onChange[key] && configHashMap.onChange[key](val);
      },
    });
  };

  useEffect(() => {
    props = JSON.parse(JSON.stringify(props));
    setPropsState({
      ...props,
      id: props?.id,
      type: props?.type,
      name: props?.name,
      storage_width: props?.storage_width,
      legs_height: props?.legs_height,
      legs_width: props?.legs_width,
      crossbeam_height: props?.crossbeam_height,
      goods_width: props?.goods_width,
      goods_nums: props?.goods_nums,
    });
  }, [props]);

  const goods = useMemo(() => {
    const ary = Array.from({ length: propsState.goods_nums }, (_, index) => index);
    const totalWidth = propsState.storage_width;
    const resetWidth = totalWidth - propsState.goods_nums * propsState.goods_width;

    return ary.map((item: any) => {
      return {
        width: propsState.goods_width,
        leftPosition:
          propsState.legs_width +
          item * propsState.goods_width +
          (item + 1) * (resetWidth / (propsState.goods_nums + 1)),
      };
    });
  }, [propsState.goods_width, propsState.goods_nums, propsState.legs_width, propsState.storage_width]);

  const drawSize = useMemo(() => {
    return {
      width: propsState.storage_width + 2 * propsState?.legs_width,
      height: propsState.legs_height + propsState.crossbeam_height,
    };
  }, [propsState]);

  const scale = useMemo(() => {
    if (!divSize?.width || !drawSize?.width) return 0;
    const obj = {
      width: divSize?.width / drawSize?.width,
      height: divSize?.height / drawSize?.height,
    };
    return Math.min(obj.width, obj.height) * 0.9;
  }, [drawSize, divSize]);

  return (
    <div className='flex flex-col w-full h-full'>
      <div ref={divRef} className='flex flex-1 w-full h-full justify-center'>
        <div
          className='absolute'
          style={{
            width: drawSize?.width * scale,
            height: drawSize?.height * scale,
            marginTop: (divSize?.height ?? 0 - drawSize?.height * scale) / 2 - (drawSize?.height * scale) / 2,
          }}
        >
          <div
            className='absolute left-0 bg-[#12d7d7]'
            style={{
              top: 0,
              width: propsState?.storage_width * scale + 2 * propsState?.legs_width * scale,
              height: propsState?.crossbeam_height * scale,
            }}
          ></div>
          {/* 写死两个腿 */}
          <div
            className='absolute left-0 bg-[#12d7d7]'
            style={{
              top: propsState?.crossbeam_height * scale,
              width: propsState?.legs_width * scale,
              height: propsState?.legs_height * scale,
            }}
          ></div>
          <div
            className='absolute right-0 bg-[#12d7d7]'
            style={{
              top: propsState?.crossbeam_height * scale,
              width: propsState?.legs_width * scale,
              height: propsState?.legs_height * scale,
            }}
          ></div>

          {goods?.map((good: any, index: number) => {
            return (
              <div
                key={'good' + index}
                className='absolute bg-[#e9be53]'
                style={{
                  bottom: 0,
                  width: propsState?.goods_width * scale,
                  height: propsState?.legs_height * 0.8 * scale,
                  left: good.leftPosition * scale,
                }}
              ></div>
            );
          })}
          {propsState?.showMarks && !!scale && (
            <ShelfAnnotation
              {...propsState}
              divSize={divSize}
              drawSize={drawSize}
              scale={scale}
              handleSizeArea={handleSizeArea}
            ></ShelfAnnotation>
          )}
        </div>
      </div>
      {propsState?.showMarks && <ParamsSetting propsState={propsState} setPropsState={setPropsState}></ParamsSetting>}
    </div>
  );
});

export default memo(Shelf);
