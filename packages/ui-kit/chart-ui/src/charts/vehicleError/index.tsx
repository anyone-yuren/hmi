import { Empty } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: any;
}

const VehicleError = (props: IProps) => {
  const { t } = useTranslation();
  const vehicleAbnormals = props?.data || [];
  // const vehicleAbnormals = [{ vehicleNum: 101, abnormalCode: 10086, description: '车辆交管' }] || props.data;
  React.useEffect(() => {}, []);
  const errorList = React.useMemo(() => {
    return vehicleAbnormals?.map((item: any) => {
      return {
        vehicleNum: item.vehicleNum,
        abnormalCode: item.abnormalCode,
        description: item.description,
      };
    });
  }, [vehicleAbnormals]);
  if (!errorList.length)
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  return (
    <>
      <div className='p-[10px] overflow-scroll text-[14px]' style={{ height: '100%' }}>
        <div
          className='title py-[3px] flex text-[#40e0f8] bg-[#0c2836]'
          style={{ borderBottom: '1px dashed #ffffff38' }}
        >
          {/* <div className=' w-[20px] flex-shrink-0'>{''}</div> */}
          <div className='pl-[5px] w-[40px] flex-shrink-0'>{t('车号')}</div>
          {/* <div className='px-[5px] w-[60px]'>{'故障码'}</div> */}
          <div className='flex justify-center flex-1'>{t('描述')}</div>
        </div>
        {errorList?.map((item, index) => {
          return (
            <div
              key={item.vehicleNum + index}
              className='py-[5px] flex text-[color]'
              style={{ borderBottom: '1px dashed #ffffff38' }}
            >
              {/* <div className=' w-[20px] flex-shrink-0'>
                <img className='w-full h-[full]' src={SE20} />
              </div> */}
              <div className='pl-[5px] w-[40px] flex-shrink-0'>{item.vehicleNum}</div>
              <div className='flex justify-center flex-1'>{item.description}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default VehicleError;
