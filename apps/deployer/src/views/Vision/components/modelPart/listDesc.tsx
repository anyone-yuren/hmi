import { Typography } from '@mui/material';
import { forwardRef, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const ListDesc = forwardRef((props: any, ref: any) => {
  const container = props;
  const { t } = useTranslation();
  const maxLegsHeight = useMemo(() => {
    if (!container?.legs?.length) return 0;
    return (
      Math?.max(
        ...container?.legs?.map((item: any) => {
          return item.height;
        }),
      ) || 0
    );
  }, [container]);
  const maxHandlesHeight = useMemo(() => {
    if (!container?.handles?.length) return 0;
    return (
      Math?.max(
        ...container?.handles?.map((item: any) => {
          return item.height;
        }),
      ) || 0
    );
  }, [container]);
  return (
    <div className='flex-1 min-h-[100px] overflow-overflow'>
      <Typography variant='h6' component='div'>
        {container.name}
      </Typography>
      <div className='flex flex-col'>
        {container?.diameter && container?.height && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.diameter')}/{t('deployer.vision.height')}: {container?.diameter}/{container?.height}
          </Typography>
        )}
        {container?.maxDiameter && container?.minDiameter && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.outDiameter')}/{t('deployer.vision.inDiameter')}: {container?.maxDiameter}/
            {container?.minDiameter}
          </Typography>
        )}
        {container?.width && container?.height && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.width')}/{t('deployer.vision.height')}: {container?.width}/
            {container?.height + maxLegsHeight + maxHandlesHeight}
          </Typography>
        )}
        {container?.legs?.length && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.legWidth')}:
            {container?.legs
              ?.map((leg: any) => {
                return leg?.width ?? leg?.topWidth ?? '-';
              })
              .join('/') ?? null}
          </Typography>
        )}
        {container?.legForkInWidth?.length ? (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.forkWidth')}:{' '}
            {container?.legForkInWidth
              ?.map((leg: any) => {
                return leg?.width;
              })
              .join('/')}
          </Typography>
        ) : null}
        {container?.goods_nums && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.goodsCount')}: {container?.goods_nums}
          </Typography>
        )}
        {container?.goods_width && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.goodsWidth')}: {container?.goods_width}
          </Typography>
        )}
        {container?.storage_width && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.shelfWidth')}: {container?.storage_width}
          </Typography>
        )}
        {container?.goods_cols && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.goodsCols')}: {container?.goods_cols}
          </Typography>
        )}
        {container?.truck_size && (
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('deployer.vision.truckListDesc')}: {container?.truck_size?.length}/{container?.truck_size?.width}/
            {container?.truck_size?.height}
          </Typography>
        )}
      </div>
    </div>
  );
});

export default memo(ListDesc);
