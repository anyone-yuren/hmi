import { SvgIcon } from 'ui';
interface IProps {
  title: string;
  icon: string;
}
const EmptyPage = ({ title, icon }: IProps) => {
  return (
    <div className='flex w-full h-full flex-col items-center justify-center'>
      <SvgIcon name={icon} size={420} />
      <div className='text-center flex flex-col gap-2 items-center relative'>
        <p className='text-lg font-bold'>{title}</p>
      </div>
    </div>
  );
};

export default EmptyPage;
