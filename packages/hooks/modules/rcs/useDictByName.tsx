/**
 * @description: 字典，由于包依赖的原型，store中的数据需要自行先处理
 * @param {string} name 字典名称
 * @return {*}
 */
import { useRcsGlobalStore } from '@gbeata/store';
import { useShallow } from 'zustand/react/shallow';

const useDict = (name) => {
  const { dicts } = useRcsGlobalStore(
    useShallow((store) => {
      return {
        dicts: store.dict,
      };
    }),
  );
  const filterName = dicts[name] ?? [];
  return filterName?.map((item) => {
    return {
      label: item.description,
      value: item.value,
    };
  });
};

export default useDict;
