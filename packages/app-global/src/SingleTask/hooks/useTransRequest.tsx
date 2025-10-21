import { useRequest } from 'ahooks';
import { useState } from 'react';
const useTransRequest = (service, options) => {
  // const { service, options } = props;
  const { translate, ...resetProps } = options;
  const [response, setResponse] = useState(null);
  const { data, ...resetResponse } = useRequest(service, {
    ...resetProps,
    onSuccess: (res) => {
      translate && setResponse(translate(res));
    },
  });
  return {
    data: response,
    ...resetResponse,
  };
};

export default useTransRequest;
