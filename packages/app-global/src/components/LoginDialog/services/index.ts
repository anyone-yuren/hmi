import { post } from '@gbeata/app-global';
// 请求登录
export const postLogin = (data: any) => {
  return post('/mwrobot/account/login', data);
};
