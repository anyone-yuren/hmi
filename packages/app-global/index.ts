import SubAbout from './src/About';
import SubCharging from './src/Charging';
import LoginDialog from './src/components/LoginDialog';
import { triggerLoginModal } from './src/components/LoginDialog/hooks/useLogin';
import HomePage from './src/Home';
import { useAgvModels } from './src/hooks/useAgvModels';
import https, { get, post } from './src/https';
import * as commonServices from './src/https/global';
import Maintenance from './src/Maintenance';
import Models from './src/Models';
import * as MwModels from './src/Models/components';
import GlobalNotification from './src/notification';
import useObsError from './src/notification/hooks/useObsError';
import SingleTask from './src/SingleTask';
import { InitStage } from './src/SingleTask/stage/index';
import Toolkit from './Toolkit';

// 获取权限
import AuthComponent, { useAuthPermission } from './src/hooks/useAuth';
export {
  AuthComponent,
  commonServices,
  get,
  GlobalNotification,
  HomePage,
  https,
  InitStage,
  LoginDialog,
  Maintenance,
  Models,
  MwModels,
  post,
  SingleTask,
  SubAbout,
  SubCharging,
  Toolkit,
  triggerLoginModal,
  useAgvModels,
  useAuthPermission,
  useObsError,
};
