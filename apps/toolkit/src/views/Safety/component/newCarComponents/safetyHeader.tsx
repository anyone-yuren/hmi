import { FormOutlined, MenuOutlined, MoonOutlined, SunOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Select, Skeleton, Switch } from 'antd';
import { useResponsive } from 'antd-style';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../../store/safety.store';
interface IProps {
  isDark: boolean;
  setIsDark: (open: boolean) => void;
  setOpenUpdateObsDrawer: (open: boolean) => void;
  show: boolean;
  setShow: (open: boolean) => void;
  obsData: any[];
  loading: boolean;
  refreshCurrentObsInfo: (scheme_id: number) => void;
}
const SafetyHeader = (props: IProps) => {
  const { t } = useTranslation();
  const { isDark, setOpenUpdateObsDrawer, setIsDark, show, setShow, obsData, loading, refreshCurrentObsInfo } = props;

  const [showSelect, setShowSelect] = useState(false);
  // const { data: obstacleData, loading: obstacleDataLoading, run: refreshObstacleData } = useRequest(safetyConfig);

  const responsive = useResponsive();
  const { obsInfo } = useSafetyStore(
    useShallow((store) => {
      return {
        obsInfo: store.obsInfo,
      };
    }),
  );

  useEffect(() => {
    setShowSelect(false);
  }, [obsData]);

  return (
    <div className={`header h-14 py-2 shadow-md gap-2 flex items-center justify-between px-4`}>
      {obsInfo.type && obsData.length ? (
        <>
          <div className='flex items-center gap-4 min-w-0'>
            <Button
              size='small'
              className='text-current shrink-0'
              icon={<MenuOutlined />}
              onClick={() => setShow(!show)}
            />
            <p className='shrink-0'>
              {t('deployer.safety.current_scheme')}：
              <span
                className={`px-4 py-1 cursor-pointer ${
                  !isDark
                    ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]'
                    : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_70%)]'
                } font-bold`}
                onClick={() => {
                  const currentObs = obsData?.find((item) => item?.scheme_id === obsInfo?.scheme_id);
                  if (!(currentObs && currentObs.scheme_id)) {
                    toast.error(t('deployer.safety.current_scheme_not_exist'));
                    return;
                  }
                  setOpenUpdateObsDrawer && setOpenUpdateObsDrawer(true);
                }}
              >
                {obsInfo?.scheme_id ?? '-'}
                <FormOutlined className='ml-2 cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 transition-all' />
              </span>
            </p>
            <AnimatePresence mode='wait'>
              {!showSelect ? (
                <motion.div
                  key='button'
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    className='text-current shrink-0 !py-[1px] box-content'
                    type='dashed'
                    size='small'
                    loading={loading}
                    disabled={obsData?.length === 0}
                    icon={<SwapOutlined />}
                    onClick={() => setShowSelect(true)}
                  >
                    {t('deployer.safety.switch_scheme')}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key='select'
                  className='flex items-center gap-2'
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Select
                    size={responsive?.xs ? 'small' : 'middle'}
                    className='h-7'
                    style={{ width: responsive?.xs ? 120 : 160 }}
                    defaultValue={obsInfo?.scheme_id ?? '-'}
                    options={obsData?.map((item) => ({
                      label: item?.scheme_id,
                      value: item?.scheme_id,
                    }))}
                    onChange={(value) => {
                      refreshCurrentObsInfo(value);
                      setOpenUpdateObsDrawer && setOpenUpdateObsDrawer(true);
                      // setShowSelect(false);
                    }}
                  />
                  <Button
                    className='text-current shrink-0 !py-[1px] box-content'
                    type='dashed'
                    size='small'
                    loading={loading}
                    disabled={obsData?.length === 0}
                    onClick={() => {
                      setShowSelect(false);
                      refreshCurrentObsInfo();
                      setOpenUpdateObsDrawer && setOpenUpdateObsDrawer(false);
                    }}
                  >
                    {t('deployer.safety.cancel')}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Switch
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            value={isDark}
            onChange={setIsDark}
          />
        </>
      ) : (
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2'>
            <Skeleton.Avatar active size='small' />
            <Skeleton.Input size='small' />
          </div>
          <Skeleton.Button active size='small' />
        </div>
      )}
    </div>
  );
};

export default SafetyHeader;
