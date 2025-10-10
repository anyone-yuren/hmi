import {
  CaretRightOutlined,
  ClockCircleOutlined,
  DoubleRightOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { useGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { App, Button, Popconfirm, Skeleton, Tooltip } from 'antd';
import { useTheme } from 'antd-style';
import classnames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { getMotorWorkingTime, maintenance } from '../services';
interface Props {
  loading: boolean;
  data: any;
  reload: () => void;
}
const Lifting = ({ loading, data, reload }: Props) => {
  const { t, i18n } = useTranslation();
  const { token } = useGlobalStore(
    useShallow((state) => ({
      token: state.token,
    })),
  );
  const { modal } = App.useApp();
  const { run: maintain } = useRequest(maintenance, {
    manual: true,
    onSuccess: () => {
      reload();
    },
  });
  const { data: workingData, loading: workingLoading } = useRequest(getMotorWorkingTime);
  const STATUS = [t('common.normal'), t('common.triggered'), t('common.severelyExpired')];
  const theme = useTheme();
  const [expendAll, setExpendAll] = useState(false);

  const datePercentage = (data?.Current?.Time ?? 282) / (data?.Condition?.Time ?? 180);
  const workingPercentage = (data?.Current?.WorkingTime ?? 70) / (data?.Condition?.Miles ?? 1000);
  const COLORS = [theme.colorSuccessText, theme.colorWarningText, theme.colorErrorText];
  return (
    <div className='relative w-full h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 shadow-[0_25px_80px_-25px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.35)] overflow-hidden'>
      <Tooltip
        title={
          <>
            <div className='text-md font-bold'>{t('common.maintenance.condition')}：</div>
            <div>
              {t('common.maintenance.duration')}：{data?.Condition?.Time ?? '-'} {t('common.maintenance.day')}
            </div>
            <div>
              {t('common.maintenance.workingTime')}：{data?.Condition?.WorkingTime ?? '-'} Min
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
      <div className='pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-[#d763b7]/100 to-[#462580]'></div>
      {/* 内容 */}
      <div
        className={classnames(
          {
            '!p-4': i18n.language !== 'zh_CN',
          },
          'relative z-10 h-full p-8 flex flex-col justify-between',
        )}
      >
        <div className='flex flex-col w-full items-center justify-center gap-2'>
          <SvgIcon name='left' size={120} />
          <h3 className='text-xl xl:text-3xl font-semibold tracking-tight'>{t('common.maintenance.lifting')}</h3>
          <p className='mt-2 text-white/80 max-w-xl'>{t('common.maintenance.liftingDesc')}</p>
        </div>
        <div className='flex flex-col w-full items-end justify-center gap-2 overflow-y-auto'>
          <div className='flex  flex-col items-end'>
            <h4 className='text-xs'>{t('common.maintenance.status')}</h4>
            {!loading ? (
              <p className='text-lg font-bold' style={{ color: COLORS[data?.Status ?? 2] }}>
                {STATUS[data?.Status ?? 2]}
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
              data?.History?.[data?.History?.length - 1]?.Date &&
              data?.History?.[data?.History?.length - 1]?.WorkingTime !== undefined ? (
                <div
                  className={`p-2 rounded-md bg-gradient-to-br from-white/20 to-white/5 flex ${expendAll ? 'items-start' : 'items-center'} gap-2`}
                  onClick={() => {
                    setExpendAll(!expendAll);
                  }}
                >
                  <div className={`flex flex-col gap-2`}>
                    {data?.History?.filter((_, index) => expendAll || index === data.History.length - 1)?.map(
                      (item: any, index: number) => {
                        return (
                          <div key={'history' + index} className='flex gap-2'>
                            <div className='text-xs flex items-center gap-1'>
                              <ScheduleOutlined />
                              {item?.Date ?? '-'}
                            </div>
                            <div className='text-xs flex items-center gap-1'>
                              <ClockCircleOutlined />
                              {t('common.maintenance.workingTime')} {item?.WorkingTime ?? '-'}
                              {t('common.maintenance.minute')}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                  {data?.History?.length > 1 && (
                    <div>
                      <CaretRightOutlined rotate={expendAll ? 90 : 180} />
                    </div>
                  )}
                </div>
              ) : (
                <p className='text-lg font-bold'>-</p>
              )
            ) : (
              <Skeleton.Button active size='small' className='!w-36' />
            )}
          </div>
          <div className='flex flex-col items-end'>
            <Tooltip placement='topRight' title={t('common.maintenance.nextLiftMaintainTimeDesc')}>
              <h4 className='text-xs'>
                {t('common.maintenance.nextMaintainTime')} <InfoCircleOutlined />
              </h4>
            </Tooltip>
            {!loading ? (
              data?.Next?.Date && data?.Next?.WorkingTime ? (
                <div className='p-2 rounded-md bg-gradient-to-br from-white/20 to-white/5 flex items-center gap-2'>
                  <div className='text-xs flex items-center gap-1'>
                    <ScheduleOutlined />
                    {data?.Next?.Date ?? '-'}
                  </div>
                  <div className='text-xs flex items-center gap-1'>
                    <ClockCircleOutlined />
                    {t('common.maintenance.workingTime')} {data?.Next?.WorkingTime ?? '-'}
                    {t('common.maintenance.minute')}
                  </div>
                </div>
              ) : (
                <p className='text-lg font-bold'>-</p>
              )
            ) : (
              <Skeleton.Button active size='small' className='!w-36' />
            )}
          </div>
          <div className='flex flex-col items-end w-full'>
            <h4 className='text-md'>{t('common.maintenance.progress')}</h4>
            {!loading ? (
              <div className='flex gap-2 w-full'>
                <div className='flex flex-1 items-center gap-2'>
                  <ClockCircleOutlined />
                  <span>{data?.Current?.WorkingTime ?? '-'}</span>
                  <div className='flex-1 h-1 bg-white/20 rounded-[2px]'>
                    <div
                      className='h-full bg-white rounded-full'
                      style={{ width: `${(workingPercentage > 1 ? 1 : workingPercentage) * 100}%` }}
                    ></div>
                  </div>
                  <span>
                    {data?.Condition?.WorkingTime ?? '-'}
                    {t('common.maintenance.minute')}
                  </span>
                </div>
                <div className='flex flex-1 items-center gap-2'>
                  <ScheduleOutlined />
                  <span>{data?.Current?.Time ?? '-'}</span>
                  <div className='flex-1 h-1 bg-white/20 roundfed-[2px]'>
                    <div
                      className={
                        datePercentage < 1.5
                          ? 'h-full bg-white rounded-full bg-gradient-to-r from-white to-yellow-400'
                          : 'h-full bg-white rounded-full bg-gradient-to-r from-white to-red-400'
                      }
                      style={{ width: `${(datePercentage > 1 ? 1 : datePercentage) * 100}%` }}
                    ></div>
                  </div>
                  <span>
                    {data?.Condition?.Time ?? '-'}
                    {t('common.maintenance.day')}
                  </span>
                </div>
              </div>
            ) : (
              <Skeleton.Button active size='small' className='!w-full' />
            )}
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs font-bold cursor-pointer'>
              <Popconfirm
                placement='topRight'
                // title={'维保条件：时长：180天，行走公里数：1000公里'}
                title={
                  <>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold min-w-24 text-right'>{t('common.maintenance.workingTimes')}：</span>
                      {workingData?.data?.motor_working_times ?? '-'} {t('common.maintenance.times')}
                    </div>
                  </>
                }
              >
                {t('common.maintenance.maintain')} <DoubleRightOutlined />
              </Popconfirm>
            </h4>
          </div>
        </div>
        {token === 'admin' && (
          <div className='flex gap-3 justify-end'>
            <Button
              // disabled={loading || !data?.next}
              disabled={loading}
              size='large'
              className='px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition border !border-white/30 backdrop-blur-md'
              onClick={() => {
                modal.confirm({
                  content: t('common.maintenance.confirm'),
                  okText: t('common.confirm'),
                  onOk: () => {
                    maintain({
                      subsystem: 2,
                    });
                  },
                });
              }}
            >
              {t('common.maintenance.ok')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Lifting;
