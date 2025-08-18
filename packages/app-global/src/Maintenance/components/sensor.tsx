import { DoubleRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Skeleton, Tooltip } from 'antd';
import { useTheme } from 'antd-style';
import { SvgIcon } from 'ui';
interface SensorProps {
  loading: boolean;
}
const Sensor = (props: SensorProps) => {
  const { loading } = props;
  const theme = useTheme();
  return (
    <div className='relative w-full h-full rounded-3xl bg-white/10 border border-white/25  overflow-hidden'>
      <Tooltip
        title={
          <>
            <div className='text-md font-bold'>维保条件：</div>
            <div>时长：180天</div>
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
      <div className='relative z-10 h-full p-8 flex flex-col justify-between'>
        <div className='flex flex-col w-full items-center  gap-2'>
          <SvgIcon name='radar' size={120} />
          <h3 className='text-xl xl:text-3xl font-semibold tracking-tight'>电控与传感器系统</h3>
          <p className='mt-2 text-white/80 max-w-xl'>
            驱动 / 电源 /
            通信模块及安全控制，负责决策与执行；传感器含导航、避障及作业辅助类，实现环境感知，二者协同保障运行。
          </p>
        </div>
        <div className='flex flex-col w-full items-end justify-center gap-2'>
          <div className='flex  flex-col items-end'>
            <h4 className='text-xs'>维保状态</h4>
            {!loading ? (
              <p className='text-lg font-bold' style={{ color: theme.colorSuccessText }}>
                正常
              </p>
            ) : (
              <Skeleton.Button active size='small' />
            )}
          </div>

          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>已维保次数</h4>
            {!loading ? <p className='text-lg font-bold'>2次</p> : <Skeleton.Button active size='small' />}
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>上次维保时间</h4>
            {!loading ? <p className='text-lg font-bold'>2025-01-01</p> : <Skeleton.Button active size='small' />}
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>下次维保时间</h4>
            {!loading ? <p className='text-lg font-bold'>2025-07-01</p> : <Skeleton.Button active size='small' />}
          </div>
          <div className='flex flex-col items-end w-full'>
            <h4 className='text-md'>当前进度</h4>
            <div className='w-1/2'>
              {!loading ? (
                <div className='flex w-full items-center gap-2'>
                  <span>0</span>
                  <div className='flex-1 h-1 bg-white/20 rounded-[2px]'>
                    <div className='w-1/2 h-full bg-white rounded-full'></div>
                  </div>
                  <span>180</span>
                </div>
              ) : (
                <Skeleton.Button active className='!w-full' size='small' />
              )}
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs font-bold cursor-pointer'>
              更多信息 <DoubleRightOutlined />
            </h4>
          </div>
        </div>

        <div className='flex gap-3 justify-end'>
          <Button
            disabled={loading}
            size='large'
            className='px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition border border-white/30 backdrop-blur-md'
          >
            维保
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sensor;
