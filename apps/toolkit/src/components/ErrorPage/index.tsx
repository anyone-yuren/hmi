import { Button } from 'antd';
import { t } from 'i18next';
import { SvgIcon } from 'ui';
interface IProps {
  loading: boolean;
  refresh: () => void;
}
const ErrorPage = ({ loading, refresh }: IProps) => {
  return (
    <div className='flex w-full h-full flex-col items-center justify-center'>
      <SvgIcon name='networkError' size={420} />
      <div className='text-center flex flex-col gap-2 items-center relative'>
        <p className='absolute text-sm opacity-80 text-nowrap -top-10'>{t('common.retryNetworkTips')}</p>
        <p className='text-lg font-bold'>{t('common.networkErrorTips')}</p>
        <Button type='primary' loading={loading} onClick={refresh}>
          {loading ? t('deployer.hybrid.connecting') : t('common.reTry')}
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
