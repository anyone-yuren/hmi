import { AimOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Konva from 'konva';

interface IProps {
  stage?: Konva.Stage | null;
  centerOriginWithAnimation: () => void;
}
const Maphandles = (prop: IProps) => {
  const { centerOriginWithAnimation } = prop;
  return (
    <div className='absolute z-10 bottom-8 left-4 flex flex-col gap-4 rounded-lg shadow-md p-2 bg-white'>
      <AimOutlined
        className='text-lg cursor-pointer hover:text-teal-400 active:text-teal-600 animation-all duration-150'
        onClick={centerOriginWithAnimation}
      />
      <QuestionCircleOutlined className='text-lg cursor-pointer hover:text-teal-400 active:text-teal-600 animation-all duration-150' />
    </div>
  );
};

export default Maphandles;
