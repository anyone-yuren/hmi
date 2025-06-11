import { defHttp } from '../axios';

// 获取区域列表哦

export const getOAuth2Callback = (params: any) =>
  defHttp.get<any>({
    url: '/OAuth2/Callback',
    params,
  });

// export const getConnectToken = (params: any) =>
//   defHttp.post<any>({
//     url: '/connect/token',
//     params,
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });

// /connect/token接口特殊 返回格式没有按照统一格式,先用fetch获取
export const getConnectToken = (params: any) => {
  const url = '/wms/connect/token';
  const formData = new URLSearchParams();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      formData.append(key, params[key]);
    }
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  }).then(async (response) => {
    if (!response.ok) {
      const res = await response.json();
      throw res?.error_description;
    }
    return response.json();
  });
};
