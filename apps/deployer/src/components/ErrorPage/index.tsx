import { Button } from 'antd';
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
        <p className='absolute text-sm opacity-80 text-nowrap -top-10'>
          系统会自动每隔10s连接三次，若依然无法加载数据，请手动尝试！
        </p>
        <p className='text-lg font-bold'>网络异常，请重试</p>
        <Button type='primary' loading={loading} onClick={refresh}>
          {loading ? '连接中' : '重试'}
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
