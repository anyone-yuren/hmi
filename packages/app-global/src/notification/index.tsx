import { useNotification } from './hooks/useNotification';
const GlobalNotification = () => {
  const { sendMessage, latestMessage, readyState } = useNotification();
  // toast(
  //   <div>
  //     <div>安全观测信息</div>
  //   </div>,
  // );
  return <></>;
};

export default GlobalNotification;
