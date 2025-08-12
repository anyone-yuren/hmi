import {
  AppstoreOutlined,
  ClockCircleOutlined,
  ColumnWidthOutlined,
  DotChartOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { useVehicleStore } from '@gbeata/store';
import { Divider, Stack } from '@mui/material';
import { useRequest } from 'ahooks';
import { Button, Modal, Result, Slider, Switch, Typography } from 'antd';
import { createStyles, ThemeProvider } from 'antd-style';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useAgvType } from '../hooks/useAgvType';
import AnimateBrush from './components/animateBrush';
import AnimateCharging from './components/animateCharging';
import { getPeripheralControlParam, postPeripheralControlParam } from './services';
const useStyles = createStyles(({ css }) => ({
  line: css`
    .ant-timeline-item-head {
      background: transparent !important;
    }
  `,
}));

// Vite环境下获取assets/vehicles目录下的所有图片
const imageModules = import.meta.glob('../assets/vehicles/*', { eager: true });

// 获取图片函数
const getImage = (imageName: string) => {
  return new URL(`../assets/vehicles/${imageName}`, import.meta.url).href;
};

const Charging = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [lowPower, setLowPower] = useState(false);
  const { setPowerStatus, powerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        setPowerStatus: state.setPowerStatus,
        powerStatus: state.powerStatus,
      };
    }),
  );
  const { t } = useTranslation();
  const {
    run,
    loading,
    data: serviceControlParam,
  } = useRequest(getPeripheralControlParam, {
    manual: true,
  });

  const postRun = useRequest(postPeripheralControlParam, {
    manual: true,
  });
  // 有无任务
  const [hasTask, setHasTask] = useState(false);
  const stationItems = () => {
    return {
      children: (
        <motion.div
          className='shadow-custom-box bg-[#22d3ee]/40 p-2 rounded-md shadow-[#22d3ee]/40 relative overflow-hidden'
          animate={{
            boxShadow: [
              '0 0 0px rgba(34,211,238, 0.3)',
              '0 0 30px rgba(34,211,238, 0.5)',
              '0 0 0px rgba(34,211,238, 0.3)',
            ],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className='text-sm'>发送充电信号</div>
          <div className='text-sm'>2025-09-01 10:00:00</div>
        </motion.div>
      ),
      dot: <ClockCircleOutlined style={{ fontSize: '16px', color: '#22d3ee' }} />,
    };
  };
  const vehicleItems = () => {
    return {
      children: (
        <motion.div
          className='shadow-custom-box bg-yellow-200/80 p-2 rounded-md shadow-yellow-200/40 relative overflow-hidden'
          animate={{
            boxShadow: [
              '0 0 0px rgba(254,240,138, 0.3)',
              '0 0 30px rgba(254,240,138, 0.5)',
              '0 0 0px rgba(254,240,138, 0.3)',
            ],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className='text-sm'>准备充电信号</div>
          <div className='text-sm'>2025-09-01 10:00:00</div>
        </motion.div>
      ),
      dot: <ClockCircleOutlined style={{ fontSize: '16px', color: '#fef08a' }} />,
    };
  };
  const agvType = useAgvType();

  const [pdName, setPdName] = useState(`MW_${agvType}.png`);
  const productImage = useCallback(() => {
    return getImage(`${pdName}`);
  }, [pdName]);
  return (
    <div className='flex flex-row gap-4 p-4 h-full'>
      {/* 小车模块 */}
      <div className='relative h-full rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm flex flex-col w-1/3 gap-4'>
        <motion.div className='w-full h-full rounded-2xl backdrop-blur-2xl p-4 flex flex-col'>
          <div className='flex-1 relative'>
            <div className='w-full'>
              <h2 className='text-lg font-bold mb-1'>车辆电池</h2>
              <motion.div
                className='!w-full h-px'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div
                  className='w-full h-full'
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
                  }}
                />
              </motion.div>
            </div>
            {/* 车辆电池电压 */}
            <div className='flex flex-row gap-4 mt-4 text-yellow-200'>
              <div className='rounded-md flex flex-1 items-center flex-col p-4 shadow-md shadow-yellow-400/20 bg-white/10'>
                <SvgIcon name='volt' size={48} />
                <div className=''>22.8V</div>
              </div>
              <div className='rounded-md flex flex-1 items-center flex-col p-4 shadow-md shadow-yellow-400/20 bg-white/10'>
                <SvgIcon name='ampere' size={48} />
                <div className=''>22.8A</div>
              </div>
              <div className='rounded-md flex flex-1 items-center flex-col p-4 shadow-md shadow-yellow-400/20 bg-white/10'>
                <SvgIcon name='celsius' size={48} />
                <div className=''>22.8℃</div>
              </div>
            </div>
            <div className='mt-4 flex flex-col gap-4'>
              <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                <Typography.Text className='!m-0 font-bold '>上次充满时间</Typography.Text>
                <Typography.Text className='!m-0 opacity-70'>2023-01-01</Typography.Text>
              </div>
              <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>充电次数统计</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>32</Typography.Text>
                </div>
                <span className='text-xs text-white/50'>总充电次数包含已充满次数和异常次数</span>
              </div>
              <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>累计充电时常</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>23421 (min)</Typography.Text>
                </div>
              </div>
              {/* <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>行驶里程</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>24 (km)</Typography.Text>
                </div>
              </div> */}
              <div className='bg-white/10 rounded-md'>
                <div className=' p-2 flex justify-between '>
                  <Typography.Text className='!m-0 font-bold '>低电量报警</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>
                    <Switch
                      defaultChecked={lowPower}
                      onChange={(checked) => {
                        setLowPower(checked);
                      }}
                    />
                  </Typography.Text>
                </div>
                {lowPower && (
                  <div className='flex flex-row px-4'>
                    <ThemeProvider
                      theme={{
                        components: {
                          Slider: {
                            handleSize: 20, // 滑块直径
                            railSize: 12, // 轨道高度
                            handleSizeHover: 24,
                          },
                        },
                      }}
                    >
                      <Slider
                        defaultValue={serviceControlParam?.low_power}
                        className={`swiper-no-swiping w-full m-0`}
                        min={0}
                        max={100}
                        tooltip={
                          {
                            // open: true,
                          }
                        }
                        onChangeComplete={(value) => {
                          postRun.run({
                            volumn: value,
                          });
                        }}
                      />
                    </ThemeProvider>
                  </div>
                )}
              </div>
            </div>
            {/* 车辆图片与充电效果 */}
            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4'>
              <motion.img
                src={productImage()}
                initial={{ filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }}
                animate={
                  powerStatus.charge_status === 4
                    ? { filter: 'drop-shadow(0 10px 10px rgba(255,255,0,0.5))' }
                    : { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }
                }
                transition={
                  powerStatus.charge_status === 4
                    ? { duration: 1.6, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
                    : { duration: 0 }
                }
                className='w-full absolute bottom-4 '
              />
              {powerStatus.charge_status === 4 && <AnimateCharging />}
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='primary' onClick={() => {}}>
              充电记录
            </Button>
            <Button color='yellow' variant='solid'>
              异常记录
            </Button>
          </div>
        </motion.div>
      </div>
      {/* 电池模块 */}
      <div className='flex gap-4 items-center flex-1 '>
        {!hasTask ? (
          <div className='p-[2px] w-full h-full rounded-2xl bg-white/10 relative flex flex-col gap-2'>
            <div className='flex h-full items-center justify-between p-2  shadow-sm rounded-2xl'>
              <Result
                className='w-full flex flex-col items-center justify-center'
                status='success'
                title='没有充电任务'
                subTitle='是否立刻下发充电任务？'
                icon={<SvgIcon name='stationNodata' size={380} />}
                extra={
                  <Button
                    type='primary'
                    onClick={() => {
                      modal.confirm({
                        content: (
                          <div>
                            <div>1.请确认AGV已经移动到充电桩。</div>
                            <div>2.请确认充电桩已经上电。</div>
                          </div>
                        ),
                        okText: '确定',
                        cancelText: '取消',
                        onOk() {
                          setHasTask(true);
                        },
                        onCancel() {
                          console.log('Cancel');
                        },
                      });
                    }}
                  >
                    立即充电
                  </Button>
                }
              />
            </div>
          </div>
        ) : (
          <div className='h-full w-full flex flex-col gap-4'>
            <div className='p-4 flex flex-col gap-4 bg-white/10 rounded-2xl'>
              <h2 className='text-lg font-bold mb-0'>充电桩信息</h2>
              <div className='flex flex-row gap-4'>
                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='volt' size={32} />
                  <div className=''>22.8V</div>
                </div>
                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='ampere' size={32} />
                  <div className=''>22.8A</div>
                </div>
                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='celsius' size={32} />
                  <div className=''>22.8℃</div>
                </div>
              </div>
              <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>IP地址</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>192.168.1.1</Typography.Text>
                </div>
              </div>
              <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>状态</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>
                    {powerStatus.charge_status === 4 ? '充电中' : '未充电'}
                  </Typography.Text>
                </div>
                <span className='text-xs text-white/50'>总充电次数包含已充满次数和异常次数</span>
              </div>
              <div className='flex gap-2'>
                <Button
                  type='primary'
                  onClick={() => {
                    setPowerStatus({
                      power: 50,
                      charge_status: 4,
                    });
                  }}
                >
                  测试充电
                </Button>
                <Button
                  variant='solid'
                  color='red'
                  onClick={() => {
                    setPowerStatus({
                      power: 0,
                      charge_status: 0,
                    });
                  }}
                >
                  测试停止
                </Button>
              </div>
            </div>
            {/* 充电任务 */}
            <div className='flex flex-1  rounded-2xl bg-white/10 flex-col'>
              <div className='w-full'>
                <Stack
                  className='flex p-4 flex-1 items-center justify-between'
                  direction='row'
                  gap={4}
                  divider={<Divider orientation='vertical' flexItem />}
                >
                  <div className='flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center '>
                      <SnippetsOutlined />
                      任务号
                    </div>
                    <div className='text-sm opacity-70'>10002912</div>
                  </div>
                  <div className='flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center'>
                      <ColumnWidthOutlined />
                      位置偏差(mm)
                    </div>
                    <div className='text-sm opacity-70'>x:2300 y:2300 </div>
                  </div>
                  <div className='flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center'>
                      <AppstoreOutlined />
                      充电类型
                    </div>
                    <div className='text-sm opacity-70'>自动充电</div>
                  </div>
                  <div className='flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center'>
                      <DotChartOutlined />
                      目标电量
                    </div>
                    <div className='text-sm opacity-70'>99%</div>
                  </div>
                </Stack>
              </div>
              {/* 刷版动画 */}
              <AnimateBrush />
            </div>
          </div>
        )}
      </div>
      {contextHolder}
    </div>
  );
};

export default Charging;
