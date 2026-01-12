import { get, post } from './index';

export const postLanguageType = (num: any) => {
  return post('/sirius/robot_config/language_type', {
    language_type: num,
  });
};
export const getLanguageType = (params: any) => {
  return get('/sirius/robot_config/language_type', params);
};
