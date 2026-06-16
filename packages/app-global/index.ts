import SubAbout from './src/About';
import SubCharging from './src/Charging';
import LoginDialog from './src/components/LoginDialog';
import { triggerLoginModal } from './src/components/LoginDialog/hooks/useLogin';
import https, { get, post } from './src/https';
import * as commonServices from './src/https/global';
import Maintenance from './src/Maintenance';
import MapEditor from './src/mapEditor';
import Models from './src/Models';
import AutoCompile from './src/Models/components/AutoCompile';
import GlobalNotification from './src/notification';
import useObsError from './src/notification/hooks/useObsError';
import Parameters from './src/Parameters';
import SingleTask from './src/SingleTask';
import { InitStage } from './src/SingleTask/stage/index';
import Toolkit from './src/toolkit';
import VehicleModelManagement from './src/VehicleModelManagement';
import WorkflowDesigner from './src/WorkflowDesigner';

// 获取权限
import AuthComponent, { useAuthPermission } from './src/hooks/useAuth';
export {
  AuthComponent,
  AutoCompile,
  commonServices,
  get,
  GlobalNotification,
  https,
  InitStage,
  LoginDialog,
  Maintenance,
  MapEditor,
  Models,
  Parameters,
  post,
  SingleTask,
  SubAbout,
  SubCharging,
  Toolkit,
  triggerLoginModal,
  useAuthPermission,
  useObsError,
  VehicleModelManagement,
  WorkflowDesigner,
};
