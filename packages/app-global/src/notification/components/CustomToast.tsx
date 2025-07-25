'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Button } from 'antd';
import { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export function toast(
  toast: Omit<ToastProps, 'id'>,
  position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left',
) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        title={toast.title}
        description={toast.description}
        className={toast.className}
        button={{
          label: toast.button?.label,
          onClick: () => console.log('Button clicked'),
        }}
      />
    ),
    {
      duration: Infinity,
      position: position ?? 'top-center',
    },
  );
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
  const { title, description, button, id } = props;
  return (
    <div
      className={`flex rounded-lg bg-[#facc15] shadow-lg ring-1 ring-black/5 w-full min-w-[500px] mx-auto items-center p-4 ${props.className}`}
    >
      <div className='flex flex-1 items-center'>
        <div className='w-full'>
          <p className='text-lg font-medium text-gray-900'>{title}</p>
          <div className='mt-1 text-white font-bold'>{[description]}</div>
        </div>
      </div>

      {/* <CloseOutlined
        onClick={() => sonnerToast.dismiss(id)}
        className='absolute top-2 right-2 '
        style={{
          fontSize: '36px !important',
        }}
      /> */}
      <CloseIcon onClick={() => sonnerToast.dismiss(id)} fontSize='large' className='absolute top-2 right-2 ' />

      {button?.label ? (
        <div className='ml-5 shrink-0 rounded-md text-sm font-medium '>
          <Button
            type='link'
            onClick={() => {
              button?.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {button?.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string | ReactNode;
  description: string | ReactNode;
  className?: string;
  button?: {
    label: string;
    onClick: () => void;
  };
}
