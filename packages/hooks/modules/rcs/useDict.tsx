/**
 * @description: 字典，由于包依赖的原型，store中的数据需要自行先处理
 * @param {string} name 字典名称
 * @return {*}
 */
import { useRcsGlobalStore } from '@gbeata/store';
import { useAsyncEffect, useRequest } from 'ahooks';
import { v1CommonGetEnumDictionary } from 'apis';
import { useShallow } from 'zustand/react/shallow';

const useDict = () => {
  const { setDict } = useRcsGlobalStore(
    useShallow((store) => {
      return {
        setDict: store.setDict,
      };
    }),
  );

  const { run: getDicts } = useRequest(v1CommonGetEnumDictionary, {
    manual: true,
    onSuccess: (result) => {
      result.routeEventType = result.routeEventType?.filter((item) => item.value !== 3);
      Object.keys(result).length && setDict(result);
    },
  });

  useAsyncEffect(async () => {
    await getDicts({});
  }, []); // 仅在组件挂载时执行

  return {
    getRcsDict: getDicts,
  };
};

export default useDict;
