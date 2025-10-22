import { useGlobalStore } from '@gbeata/store';
import { useShallow } from 'zustand/react/shallow';
export type IProps = {
  children?: React.ReactNode;
  authKey?: string[];
};
export const useAuthPermission = () => {
  const { token } = useGlobalStore(
    useShallow((state) => {
      return {
        token: state.token,
      };
    }),
  );
  const auth = (authKey: string[]) => {
    return authKey.includes(token);
  };
  return {
    auth,
  };
};
const AuthComponent = (props: IProps) => {
  const { authKey, children } = props;
  const { token } = useGlobalStore(
    useShallow((state) => {
      return {
        token: state.token,
      };
    }),
  );
  debugger;
  if (authKey && !authKey.includes(token)) {
    return null;
  }
  return children;
};
export default AuthComponent;
