import { TextField } from '@mui/material';
import { useGetState, useSize } from 'ahooks';
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import MwConfirm from '../../MwConfirm';
import InputWidthKeyboard from '../../inputWithKeyboard';
import NinePalletAnnotation from './ninePalletAnnotation';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import ParamsSetting from '../paramsSetting/setting';

const NinePallet = forwardRef((props: any, ref: any) => {
  const [propsState, setPropsState] = useState<any>({});
  const [, setInput, getInput] = useGetState();
  const divRef = useRef(null);
  const divSize = useSize(divRef);
  const { t } = useTranslation();
  const drawSize = useMemo(() => {
    return {
      width: propsState.width,
      height: propsState.height + propsState.legsMaxHeight + propsState.handlesMaxHeight,
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

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  useImperativeHandle(ref, () => ({
    getParams: () => {
      return { ...propsState };
    },
  }));

  useEffect(() => {
    props = JSON.parse(JSON.stringify(props));
    setPropsState({
      ...props,
      id: props?.id,
      type: props?.type,
      name: props?.name,
      width: props?.width,
      height: props?.height,
      legsMaxHeight: props?.legsMaxHeight,
      handlesMaxHeight: props?.handlesMaxHeight,
      handles: props?.handles,
      showMarks: props?.showMarks,
      legs: props?.legs,
      legForkInWidth: props?.legForkInWidth,
      totalHeight: props?.height + props?.legsMaxHeight + props?.handlesMaxHeight,
    });
  }, [props]);

  const configHashMap: any = {
    title: {
      width: t('deployer.vision.palletWidth'),
      totalHeight: t('deployer.vision.palletHeight'),
      legsMaxHeight: t('deployer.vision.legHeight'),
      legs: t('deployer.vision.legWidth'),
      legForkInWidth: t('deployer.vision.forkWidth'),
      handlesMaxHeight: t('deployer.vision.handleHeight'),
    },
    onChange: {
      totalHeight: (val: string) => {
        setPropsState({
          ...propsState,
          height: Number(val) - propsState.legsMaxHeight - propsState.handlesMaxHeight,
          totalHeight: Number(val),
        });
      },
      legsMaxHeight: (val: string) => {
        setPropsState({
          ...propsState,
          legs: propsState?.legs?.map((leg: any) => {
            const newLeg = { ...leg };
            newLeg.height = Number(val);
            return newLeg;
          }),
          legsMaxHeight: Number(val),
          totalHeight: propsState.height + Number(val) + props.handlesMaxHeight,
        });
      },
      handlesMaxHeight: (val: string) => {
        setPropsState({
          ...propsState,
          handles: propsState?.handles?.map((leg: any) => {
            const newLeg = { ...leg };
            newLeg.height = Number(val);
            return newLeg;
          }),
          handlesMaxHeight: Number(val),
          totalHeight: propsState.height + Number(val) + props.legsMaxHeight,
        });
      },
    },
    validation: {
      totalHeight: (val: string) => {
        return Number(val) > 1500;
      },
      legsMaxHeight: (val: string) => {
        return propsState.height + Number(val) + props.handlesMaxHeight > 1500;
      },
      handlesMaxHeight: (val: string) => {
        return propsState.height + Number(val) + props.legsMaxHeight > 1500;
      },
    },
  };

  const handleSizeArea = (key: string, index?: number, indexKey?: string) => {
    const val = (!!index || index === 0) && indexKey ? propsState?.[key]?.[index]?.[indexKey] : propsState?.[key];

    setInput(val);

    MwConfirm.confirm({
      title: configHashMap.title[key] || '-',
      content: (
        <>
          {isMultiwayAgv ? (
            <InputWidthKeyboard
              input={val.toString()}
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
              defaultValue={val}
              onChange={(event: any) => {
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
        if ((!!index || index === 0) && indexKey) {
          const obj = { ...propsState };
          if (key === 'legs') {
            if (indexKey === 'bottomWidth') {
              obj.legs[index][indexKey] = Number(val);
              const newObj = { ...obj };
              setPropsState(newObj);
              return;
            } else {
              obj.legs[index][indexKey] = Number(val);
            }
          }
          if (key === 'legForkInWidth') {
            obj.legForkInWidth[index][indexKey] = Number(val);
          }
          const newObj = reGetPosition(obj);
          if (newObj?.width > 5000 || newObj?.totalHeight > 1500) {
            toast.error(t('deployer.vision.basicSizeValidateTips'));
            return Promise.reject();
          }
          setPropsState(newObj);
          return;
        }
        if (key === 'totalHeight' && Number(val) < propsState.legsMaxHeight) {
          toast.error(t('deployer.vision.basicHeightValidateTips'));
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

  const reGetPosition = (container: any) => {
    const obj = { ...container };
    const legForkInWidthTotal = obj?.legForkInWidth?.reduce((acc: any, obj: any) => acc + obj.width, 0);
    const legsWidthTotal = obj?.legs?.reduce((acc: any, obj: any) => acc + obj.topWidth, 0);

    obj.width = legForkInWidthTotal + legsWidthTotal;
    // 重新计算legs的位置
    let leftPositionCount = 0;
    obj.legs = obj?.legs?.map((leg: any, index: number) => {
      const newLeg = { ...leg };
      if (!index) {
        newLeg.leftPosition = 0;
      } else {
        newLeg.leftPosition = leftPositionCount + obj?.legs[index - 1]?.topWidth + obj?.legForkInWidth[index - 1].width;
        leftPositionCount = newLeg.leftPosition;
      }
      return newLeg;
    });
    for (let index = 0; index < obj.legs.length; index++) {
      if (index > 0) {
        obj.legForkInWidth[index - 1].leftPosition = obj?.legs[index - 1].leftPosition + obj?.legs[index - 1].topWidth;
      }
    }
    return obj;
  };

  // 宽度改变等比加
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
          {propsState?.handles?.map((h: any, index: number) => {
            return (
              <div
                key={'handle' + index}
                className='absolute top-[0] bg-[#12d7d7]'
                style={{
                  left: h.leftPosition * scale,
                  width: h?.width * scale,
                  height: h?.height * scale,
                }}
              ></div>
            );
          })}
          {/* 中间的板子 */}
          <div
            className='absolute left-0 bg-[#12d7d7]'
            style={{
              top: propsState.handlesMaxHeight * scale,
              width: propsState?.width * scale,
              height: propsState?.height * scale,
            }}
          ></div>
          {/* 下面的角 */}
          {propsState?.legs?.map((l: any, index: number) => {
            return (
              <div
                key={'leg' + index}
                className='absolute bg-[#12d7d7]'
                style={{
                  width: l?.topWidth * scale,
                  height: l?.height * scale,
                  top: propsState.handlesMaxHeight * scale + propsState?.height * scale,
                  left: l?.leftPosition * scale,
                  clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
                }}
              ></div>
            );
          })}
          {/* 这里是标注组件 */}
          {propsState?.showMarks && !!scale && (
            <NinePalletAnnotation
              {...propsState}
              divSize={divSize}
              scale={scale}
              handleSizeArea={handleSizeArea}
            ></NinePalletAnnotation>
          )}
        </div>
      </div>
      {propsState?.showMarks && <ParamsSetting propsState={propsState} setPropsState={setPropsState}></ParamsSetting>}
    </div>
  );
});

export default memo(NinePallet);
