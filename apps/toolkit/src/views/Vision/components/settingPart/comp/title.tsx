import { Divider } from 'antd';
import { memo } from 'react';

const Title = (props: any) => {
  return (
    <Divider style={{ borderColor: 'black' }} orientation='left'>
      <p className='text-xl text-[#000000b3]'>{props.children}</p>
    </Divider>
  );
};

export default memo(Title);
