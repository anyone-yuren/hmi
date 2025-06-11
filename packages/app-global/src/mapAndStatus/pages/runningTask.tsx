import { CarOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { useRcsDictByName } from '@gbeata/hooks';
import { Badge, Button, List, Space, Spin } from 'antd';
import { useAntdToken } from 'antd-style';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TaskProcess from './taskProcess';
const VehicleStatus = ({ loading, rcsList }) => {
  const token = useAntdToken();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [guid, setGuid] = useState<string>('');
  const missionType = useRcsDictByName('missionType');
  const platformSource = useRcsDictByName('platformSource');

  const platformSourceColor = [token.colorPrimary, token.colorError, token.colorWarning, token.colorInfo];

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  return (
    <>
      {loading ? (
        <Spin className='flex h-full justify-center items-center'></Spin>
      ) : (
        <List
          itemLayout='vertical'
          size='small'
          dataSource={rcsList}
          // footer={
          //   <div>
          //     <b>ant design</b> footer part
          //   </div>
          // }
          renderItem={(item) => (
            <Badge.Ribbon
              text={platformSource?.find((node) => node.value === item.platformSource)?.label}
              color={platformSourceColor[item.platformSource - 1] ?? ''}
            >
              <List.Item
                key={item.title}
                actions={[
                  <IconText icon={CarOutlined} text={`${item.vehicleNums}`} key='list-vertical-star-o' />,
                  <IconText
                    icon={DeploymentUnitOutlined}
                    text={`${t('common.vehicle.type')}: ${missionType?.find((node) => node.value === item.missionType)?.label}`}
                    key='list-vertical-like-o'
                  />,
                  <Button
                    color='primary'
                    className='text-xs py-1 h-5'
                    size='small'
                    variant='outlined'
                    onClick={() => {
                      setOpen(true);
                      setGuid(item.id);
                    }}
                  >
                    {t('common.vehicle.process')}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  className='!mb-2'
                  title={
                    <a href={item?.href}>
                      {t('common.vehicle.No')}:{item?.taskCode ?? '-'}
                    </a>
                  }
                  description={
                    <div className='flex gap-2 flex-col'>
                      {/* <div>
                        {t('common.vehicle.description')}：{item?.description}
                      </div> */}
                      <div>
                        {t('common.vehicle.activeTime')}: {dayjs(item?.activedTime).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            </Badge.Ribbon>
          )}
        />
      )}
      <TaskProcess
        guid={guid}
        open={open}
        closeFn={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
export default VehicleStatus;
