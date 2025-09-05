interface IProps {
  rects: Array<{ id: string; x: number; y: number; width: number; height: number }>;
}
const DrawerContent = (props: IProps) => {
  const { rects } = props;
  return <div></div>;
};

export default DrawerContent;
