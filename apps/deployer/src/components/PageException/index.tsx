import { Button, Card, Result } from 'antd';
import { t } from 'i18next';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { SvgIcon } from 'ui';

import type { FC, ReactNode } from 'react';

const subTitleMap = new Map([
  [403, t('common.noPermission')],
  [404, t('common.notFound')],
  [500, t('common.serverError')],
]);

const PageException: FC = () => {
  const navigate = useNavigate();

  const { status, withCard } = useLoaderData() as { status: any; withCard: boolean };

  const goHome = () => {
    navigate('/');
  };

  const WithCard = ({ children }: { children: ReactNode }) => {
    if (withCard) {
      return <Card bordered={false}>{children}</Card>;
    }
    return (
      <div className='flex-center' style={{ height: '100vh' }}>
        {children}
      </div>
    );
  };

  return (
    <WithCard>
      <Result
        // status={status}
        title={status}
        icon={<SvgIcon size={380} name={status} />}
        subTitle={subTitleMap.get(status)}
        extra={
          <Button type='primary' onClick={goHome}>
            {t('common.backToHome')}
          </Button>
        }
      />
    </WithCard>
  );
};

export default PageException;
