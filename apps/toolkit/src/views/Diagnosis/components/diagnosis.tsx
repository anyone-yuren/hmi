import PageLoading from '@/components/PageLoading';
import { useRequest } from 'ahooks';
import { Collapse } from 'antd';
import * as React from 'react';
import { postPhenomenon, queryPhenomenonList } from '../services';
const Diagnosis = () => {
  const [renderList, setRenderList] = React.useState([]);
  const [loadingKey, setLoadingKey] = React.useState<string | null>(null);
  const { data: phenomenonList } = useRequest(() => queryPhenomenonList());
  const { runAsync: run, loading } = useRequest(postPhenomenon, {
    manual: true,
  });
  React.useEffect(() => {
    if (!phenomenonList?.data) return;
    const ary = phenomenonList?.data?.map((item) => {
      return {
        key: item.type,
        label: item.description,
        children: <div>{item.description}</div>,
      };
    });
    setRenderList(ary);
  }, [phenomenonList]);

  const onChange = async (keys: any) => {
    const [key] = keys;
    if (!key) return;
    setLoadingKey(key);
    const response = await run({ phenomenon_type: Number(key) });
    let ary: any = [...renderList];
    ary = ary.map((item: any) => {
      if (item.key == key) {
        return {
          ...item,
          children: (
            <div>
              <div className='text-xl'>{response?.data?.diagnosis_result}</div>
            </div>
          ),
        };
      }
      return item;
    });
    setRenderList(ary);
  };
  return (
    <div>
      <Collapse items={renderList} accordion onChange={onChange} />
      {loading && loadingKey && <PageLoading />}{' '}
    </div>
  );
};
export default Diagnosis;
