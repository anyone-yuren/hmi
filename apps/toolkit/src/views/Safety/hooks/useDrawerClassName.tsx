import { createStyles } from 'antd-style';
import { DrawerClassNames } from 'antd/es/drawer/DrawerPanel';

const useDrawerStyles = createStyles(({ token }) => ({
  'my-drawer-body': {
    background: 'transparent',
  },
  'my-drawer-header': {
    // background: '#162640',
  },
  'my-drawer-footer': {
    color: token.colorPrimary,
  },
  'my-drawer-content': {
    // background: `#162640 !important`,
  },
}));

const useDrawerClassName = () => {
  const { styles: drawerStyles } = useDrawerStyles();
  const classNames: DrawerClassNames = {
    body: drawerStyles['my-drawer-body'],
    mask: drawerStyles['my-drawer-mask'],
    header: drawerStyles['my-drawer-header'],
    footer: drawerStyles['my-drawer-footer'],
    content: drawerStyles['my-drawer-content'],
  };
  return classNames;
};

export default useDrawerClassName;
