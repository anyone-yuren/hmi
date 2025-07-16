import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { Button } from '@mui/material';
import { useRequest } from 'ahooks';
import { t } from 'i18next';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { useHttpCode } from '../../../../hooks/useHttpCode';
import { postAddSettledReflectors, postSettleReflectors } from '../../services';

const btnAttrs: any = {
  size: 'small',
  variant: 'contained',
  sx: { color: 'white' },
};
const defaultBtnBg = {
  backgroundColor: 'rgba(0, 0, 0, 0.3) !important',
  color: 'white',
};

const AddActions = () => {
  const { getCodeMsg } = useHttpCode();

  // 0: 镇定, 1: 添加
  const [btnIndex, setBtnIndex] = useState<0 | 1>(0);
  const { isSettled } = useHybirdStore(
    useShallow((state) => ({
      isSettled: state.isSettled,
    })),
  );
  console.log(isSettled);

  // 镇定
  const { runAsync: runCalm, loading: calmLoading } = useRequest(postSettleReflectors, {
    manual: true,
    debounceWait: 100,
  });

  const { runAsync: runAdd, loading: addLoading } = useRequest(postAddSettledReflectors, {
    manual: true,
    debounceWait: 100,
  });

  const [delay, setDelay] = useState(false);
  // 镇定
  const handleCalm = async () => {
    setDelay(true);
    const { error_code, error_description } = ((await runCalm()) as any) ?? {};
    if (error_code !== 10000) {
      toast.error(error_description || getCodeMsg(error_code));
      setBtnIndex(0);
      setDelay(false);
      return;
    }

    setTimeout(() => {
      setDelay(false);
      setBtnIndex(1);

      setTimeout(() => {
        setBtnIndex(0);
      }, 3000);
    }, 2000);
  };

  // 添加
  const handleAdd = async () => {
    setBtnIndex(0);
    const { error_code, error_description } = ((await runAdd()) as any) ?? {};
    if (error_code !== 10000) {
      toast.error(error_description || getCodeMsg(error_code));
      setBtnIndex(1);
      return;
    }
    setBtnIndex(0);
  };

  useEffect(() => {
    setBtnIndex(0);
  }, [isSettled]);

  if (!isSettled) {
    return null;
  }

  return (
    <div className='pr-2 flex justify-end items-center gap-3'>
      <Button
        {...btnAttrs}
        onClick={handleCalm}
        disabled={delay || calmLoading || btnIndex === 1}
        {...(btnIndex === 1 || delay ? { sx: defaultBtnBg } : {})}
      >
        {t('镇定')}
      </Button>
      <Button
        {...btnAttrs}
        onClick={handleAdd}
        disabled={delay || addLoading || btnIndex === 0}
        {...(btnIndex === 0 || delay ? { sx: defaultBtnBg } : {})}
      >
        {t('添加')}
      </Button>
    </div>
  );
};

export default memo(AddActions);
