import { post } from '@/https';

export const postLanguageType = (num: any) => {
  return post('/sirius/robot_config/language_type', {
    language_type: num,
  });
};
