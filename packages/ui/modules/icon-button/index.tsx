import { type ButtonProps, Button } from 'antd';

type IProps = {} & ButtonProps;
const IconButton = (props: IProps) => {
  const { children } = props;
  return <Button {...props}>{children}</Button>;
};
export default IconButton;
