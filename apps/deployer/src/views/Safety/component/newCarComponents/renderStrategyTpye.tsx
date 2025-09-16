import { useMemo } from 'react';

interface RenderStrategyTpyeProps {
  data: any;
}
const RenderStrategyTpye = (props: RenderStrategyTpyeProps) => {
  const { data } = props;
  const renderPopupContent = useMemo(() => {
    if (!data) return null;
    const { id, data: strategyData } = data;
    switch (id) {
      case 1:
        return (
          <>
            <div className='text-xs text-gray-500'>舵轮打角判定阈值: {strategyData?.steer_angle_tolerance}°</div>
          </>
        );
      case 2:
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              叉臂下方保护区域: <span>{strategyData?.rectangle}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              叉臂下方保护启用高度阈值: <span>{strategyData?.min_forkarm_height_to_open_this}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              叉臂下方起始保护高度: <span>{strategyData?.height_start} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              叉臂下方裁剪高度: <span>{strategyData?.forkarm_height_cut} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              叉臂下方保护启用距离目标阈值: <span>{strategyData?.min_distance_to_task_point_close_this} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              关联传感器:
              <div className='fle flex-wrap gap-1'>
                {strategyData?.associated_sensor_list?.map((item) => {
                  return <span key={item}>{item} </span>;
                })}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              放货检测启用高度阈值: <span>{strategyData?.min_forkarm_height_to_open_this} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              保护区域长方体: <span>{strategyData?.cuboid}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              关联传感器:
              <div className='fle flex-wrap gap-1'>
                {strategyData?.associated_sensor_list?.map((item) => {
                  return <span key={item}>{item} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              放货检测启用距离目标阈值: <span>{strategyData?.min_distance_to_task_point_open_this} mm</span>
            </div>
          </div>
        );
      case 4:
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              保护区域: <span>{strategyData?.rectangle}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              关联传感器:
              <div className='fle flex-wrap gap-1'>
                {strategyData?.associated_sensor_list?.map((item) => {
                  return <span key={item}>{item} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              取货叉尖保护启用距离目标阈值: <span>{strategyData?.min_distance_to_task_point_open_this} mm</span>
            </div>
          </div>
        );
      case 5:
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              前进最小避障距离: <span>{strategyData?.forward_min_protect_distance} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              后退最小避障距离: <span>{strategyData?.backward_min_protect_distance} mm</span>
            </div>
          </div>
        );
      case 6:
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              空载防护区域: <span>{strategyData?.empty_load_protect_rectangle}</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              关联传感器:
              <div className='fle flex-wrap gap-1'>
                {strategyData?.associated_sensor_list?.map((item) => {
                  return <span key={item}>{item} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              负载防护区域: <span>{strategyData?.full_load_protect_rectangle} </span>
            </div>
          </div>
        );
      case 7:
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              叉臂前移超限屏蔽光电避障: <span>{strategyData?.empty_load_protect_rectangle} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              关联IO信号:
              <div className='fle flex-wrap gap-1'>
                {strategyData?.associated_io_sensor_list?.map((item) => {
                  return <span key={item}>{item} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              叉臂横移超限屏蔽光电避障: <span>{strategyData?.fork_lateral_move_protect_distance} mm</span>
            </div>
          </div>
        );
      case 8:
        return (
          <div className='flex flex-col gap-1'>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              屏蔽光电避障功能（取货）: <span>{strategyData?.pick_cargo_pe_close_distance} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              屏蔽光电避障功能（放货）: <span>{strategyData?.place_cargo_pe_close_distance} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              屏蔽点云避障功能（取货）: <span>{strategyData?.pick_cargo_pc_close_distance} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              屏蔽点云避障功能（放货）: <span>{strategyData?.place_cargo_pc_close_distance} mm</span>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              关联传感器:
              <div className='fle flex-wrap gap-1'>
                {strategyData?.associated_pc_sensor_list?.map((item) => {
                  return <span key={item}>{item} </span>;
                })}
              </div>
            </div>
            <div className='text-xs text-gray-500 flex items-center justify-between p-1 hover:bg-black/5 hover:shadow-md  animation-all duration-300'>
              关联IO信号:
              <div className='fle flex-wrap gap-1'>
                {strategyData?.associated_io_sensor_list?.map((item) => {
                  return <span key={item}>{item} </span>;
                })}
              </div>
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
