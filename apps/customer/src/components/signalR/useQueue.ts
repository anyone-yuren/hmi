import _ from 'lodash';
import { useRef, useState } from 'react';

// 监听页面变化和动态改变网站标题
export default function useQueue() {
  const queueRef = useRef<any>([]);

  const enqueue = (vehicleAry: any) => {
    let ary = queueRef?.current;
    ary.push(vehicleAry);
    size() > 30 && (ary = ary.slice(-25));
    queueRef.current = ary;
  };

  const dequeue = () => {
    const ary = queueRef?.current;
    return ary.shift();
  };

  const size = () => {
    return queueRef?.current?.length;
  };

  const peek = () => {
    return queueRef?.current[0];
  };
  return { queue: queueRef?.current, enqueue, dequeue, size, peek };
}
