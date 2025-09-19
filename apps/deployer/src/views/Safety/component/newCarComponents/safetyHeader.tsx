import { FormOutlined, MenuOutlined, MoonOutlined, SunOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Select, Switch } from 'antd';
import { useResponsive } from 'antd-style';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
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
}
const SafetyHeader = (props: IProps) => {
  const { isDark, setOpenUpdateObsDrawer, setIsDark, show, setShow, obsData, loading } = props;

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

  return (
    <div
      className={`header h-14 py-2 shadow-md gap-2 flex items-center justify-between px-4 ${obsInfo.type ? '' : 'hidden'}`}
    >
      <div className='flex items-center gap-4 min-w-0'>
        <Button size='small' className='text-current shrink-0' icon={<MenuOutlined />} onClick={() => setShow(!show)} />
        <p className='shrink-0'>
          当前避障方案：
          <span
            className={`px-4 py-1 cursor-pointer ${
              !isDark
                ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]'
                : 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_70%)]'
            } font-bold`}
            onClick={() => setOpenUpdateObsDrawer && setOpenUpdateObsDrawer(true)}
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
                切换避障
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key='select'
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
                  label: item.scheme_id,
                  value: item.scheme_id,
                }))}
                onChange={(value) => {
                  setShowSelect(false);
                }}
              />
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
    </div>
  );
};

export default SafetyHeader;
