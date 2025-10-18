import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';

interface RenderStrategyTpyeProps {
  data: any;
  isDark: boolean;
  idStrategyEndPathCloseProtection: number;
  ioInputConfig: any;
  pcSensorList: any[];
}
const RenderStrategyTpye = (props: RenderStrategyTpyeProps) => {
  const { data, isDark, idStrategyEndPathCloseProtection, ioInputConfig, pcSensorList } = props;
  const { t, i18n } = useTranslation();
  const serviceLanguage = useMemo(() => {
    return i18n.language;
  }, [i18n.language]);

  const filterIoInput = (params: string[]) => {
    return ioInputConfig?.inputConfig?.filter((item: { key: string }) => params.includes(item.key));
  };
  const filterDevices = (params: string[]) => {
    return pcSensorList?.filter((item: { name: string }) => params.includes(item.name));
  };

  const renderPopupContent = useMemo(() => {
    if (!data) return null;
    const { name, ...strategyData } = data;
    switch (name) {
      case 'strategy_line_keep':
        return (
          <>
            <div className='text-xs text-gray-500'>舵角阈值: {strategyData?.steer_angle_tolerance}°</div>
          </>
        );
      case 'strategy_under_fork_protection':
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              保护范围: <span>{strategyData?.rectangle}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              开启当前策略的最小叉臂高度: <span>{strategyData?.min_forkarm_height_to_open_this}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              起始保护高度: <span>{strategyData?.height_start} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              需要屏蔽叉等上表面以下多少距离的空间: <span>{strategyData?.forkarm_height_cut} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              距离任务点小于多少距离后关闭这个策略:
              <span>{strategyData?.min_distance_to_task_point_close_this} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              所使用的传感器名字:
              <div className='fle flex-wrap gap-1'>
                {filterDevices(strategyData?.associated_sensor_list)?.map((item) => {
                  return <span key={item.key}>{serviceLanguage.includes('zh') ? item.ch_name : item.name} </span>;
                })}
              </div>
            </div>
          </div>
        );
      case 'strategy_place_cargo_space_protection':
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              开启当前策略的最小叉臂高度: <span>{strategyData?.min_forkarm_height_to_open_this} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              立体保护区域: <span>{strategyData?.cuboid}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              所使用的传感器名字:
              <div className='fle flex-wrap gap-1'>
                {filterDevices(strategyData?.associated_sensor_list)?.map((item) => {
                  return <span key={item.key}>{serviceLanguage.includes('zh') ? item.ch_name : item.name} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              距离任务点小于多少距离后开启这个策略: <span>{strategyData?.min_distance_to_task_point_open_this} mm</span>
            </div>
          </div>
        );
      case 'strategy_pick_cargo_fork_tip_protection':
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              立体保护区域: <span>{strategyData?.rectangles}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              所使用的传感器名字:
              <div className='fle flex-wrap gap-1'>
                {filterDevices(strategyData?.associated_sensor_list)?.map((item) => {
                  return <span key={item.key}>{serviceLanguage.includes('zh') ? item.ch_name : item.name} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              距离任务点小于多少距离后开启这个策略: <span>{strategyData?.min_distance_to_task_point_open_this} mm</span>
            </div>
          </div>
        );
      case 'strategy_end_path_adaptive_reduce_range':
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              前进最小保护距离: <span>{strategyData?.forward_min_protect_distance} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              后退最小保护距离: <span>{strategyData?.backward_min_protect_distance} mm</span>
            </div>
          </div>
        );
      case 'strategy_top_protection':
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              空载保护区域: <span>{strategyData?.empty_load_protect_cuboid}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              所使用的传感器名字:
              <div className='fle flex-wrap gap-1'>
                {filterDevices(strategyData?.associated_sensor_list)?.map((item) => {
                  return <span key={item.key}>{serviceLanguage.includes('zh') ? item.ch_name : item.name} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              满载保护区域: <span>{strategyData?.full_load_protect_cuboid} </span>
            </div>
          </div>
        );
      case 'strategy_door_frame_move_protection':
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              前酸保护距离: <span>{strategyData?.fork_forward_protect_distance} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              所使用的传感器名字:
              <div className='fle flex-wrap gap-1'>
                {filterIoInput(strategyData?.associated_io_sensor_list)?.map((item) => {
                  return <span key={item.key}>{item.value} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              横移保护距离: <span>{strategyData?.fork_lateral_move_protect_distance} mm</span>
            </div>
          </div>
        );
      case 'strategy_end_path_close_protection':
        return strategyData?.list?.length ? (
          strategyData.list.map((child, index) => (
            <div>
              <p>子策略 {child?.id}</p>
              <div
                className={`flex flex-col gap-1 mb-2 ${idStrategyEndPathCloseProtection === child?.id ? 'bg-black/5' : ''}`}
              >
                <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
                  屏蔽光电避障最大距离（取货）: <span>{child?.pick_cargo_pe_close_distance} mm</span>
                </div>
                <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
                  屏蔽光电避障最大距离（放货）: <span>{child?.place_cargo_pe_close_distance} mm</span>
                </div>
                <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
                  屏蔽点云避障最大距离（取货）: <span>{child?.pick_cargo_pc_close_distance} mm</span>
                </div>
                <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
                  屏蔽点云避障最大距离（放货）: <span>{child?.place_cargo_pc_close_distance} mm</span>
                </div>
                <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
                  所使用的点云传感器名字:
                  <div className='fle flex-wrap gap-1'>
                    {filterDevices(child?.associated_pc_sensor_list)?.map((item) => {
                      return <span key={item.key}>{serviceLanguage.includes('zh') ? item.ch_name : item.name} </span>;
                    })}
                  </div>
                </div>
                <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
                  所使用的IO信号名字:
                  <div className='fle flex-wrap gap-1'>
                    {filterIoInput(child?.associated_io_sensor_list)?.map((item) => {
                      return <span key={item.key}>{item.value} </span>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className={`group w-full h-20 py-4 cursor-pointer rounded-lg flex flex-row items-center justify-center ${!isDark ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]' : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_0%)]'}
          backdrop-blur-[6px] hover:shadow-lg animation-all duration-300`}
          >
            <SvgIcon
              className='group-hover:scale-110 animation-all duration-300'
              name='servicerror'
              size={80}
            ></SvgIcon>
            <p className='opacity-60 text-xs'>暂无数据</p>
          </div>
        );

      case 'strategy_amr_load_protection':
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              料架腿直径: <span>{strategyData?.rack_leg_diameter} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              AMR最小高度: <span>{strategyData?.amr_height} mm</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [data]);
  return <div>{renderPopupContent}</div>;
};

export default RenderStrategyTpye;
