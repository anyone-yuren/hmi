import { DoubleRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { App, Button, Skeleton, Tooltip } from 'antd';
import { useTheme } from 'antd-style';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { maintenance } from '../services';
interface SensorProps {
  loading: boolean;
  data: any;
  reload: () => void;
}
const Sensor = (props: SensorProps) => {
  const { modal } = App.useApp();
  const { loading, data, reload } = props;
  const { t, i18n } = useTranslation();
  const { run: maintain } = useRequest(maintenance, {
    manual: true,
    onSuccess: () => {
      reload();
    },
  });
  const { token } = useGlobalStore(
    useShallow((state) => ({
      token: state.token,
    })),
  );
  const STATUS = [t('common.normal'), t('common.triggered'), t('common.severelyExpired')];
  const theme = useTheme();
  const percentage = (data?.Current?.Time ?? 0) / (data?.Condition?.Time ?? 0);
  const COLORS = [theme.colorSuccessText, theme.colorWarningText, theme.colorErrorText];
  return (
    <div className='relative w-full h-full rounded-3xl bg-white/10 border border-white/25  overflow-hidden'>
      <Tooltip
        title={
          <>
            <div className='text-md font-bold'>{t('common.maintenance.condition')}：</div>
            <div>
              {t('common.maintenance.duration')}：{data?.Condition?.Time ?? '-'} {t('common.maintenance.day')}
            </div>
          </>
        }
      >
        <QuestionCircleOutlined
          className='absolute top-4 right-4 z-20'
          style={{
            fontSize: 20,
          }}
        />
      </Tooltip>
      {/* 顶部高光 */}
      <div className='pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-[#00a0a6]/100 to-transparent'></div>

      {/* 内容 */}
      <div
        className={classnames(
          {
            '!p-4': i18n.language !== 'zh_CN',
          },
          'relative z-10 h-full p-8 flex flex-col justify-between',
        )}
      >
        <div className='flex flex-col w-full items-center  gap-2'>
          <SvgIcon name='radar' size={120} />
          <h3 className='text-xl xl:text-3xl font-semibold tracking-tight'>{t('common.maintenance.sensor')}</h3>
          <p className='mt-2 text-white/80 max-w-xl'>{t('common.maintenance.sensorDesc')}</p>
        </div>
        <div className='flex flex-col w-full items-end justify-center gap-2'>
          <div className='flex  flex-col items-end'>
            <h4 className='text-xs'>{t('common.maintenance.status')}</h4>
            {!loading ? (
              <p className='text-lg font-bold' style={{ color: COLORS[data?.Status ?? 0] }}>
                {STATUS[data?.Status ?? 0]}
              </p>
            ) : (
              <Skeleton.Button active size='small' />
            )}
          </div>

          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>{t('common.maintenance.maintainTimes')}</h4>
            {!loading ? (
              <p className='text-lg font-bold'>
                {data?.AlreadyMaintainTimes ?? '-'} {t('common.maintenance.times')}
              </p>
            ) : (
              <Skeleton.Button active size='small' />
            )}
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>{t('common.maintenance.lastMaintainTime')}</h4>
            {!loading ? (
              <p className='text-lg font-bold'>{data?.History?.[data?.History?.length - 1]?.Date ?? '-'}</p>
            ) : (
              <Skeleton.Button active size='small' />
            )}
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>{t('common.maintenance.nextMaintainTime')}</h4>
            {!loading ? (
              <p className='text-lg font-bold'>{data?.Next?.Date ?? '-'}</p>
            ) : (
              <Skeleton.Button active size='small' />
            )}
          </div>
          <div className='flex flex-col items-end w-full'>
            <h4 className='text-md'>{t('common.maintenance.progress')}</h4>
            <div className='w-1/2'>
              {!loading ? (
                <div className='flex w-full items-center gap-2'>
                  <span>{data?.Current?.Time ?? '-'}</span>
                  <div className='flex-1 h-1 bg-white/20 rounded-[2px]'>
                    <div
                      className='h-full bg-white rounded-full'
                      style={{ width: `${(percentage > 1 ? 1 : percentage) * 100}%` }}
                    ></div>
                  </div>
                  <span>{data?.Condition?.Time ?? '-'}</span>
                </div>
              ) : (
                <Skeleton.Button active className='!w-full' size='small' />
              )}
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs font-bold cursor-pointer'>
              {t('common.maintenance.maintain')} <DoubleRightOutlined />
            </h4>
          </div>
        </div>

        <div className='flex gap-3 justify-end'>
          {(token === 'admin' || true) && (
            <Button
              disabled={loading || !data?.Next}
              size='large'
              className='px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition border !border-white/30 backdrop-blur-md'
              onClick={() => {
                modal.confirm({
                  content: t('common.maintenance.confirm'),
                  okText: t('common.confirm'),
                  okType: 'primary',
                  onOk: () => {
                    maintain({ subsystem: 0 });
                  },
                });
              }}
            >
              {t('common.maintenance.ok')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sensor;
