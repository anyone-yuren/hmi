import { SwapOutlined } from '@ant-design/icons';
import { useRcs2DGlobalStore } from '@gbeata/store';
import { Input, message } from 'antd';
import { v1MapGetPathNewAsync } from 'apis';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const initParma = { start: '', end: '' };
const RouteCheck = () => {
  const [params, setParams] = useState(initParma);
  const { setActiveLines, setMoveToPosition } = useRcs2DGlobalStore(
    useShallow((state) => ({
      setActiveLines: state.setActiveLines,
      setMoveToPosition: state.setMoveToPosition,
    })),
  );

  const handleSearch = async () => {
    console.log(params);
    if (!params.end || !params.start) {
      return;
    }
    const { path } = await v1MapGetPathNewAsync(params);
    if (!path.length) {
      message.error('没有找到线');
    }
    const ary: any = [];
    for (let index = 0; index < path.length; index++) {
      const element = path[index];
      element.controlPoint = element.controlPointInfo;
      delete element.controlPointInfo;
      ary.push(element);
    }
    setActiveLines(path);
    setMoveToPosition({ x: 0, y: 0, z: 0 });
    message.success('路线通畅');
  };
  return (
    <div>
      <Input
        placeholder={'起始点'}
        className='w-[130px]'
        value={params.start}
        onChange={(event: any) => {
          setParams({
            ...params,
            start: event.target.value,
          });
        }}
      ></Input>
      &nbsp;
      <SwapOutlined
        className='cursor-pointer'
        onClick={() => {
          const { start, end } = params;
          setParams({
            start: end,
            end: start,
          });
        }}
      />
      &nbsp;
      <Input.Search
        placeholder={'终止点'}
        className='w-[150px]'
        value={params.end}
        onChange={(event: any) => {
          setParams({
            ...params,
            end: event.target.value,
          });
        }}
        onSearch={handleSearch}
      ></Input.Search>
    </div>
  );
};

export default RouteCheck;
