import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useRequest, useSize } from 'ahooks';
import { Space } from 'antd';
import { t } from 'i18next';
import { deleteModel, getModelList } from '../../services/index';
import { translateFnHashMap } from '../../utils/index';
import MwConfirm from '../MwConfirm';
import ListDesc from './listDesc';
import Concentric from './models/concentric';
import Cylinder from './models/cylinder';
import NinePallet from './models/ninePallet';
import Pallet from './models/pallet';
import Rect from './models/rect';
import Shelf from './models/shelf';
import Truck from './models/truck';

const ModelList = forwardRef((props: any, ref: any) => {
  const [list, setList] = useState([]);
  const [countConfig, setCountConfig] = useState<any>({});
  const listRef = useRef<any>();
  const listSize = useSize(listRef);

  const { data: containerList, run: runGetModelList } = useRequest(getModelList, {});

  useImperativeHandle(ref, () => ({
    getCountHashMap: () => {
      return countConfig;
    },
    reGetList: () => {
      runGetModelList();
    },
  }));

  const containerHashMap: any = {
    pallet: (container: any) => {
      return <Pallet {...container} />;
    },
    cage: (container: any) => {
      return <Pallet {...container} />;
    },
    rect: (container: any) => {
      return <Rect {...container} />;
    },
    concentric: (container: any) => {
      return <Concentric {...container} />;
    },
    cylinder: (container: any) => {
      return <Cylinder {...container} />;
    },
    'nine-corner-pallet': (container: any) => {
      return <NinePallet {...container} />;
    },
    warehouse_shelves: (container: any) => {
      return <Shelf {...container} />;
    },
    tail_truck: (container: any) => {
      return <Truck {...container} />;
    },
  };
  useEffect(() => {
    if (!containerList?.data) {
      return;
    }
    const obj: any = {};
    const countObj: any = {};
    const ary: any = [...containerList?.data];
    for (let index = 0; index < ary.length; index++) {
      if (!Object.keys(ary[index]).length) {
        return;
      }
      const type = ary[index].type;
      const nameAry = ary[index].name.split('_');
      const no = nameAry[nameAry.length - 1];

      if (!obj[type]) {
        obj[type] = [Number(no)];
      } else {
        obj[type].push(Number(no));
      }
      if (translateFnHashMap?.[type]) {
        ary[index] = translateFnHashMap?.[type](ary[index]);
      }
    }
    Object.keys(obj).forEach((key: string) => {
      countObj[key] = Math.max(...(obj[key] as any));
    });
    setCountConfig(countObj);
    setList(ary);
  }, [containerList]);

  return list.length ? (
    <div ref={listRef} className='flex gap-[20px] flex-wrap'>
      {list?.map((container: any) => {
        return (
          <Card
            key={container.id}
            sx={{
              background: '#d8d8d833',
              width: `${(listSize?.width ?? 0) / 2 - 10}px`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent
              sx={{ display: 'flex', flex: 1 }}
              onClick={() => {
                props?.handleItems && props?.handleItems(container);
              }}
            >
              <div className='w-[200px] h-[100px] relative'>
                {containerHashMap[container.type] && containerHashMap[container.type](container)}
              </div>
              <ListDesc {...container}></ListDesc>
            </CardContent>
            <CardActions
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              {container?.type != 'tail_truck' ? (
                <div className='pl-[20px]'>
                  <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, margin: 0 }}>
                    {t('deployer.vision.extraDepthCompensation')}: {container?.extra_deep_compensation}
                  </Typography>
                  <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, margin: 0 }}>
                    {t('deployer.vision.forkExtendParams')}: {container?.forkarm_final_width}
                  </Typography>
                  <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, margin: 0 }}>
                    {t('deployer.vision.targetStorage')}: {container?.storage_list?.join(',') || '-'}
                  </Typography>
                </div>
              ) : (
                <div></div>
              )}
              <Space>
                <Button
                  color='error'
                  size='small'
                  variant={'outlined'}
                  onClick={() => {
                    MwConfirm.confirm({
                      title: t('deployer.vision.deleteTips') as string,
                      content: (
                        <>
                          <div style={{ textAlign: 'center' }}>{t('deployer.vision.deleteTipsContent')}?</div>
                        </>
                      ),
                      onOk: async () => {
                        const params = { id: container.id };
                        const response = await deleteModel(params);
                        runGetModelList();
                      },
                    });
                  }}
                >
                  {t('common.delete')}
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  sx={{ color: 'white' }}
                  onClick={() => {
                    props?.handleItems && props?.handleItems(container);
                  }}
                >
                  {t('common.edit')}
                </Button>
              </Space>
            </CardActions>
          </Card>
        );
      })}
    </div>
  ) : (
    <div className='text-center'>{t('common.noData')}</div>
  );
});

export default memo(ModelList);
