import { Icon } from '@iconify/react';
import { type GActionProps, GAction } from 'gbeata';
import React, { useCallback } from 'react';

export type IconButtonProps = {
  children: React.ReactNode;
  actionType?: 'edit' | 'del' | 'add';
} & GActionProps;

const IconAction = (props: IconButtonProps) => {
  const { children, actionType, ...rest } = props;
  const typeIcons = {
    edit: 'mdi:square-edit-outline',
    del: 'mdi:close-box-outline',
    add: 'mdi:add',
  };
  const renderIcon = useCallback(() => {
    const iconifyIcon = actionType ? <Icon icon={typeIcons[actionType]} /> : null;
    return iconifyIcon;
  }, [actionType]);
  return (
    <GAction {...rest} type='link' icon={renderIcon()} className='flex'>
      {children}
    </GAction>
  );
};
export default IconAction;
