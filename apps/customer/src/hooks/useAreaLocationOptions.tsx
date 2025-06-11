import { useDict } from '@gbeata/hooks';
import { useRequest } from 'ahooks';
import { wms } from 'apis';
import { useMemo } from 'react';

interface ILocation {
  label: string;
  value: string;
  children?: ILocation[];
}

const useAreaLocationOptions = (manual: boolean = false) => {
  const containerOptions = useDict('ContainerState');

  //	组盘位置
  const { data: optionList = [], runAsync: load } = useRequest(
    () =>
      wms.getAreaLocationList().then((res: any) => {
        return (
          (res?.map((item: any) => {
            const { id: value, name: label, items = [] } = item;
            const children = items.map((opt: any) => {
              const { id, no, containerState } = opt;
              return {
                label: no,
                value: id,
                containerState,
              };
            });
            return {
              label,
              value,
              children,
            };
          }) as ILocation[]) ?? []
        );
      }),
    {
      manual,
      onSuccess: (res) => {
        console.log('--------库位列表-------', res);
      },
    },
  );

  // 通过value 获取到对应的containerState
  const getContainerState = (value: string) => {
    const area = optionList.find((item) => item.children?.some((child) => child.value === value));
    const location = area?.children?.find((item) => item.value === value);
    return location?.containerState;
  };

  const options = useMemo(() => {
    return optionList.map((item) => {
      const { label, value, children } = item;
      return {
        label,
        value,
        children: children?.map((child: any) => {
          const { label, value, containerState } = child;
          const containerOption = containerOptions.find((item: any) => item.value === containerState);
          const nextLabel = containerState !== null ? `${label}(${containerOption?.label})` : label;
          return {
            label: nextLabel,
            value,
          };
        }),
      };
    });
  }, [optionList, containerOptions]);

  const getAreaLocation = (locationId: string, options: ILocation[]) => {
    const area = options.find((item) => item.children?.some((child) => child.label === locationId));
    const location = area?.children?.find((item) => item.label === locationId);
    return [area?.value, location?.value];
  };

  return { load, options, getAreaLocation, getContainerState };
};

export default useAreaLocationOptions;
