'use client';

import { Button } from 'antd';
import { toast as sonnerToast } from 'sonner';
/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        title={toast.title}
        description={toast.description}
        button={{
          label: toast.button.label,
          onClick: () => console.log('Button clicked'),
        }}
      />
    ),
    {
      duration: Infinity,
    },
  );
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div className='flex rounded-lg bg-[#facc15] shadow-lg ring-1 ring-black/5 w-full min-w-[400px] items-center p-4'>
      <div className='flex flex-1 items-center'>
        <div className='w-full'>
          <p className='text-lg font-medium text-gray-900'>{title}</p>
          <p className='mt-1 text-lg text-white font-bold'>{description}</p>
        </div>
      </div>
      <div className='ml-5 shrink-0 rounded-md text-sm font-medium '>
        <Button
          type='link'
          onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </Button>
      </div>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button: {
    label: string;
    onClick: () => void;
  };
}
