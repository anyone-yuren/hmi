import { Card, Result } from 'antd';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { SvgIcon } from 'ui';

import type { FC, ReactNode } from 'react';

const subTitleMap = new Map([
  [403, t('common.noPermission')],
  [404, t('common.notFound')],
  [500, t('common.serverError')],
  [401, t('common.unauthorized')],
]);

const PageException: FC<{ status: number; withCard?: boolean }> = (props) => {
  const navigate = useNavigate();

  const { status, withCard = false } = props;

  const goHome = () => {
    navigate('/');
  };

  const WithCard = ({ children }: { children: ReactNode }) => {
    if (withCard) {
      return <Card bordered={false}>{children}</Card>;
    }
    return <div className='flex-center h-full'>{children}</div>;
  };

  return (
    <WithCard>
      <Result
        className='p-0'
        // status={status}
        title={subTitleMap.get(status)}
        icon={<SvgIcon size={320} name={status} />}
        // subTitle={subTitleMap.get(status)}
      />
    </WithCard>
  );
};

export default PageException;
