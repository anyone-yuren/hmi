import { TextField } from '@mui/material';
import { useGetState, useSize } from 'ahooks';
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import MwConfirm from '../../MwConfirm';
import InputWidthKeyboard from '../../inputWithKeyboard';
import './truck.css';

import Tips from '../../../components/settingPart/comp/tips';
import TextChangeRow from '../../settingPart/comp/textChangeRow';
import TextUpdateSwitchRow from '../../settingPart/comp/textUpdateSwitchRow';
import TruckAnnotation from './truckAnnotation';
const Cube = memo((props: any) => {
  const { width, title } = props;
  return (
    <div className='w-[80%] h-[40%] bg-[#00d1d1] relative'>
      {title && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[14px]'>
          {title}
        </div>
      )}
      <div
        className='h-full bg-[#09abab] absolute'
        style={{
          transformOrigin: 'left top',
          transform: 'skew(0deg, 330deg)',
          width: width * 0.17 + 'px',
          right: -width * 0.17 + 'px',
        }}
      ></div>
      <div
        className='w-full absolute left-0 bg-[#17efef]'
        style={{
          transformOrigin: 'left bottom',
          transform: 'skew(300deg, 0deg)',
          height: width * 0.1 + 'px',
          top: -width * 0.1 + 'px',
        }}
      ></div>
      {props.showMarks && (
        <TruckAnnotation widthText={100} heightText={100} lengthText={10000} realWidth={width * 0.17} {...props} />
      )}
    </div>
  );
});
const Square = memo((props: any) => {
  const { title, showMarks } = props;
  const [renderWidth, setRenderWidth] = useState(1);
  const squareRef = useRef(null);
  const size = useSize(squareRef);
  useEffect(() => {
    if (!size?.width || !size?.height) return;
    setRenderWidth(Math.min(size?.width, size?.height));
  }, [size]);

  return (
    <div ref={squareRef} className='w-full h-full '>
      <div className='relative bg-[#00d1d1]' style={{ width: `${renderWidth}px`, height: `${renderWidth}px` }}>
        {title && (
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[14px]'>
            {title}
          </div>
        )}
        <div
          className='h-full bg-[#09abab] absolute '
          style={{
            transformOrigin: 'left top',
            transform: 'skew(0deg, 330deg)',
            width: `${renderWidth / 2}px`,
            right: `${-renderWidth / 2}px`,
          }}
        ></div>
        <div
          className='w-full absolute left-[0%] bg-[#17efef]'
          style={{
            transformOrigin: 'left bottom',
            transform: 'skew(300deg, 0deg)',
            height: `${(renderWidth / 2) * 0.6}px`,
            top: `${(-renderWidth / 2) * 0.6}px`,
          }}
        ></div>
        {props.showMarks && <TruckAnnotation realWidth={renderWidth / 2} {...props} />}
      </div>
    </div>
  );
});
const Truck = forwardRef((props: any, ref) => {
  const [isMinx, setIsMinx] = useState(false);
  const [goodsCols, setGoodsCols] = useState(2);
  const [propsState, setPropsState] = useGetState<any>({
    truck_size: {
      height: 0,
      length: 0,
      width: 0,
    },
    goods_size: [
      {
        height: 0,
        length: 0,
        width: 0,
      },
      {
        height: 0,
        length: 0,
        width: 0,
      },
    ],
  });
  const [, setInput, getInput] = useGetState();
  const divRef = useRef(null);
  const divSize = useSize(divRef);

  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    getParams: () => {
      return {
        ...props,
        is_multiple_sizes: isMinx,
        goods_size: propsState?.goods_size,
        goods_cols: goodsCols,
        truck_size: propsState?.truck_size,
      };
    },
  }));

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  useEffect(() => {
    setPropsState({
      ...propsState,
      truck_size: props?.truck_size,
      goods_size: props?.goods_size,
    });
    if (props?.is_multiple_sizes) {
      setIsMinx(true);
    }
    if (props?.goods_cols) {
      setGoodsCols(props?.goods_cols);
    }
  }, [props]);

  const validation = (key: string, subKey: string, value: number) => {
    const obj = JSON.parse(JSON.stringify(propsState));
    const keyAry = key.split('/');
    let isValid = false;
    if (keyAry.length > 1) {
      obj[keyAry[0]][keyAry[1]][subKey] = value;
    } else {
      obj[keyAry[0]][subKey] = value;
    }
    const childHeight = Math.max(...obj.goods_size?.map((item: any) => item.height));

    if (obj?.truck_size?.height - 100 <= childHeight) {
      isValid = true;
    }
    if (isMinx) {
      const totalWidth = obj.goods_size?.reduce((sum: number, item: any) => {
        return sum + (item.width || 0);
      }, 0);
      if (obj.truck_size.width - 3 * 30 <= totalWidth) {
        isValid = true;
      }
    } else {
      if (obj.truck_size.width - 2 * 30 <= obj?.goods_size[0].width) {
        isValid = true;
      }
    }

    // 这里来计算校验规则
    return { newObj: obj, isValid };
  };

  const handleSizeArea = (key: string, subKey: string, title: string) => {
    let value: any = '';
    const keyAry = key.split('/');
    if (keyAry.length > 1) {
      value = propsState[keyAry[0]][keyAry[1]][subKey];
    } else {
      value = propsState[keyAry[0]][subKey];
    }
    setInput(value);

    MwConfirm.confirm({
      title,
      content: (
        <>
          {isMultiwayAgv ? (
            <InputWidthKeyboard
              input={value}
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
              defaultValue={!value ? '' : value}
              onChange={(event) => {
                setInput(event.target.value as any);
              }}
            ></TextField>
          )}
        </>
      ),
      onOk: async () => {
        const val: any = getInput();
        console.log('val', val);
        if (!/^\d+$/.test(val)) {
          toast.error(t('deployer.vision.plsInputNumber'));
          return Promise.reject();
        }
        const { isValid, newObj } = validation(key, subKey, Number(val));
        if (isValid) {
          toast.error(t('deployer.vision.truckloadValidateTips'));
          return Promise.reject();
        }
        setPropsState(newObj);
      },
    });
  };

  return (
    <div className='flex flex-col w-full h-full'>
      <div ref={divRef} className='flex flex-1 w-full h-full justify-center '>
        <div className='w-[40%] flex flex-col'>
          <div className='flex-1'>
            {props.showMarks && (
              <>
                <Tips>
                  <div>{t('deployer.vision.explanation')}:</div>
                  <div>{t('deployer.vision.truckloadValidateTips')}</div>
                </Tips>
                <TextUpdateSwitchRow title={t('deployer.vision.isMixing')} checked={isMinx} onChange={setIsMinx} />
                <TextChangeRow title={t('deployer.vision.goodsCols')} value={goodsCols} onChange={setGoodsCols as any}>
                  <div>{goodsCols}</div>
                </TextChangeRow>
              </>
            )}
          </div>
          <div className='flex-1 flex gap-[10px]'>
            <div className='w-1/2 flex items-center justify-center'>
              <div className='w-1/2 h-1/2'>
                <Square
                  title={props.showMarks ? t('deployer.vision.goods') + 'A' : null}
                  showMarks={props.showMarks}
                  updateKey={'goods_size/0'}
                  handleSizeArea={handleSizeArea}
                  widthText={propsState?.goods_size?.[0]?.width}
                  heightText={propsState?.goods_size?.[0]?.height}
                  lengthText={propsState?.goods_size?.[0]?.length}
                ></Square>
              </div>
            </div>
            {isMinx && (
              <div className='w-1/2 flex items-center justify-center'>
                <div className='w-1/2 h-1/2 '>
                  <Square
                    title={props.showMarks ? t('deployer.vision.goods') + 'B' : null}
                    showMarks={props.showMarks}
                    updateKey={'goods_size/1'}
                    handleSizeArea={handleSizeArea}
                    widthText={propsState?.goods_size?.[1]?.width}
                    heightText={propsState?.goods_size?.[1]?.height}
                    lengthText={propsState?.goods_size?.[1]?.length}
                  ></Square>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 这是分界线 */}
        <div className='flex-1 flex items-center pl-[10%]'>
          <Cube
            width={(divSize?.width || 2) / 2}
            title={props.showMarks ? t('deployer.vision.truckModel') : null}
            showMarks={props.showMarks}
            updateKey={'truck_size'}
            handleSizeArea={handleSizeArea}
            widthText={propsState?.truck_size?.width}
            heightText={propsState?.truck_size?.height}
            lengthText={propsState?.truck_size?.length}
          ></Cube>
        </div>
      </div>
    </div>
  );
});

export default memo(Truck);
