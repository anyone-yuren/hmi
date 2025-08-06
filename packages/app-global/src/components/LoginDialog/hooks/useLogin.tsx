// components/LoginModalTrigger.tsx
import { useGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { Form, Input, Modal } from 'antd';
import { createStyles, ThemeProvider } from 'antd-style';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { postLogin } from '../services';

let showLoginModalExternal: (() => void) | null = null;

export function triggerLoginModal() {
  showLoginModalExternal?.();
}

const useStyles = createStyles(({ css, token }) => {
  return {
    loginModal: css`
      .ant-modal-content {
        background: ${token.colorBgContainer};
      }
      .ant-modal-confirm-title {
        color: ${token.colorText};
      }
      .ant-modal-confirm-btns .ant-btn + .ant-btn {
        background: ${token.colorPrimary};
      }
    `,
  };
});

export default function LoginModalTrigger() {
  const { setToken } = useGlobalStore(
    useShallow((state) => ({
      setToken: state.setToken,
    })),
  );
  const { run, loading } = useRequest(postLogin, {
    manual: true,
    onSuccess: (data) => {
      setToken(data?.permission ?? 'admin');
    },
  });
  const { styles } = useStyles();
  const [form] = Form.useForm();

  const showLoginModal = useCallback(() => {
    Modal.confirm({
      title: '登录',
      content: (
        <ThemeProvider themeMode='dark'>
          <Form form={form} autoComplete='off' clearOnDestroy>
            <Form.Item label='用户名' name='username' rules={[{ required: true, message: '请输入用户名' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='密码' name='password' rules={[{ required: true, message: '请输入密码' }]}>
              <Input type='password' />
            </Form.Item>
          </Form>
        </ThemeProvider>
      ),
      onOk: async () => {
        // 提交逻辑
        const values = await form.validateFields();
        await run(values);
      },
      okButtonProps: {
        loading,
      },
      rootClassName: styles.loginModal,
    });
  }, []);

  showLoginModalExternal = showLoginModal;

  return null; // 不需要渲染任何内容
}
