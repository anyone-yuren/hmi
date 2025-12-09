import { Input, Modal, theme } from 'antd';
import { useResponsive } from 'antd-style';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconifyIcon } from 'ui';
const GlobalFooter = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, contextHolder] = Modal.useModal();
  const active = location.pathname;
  // const bg = 'bg-gradient-to-b from-[#235EFF] via-[#3F73FF] to-[#235EFF] text-white';
  const bg = `text-[${token.colorPrimary}]`;
  const { t } = useTranslation();
  const responsive = useResponsive();
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className='w-full flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <div
          className='flex items-center cursor-pointer transition-all rounded-sm duration-300 hover:bg-white/10'
          onClick={() => {
            setShowHistory(true);
          }}
        >
          <IconifyIcon
            icon='hugeicons:git-merge'
            size={20}
            className='opacity-80 transition-all rounded-sm duration-300 hover:bg-white/10 hover:opacity-100'
          />
          20251208-1 <span>﹡</span>
        </div>
        <IconifyIcon
          icon='lineicons:cloud-refresh-clockwise'
          size={20}
          className='opacity-80 transition-all rounded-sm duration-300 hover:bg-white/10 hover:opacity-100'
          onClick={() =>
            modal.confirm({
              title: '确认同步吗？',
              okText: '确认',
              okType: 'primary',
              onOk: () => {
                navigate('/');
              },
            })
          }
        />
      </div>
      <div className='flex items-center gap-2'>
        <div className='flex items-center cursor-pointer transition-all rounded-sm duration-300 hover:bg-white/10'>
          <IconifyIcon
            icon='material-symbols-light:language'
            size={20}
            className='opacity-80 transition-all rounded-sm duration-300 hover:bg-white/10 hover:opacity-100'
          />
          <span>中文</span>
        </div>
        <IconifyIcon
          icon='mage:notification-bell-pending'
          size={20}
          className='opacity-80 transition-all rounded-sm duration-300 hover:bg-white/10 hover:opacity-100'
        />
        <IconifyIcon
          icon='stash:question'
          size={20}
          className='opacity-80 transition-all rounded-sm duration-300 hover:bg-white/10 hover:opacity-100'
        />
      </div>
      {contextHolder}

      <Modal
        title={null}
        closable={false}
        open={showHistory}
        styles={{
          mask: {
            backdropFilter: 'blur(2px)',
          },
        }}
        afterOpenChange={(open) => {
          if (open && inputRef.current) {
            // 默认选中全部文字
            inputRef.current.focus({ cursor: 'all' });
            inputRef.current.select();
          }
        }}
        style={{
          top: '0px',
        }}
        transitionName={''}
        onCancel={() => {
          setShowHistory(false);
        }}
      >
        <Input className='w-full' ref={inputRef} autoFocus />
        {/* 历史记录 */}
        <div className='mt-4'>
          <div className='flex items-center gap-2'>
            <IconifyIcon
              icon='line-md:history'
              size={20}
              className='opacity-80 transition-all rounded-sm duration-300 hover:bg-white/10 hover:opacity-100'
            />
            <div className='flex flex-col w-full max-h-60 overflow-auto'>
              {new Array(20).fill(0).map((item, index) => (
                <p
                  key={index}
                  className='w-full flex items-center justify-between cursor-pointer p-2 rounded-sm border-b border-teal-400/20  text-white transition-all duration-300 hover:bg-white/10 hover:opacity-100'
                >
                  <span className='text-sm text-white/80'>20251208-{index + 1}. 2025-12-08 10:00:00</span>

                  <IconifyIcon
                    icon='grommet-icons:return'
                    size={16}
                    className='opacity-60 transition-all rounded-sm duration-300 hover:bg-white/10 hover:opacity-100'
                  />
                </p>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GlobalFooter;
