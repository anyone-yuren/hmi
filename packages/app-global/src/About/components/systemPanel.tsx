import { useRequest } from 'ahooks';
import { Button, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import noVehicleSvg from '../../assets/icons/noVehicle.svg';
import { useAgvType } from '../../hooks/useAgvType';
import { config_agv_info } from '../services';
import { useAboutStore } from '../store/about.store';

const SystemPanel = () => {
  const { t } = useTranslation();
  const { data: agvInfo } = useRequest(config_agv_info);
  const agvType = useAgvType();

  const { systemUsage } = useAboutStore(
    useShallow((state) => {
      return {
        systemUsage: state.systemUsage,
      };
    }),
  );

  const [pdName, setPdName] = useState(`MW_${agvType}.png`);
  const productImage = useCallback(() => {
    if (!agvType) {
      return noVehicleSvg;
    }
    return getImage(`${pdName}`);
  }, [pdName, agvType]);

  // Vite环境下获取assets/vehicles目录下的所有图片
  const imageModules = (import.meta as any).glob('../assets/vehicles/*', { eager: true });

  // 提取文件名
  const imageNames = Object.keys(imageModules)
    .map((path) => {
      const match = path.match(/vehicles\/(.*)$/);
      return match ? match[1] : '';
    })
    .filter(Boolean);

  // 获取图片函数
  const getImage = (imageName: string) => {
    return new URL(`../../assets/vehicles/${imageName}`, import.meta.url).href;
  };

  return (
    <>
      <div
        className='flex-1 flex flex-col gap-2  bg-no-repeat'
        style={{
          backgroundImage: `url(${productImage()})`,
          backgroundSize: agvType ? '100% auto' : '70% auto',
          backgroundPosition: 'center bottom',
        }}
      >
        <div></div>
        <div>
          <Typography.Title level={5} className='!m-0'>
            {t('common.about.serial')}
          </Typography.Title>
          <Typography.Text className='!m-0 opacity-70'>{agvInfo?.serial_number || '-'}</Typography.Text>
        </div>
        <div>
          <Typography.Title level={5} className='!m-0'>
            {t('common.about.date')}
          </Typography.Title>
          <Typography.Text className='!m-0 opacity-70'>{agvInfo?.manufacture_date || '-'}</Typography.Text>
        </div>
        <div>
          <Typography.Title level={5} className='!m-0'>
            {t('common.about.vehicleType')}
          </Typography.Title>
          <Typography.Text
            onClick={() => {
              // 生成0到imageNames长度-1之间的随机整数
              const randomIndex = Math.floor(Math.random() * imageNames.length);
              // 设置随机选中的图片名称
              setPdName(imageNames[randomIndex]);
            }}
            className='!m-0 opacity-70'
          >
            {agvType ? agvType : t('common.about.unknown')}
          </Typography.Text>
        </div>
        {
          <div>
            <Typography.Title level={5} className='!m-0'>
              {t('common.about.memory')}
            </Typography.Title>
            <Typography.Text className='!m-0 opacity-70'>
              {/* {`${systemUsage?.process_mem_usage || 0} / ${systemUsage?.system_mem_usage || 0}`}(%) */}
              {`${systemUsage?.system_mem_usage || 0}`}%
            </Typography.Text>
          </div>
        }

        <div>
          <Typography.Title level={5} className='!m-0'>
            {t('common.about.cpu')}
          </Typography.Title>
          <Typography.Text className='!m-0 opacity-70'>
            {/* {`${systemUsage?.process_cpu_usage || 0} / ${systemUsage?.system_cpu_usage || 0}`}(%) */}
            {`${systemUsage?.system_cpu_usage || 0}`}%
          </Typography.Text>
        </div>
        <div>
          <Typography.Title level={5} className='!m-0'>
            {t('common.about.disk')}
          </Typography.Title>
          <Typography.Text className='!m-0 opacity-70'>{`${systemUsage?.system_disk_usage || 0}`}%</Typography.Text>
        </div>
      </div>
      {false && (
        <div className='flex justify-end gap-2'>
          <Button color='yellow' variant='solid'>
            {t('common.about.client')}
          </Button>
        </div>
      )}
    </>
  );
};
export default SystemPanel;
