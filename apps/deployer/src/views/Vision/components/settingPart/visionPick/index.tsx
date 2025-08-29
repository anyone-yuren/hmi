import { Button, ListItemText, MenuItem } from '@mui/material';
import { useAsyncEffect, useRequest, useSetState } from 'ahooks';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { getVisionPickSetting, saveVisionPickSetting } from '../../../services/index';
import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import CustomSelect from '../comp/customSelect';
import CustomSwitch from '../comp/customSwitch';
import Setting from './setting';

import { translateStateToParams } from '../../../utils';

const VisionPick = () => {
  const { t } = useTranslation();
  const [settingHashMap, setSettingHashMap] = useState<any>({});
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    __isSubmit: false,
    need_detect: false,
    sensor_model: '',
    sensor_model_list: [],
  });
  const [open, setOpen] = useState(false);
  // loading 用来判断没有加载数据的时候锁死卡牌
  const { data: visionSetting, loading, runAsync: getVisionSetting } = useRequest(() => getVisionPickSetting(), {});

  useEffect(() => {
    if (!visionSetting) return;
    const { data } = visionSetting;
    setSettingHashMap({ ...data });
    setUpdateHashMap({
      need_detect: data?.need_detect?.value,
      sensor_model: data?.sensor_model?.value || '',
      sensor_model_list: data?.sensor_model_list?.value,
    });
  }, [visionSetting]);

  useAsyncEffect(async () => {
    if (!updateHashMap.__isSubmit) {
      return;
    }
    const params = translateStateToParams(settingHashMap, updateHashMap);
    await saveVisionPickSetting(params);
    toast.success(t('common.actionSuccess'));
  }, [updateHashMap, settingHashMap]);

  const handleTitle = () => {
    // 获取总运行时间
    const totalMilliseconds = performance.now();
    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
    const milliseconds = Math.floor(totalMilliseconds % 1000);

    // 获取内存信息（仅在 Chrome 中支持）
    const memoryInfo = performance.memory
      ? {
          usedJSHeapSize: `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          totalJSHeapSize: `${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          jsHeapSizeLimit: `${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
        }
      : { error: 'Memory information not available' };

    // 获取导航性能数据
    const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navigationInfo = navigation
      ? {
          type: navigation.type,
          redirectCount: navigation.redirectCount,
          duration: `${navigation.duration.toFixed(2)} ms`,
          domContentLoadedEventEnd: `${navigation.domContentLoadedEventEnd.toFixed(2)} ms`,
          loadEventEnd: `${navigation.loadEventEnd.toFixed(2)} ms`,
        }
      : { error: 'Navigation performance data not available' };

    // 获取网络状态
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const networkInfo = connection
      ? {
          type: connection.effectiveType,
          downlink: `${connection.downlink} Mbps`,
          rtt: `${connection.rtt} ms`,
        }
      : { error: 'Network information not available' };

    // 获取资源加载性能
    const resources = performance.getEntriesByType('resource');

    // 渲染和绘制性能
    const paintTimings = performance.getEntriesByType('paint');
    const paintInfo = paintTimings.map((paint) => ({
      name: paint.name,
      startTime: `${paint.startTime.toFixed(2)} ms`,
    }));

    // 格式化输出
    const formattedOutput = `
      === 性能信息 ===
      运行时间: ${hours}小时 ${minutes}分钟 ${seconds}秒 ${milliseconds}毫秒

      === 内存信息 ===
      已使用堆内存: ${memoryInfo.usedJSHeapSize || 'N/A'}
      总堆内存: ${memoryInfo.totalJSHeapSize || 'N/A'}
      堆内存限制: ${memoryInfo.jsHeapSizeLimit || 'N/A'}

      === 导航性能 ===
      类型: ${navigationInfo.type || 'N/A'}
      重定向次数: ${navigationInfo.redirectCount || 'N/A'}
      总耗时: ${navigationInfo.duration || 'N/A'}
      DOM 加载完成时间: ${navigationInfo.domContentLoadedEventEnd || 'N/A'}
      页面加载完成时间: ${navigationInfo.loadEventEnd || 'N/A'}

      === 网络状态 ===
      类型: ${networkInfo.type || 'N/A'}
      下行速度: ${networkInfo.downlink || 'N/A'}
      延迟: ${networkInfo.rtt || 'N/A'}

      === 渲染和绘制 ===
      ${paintInfo.map((p) => `${p.name}: ${p.startTime}`).join('\n')}
      `;

    alert(formattedOutput.trim());
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center flex-1 basis-[45%] w-[50%] h-full overflow-hidden'>
        <div className='w-full bg-[#2c3645] rounded-[20px] p-[20px] overflow-hidden relative h-full overflow-y-auto'>
          <div className='text-3xl' onClick={handleTitle}>
            {t('deployer.vision.pick')}
          </div>
          <div className='my-3 p-4 bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-center justify-between text-lg'>
            <div>{t('deployer.vision.isTurnOn')}</div>
            <div>
              <CustomSwitch
                checked={updateHashMap.need_detect}
                onChange={(event: any) => {
                  setUpdateHashMap({
                    __isSubmit: true,
                    need_detect: event.target.checked,
                  });
                }}
              />
            </div>
          </div>
          <div className='my-3 p-4 bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-center justify-between text-lg'>
            <div>{t('deployer.vision.sensorBind')}</div>
            <div>
              <CustomSelect
                variant='standard'
                value={updateHashMap.sensor_model}
                onChange={(event: any) => {
                  setUpdateHashMap({
                    __isSubmit: true,
                    sensor_model: event.target.value,
                  });
                }}
              >
                {updateHashMap?.sensor_model_list?.map((name) => (
                  <MenuItem key={name} value={name}>
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </CustomSelect>
            </div>
          </div>
          <Button
            sx={{ color: 'white', float: 'right' }}
            variant='contained'
            onClick={async () => {
              setOpen(true);
            }}
          >
            {t('deployer.vision.paramSetting')}
          </Button>
        </div>
      </div>

      <SecondaryPage open={open} setOpen={setOpen} fullScreen={true} background={'#445260'}>
        <SecondaryPaper>{open && <Setting __open={setOpen}></Setting>}</SecondaryPaper>
      </SecondaryPage>
    </>
  );
};

export default memo(VisionPick);
