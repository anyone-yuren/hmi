// components/LoginModalTrigger.tsx
import { useGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { Form, Input, Modal } from 'antd';
import { createStyles, ThemeProvider } from 'antd-style';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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
  const { t, i18n } = useTranslation();
  const { setToken } = useGlobalStore(
    useShallow((state) => ({
      setToken: state.setToken,
    })),
  );
  const { runAsync, loading } = useRequest(postLogin, {
    manual: true,
    onSuccess: (data) => {
      setToken(data?.data?.permission ?? 'admin');
      toast.warning(t('common.loginSuccessTip'), {
        // duration: Infinity,
        classNames: {
          closeButton: '!p-0',
        },
      });
    },
  });
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const modalRef = useRef<any>(null);

  const showLoginModal = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.destroy();
    }
    modalRef.current = Modal.confirm({
      title: t('common.login'),
      content: (
        <ThemeProvider themeMode='dark'>
          <Form
            form={form}
            autoComplete='off'
            clearOnDestroy
            labelAlign='right'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item
              label={t('common.username')}
              name='username'
              rules={[{ required: true, message: t('common.pleaseUsername') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('common.password')}
              name='password'
              rules={[{ required: true, message: t('common.pleasePassword') }]}
            >
              <Input type='password' />
            </Form.Item>
          </Form>
        </ThemeProvider>
      ),
      onOk: async () => {
        // 提交逻辑
        const values = await form.validateFields();
        return runAsync(values);
      },
      okButtonProps: {
        loading,
      },
      rootClassName: styles.loginModal,
    });
  }, [i18n.language]);

  useEffect(() => {
    if (modalRef.current) {
      console.log('loading', loading);
      modalRef.current.update({
        okButtonProps: {
          loading,
        },
      });
    }
  }, [loading]);

  showLoginModalExternal = showLoginModal;

  return null; // 不需要渲染任何内容
}
