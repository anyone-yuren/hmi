import { DeploymentUnitOutlined } from '@ant-design/icons';
import { useDict, useRcsDictByName } from '@gbeata/hooks';
import { Button, List, Space, Spin } from 'antd';
import { useAntdToken } from 'antd-style';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TaskProcess from './taskProcess';
const VehicleStatus = ({ loading, wmsList }) => {
  const token = useAntdToken();
  const { t } = useTranslation();
  const missionOptions = useDict('MissionState');
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
          dataSource={wmsList}
          // footer={
          //   <div>
          //     <b>ant design</b> footer part
          //   </div>
          // }
          renderItem={(item) => (
            <>
              <List.Item
                key={item.title}
                actions={[
                  // <IconText icon={<>容器</>} text={`${item?.containerNo}`} key='list-vertical-star-o' />,
                  <div>容器：{item?.containerNo}</div>,
                  <IconText
                    icon={DeploymentUnitOutlined}
                    text={`${t('common.vehicle.type')}: ${missionOptions?.find((node) => node.value === item.state)?.label}`}
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
                      {t('common.vehicle.No')}:{item?.no ?? '-'}
                    </a>
                  }
                  description={
                    <div className='flex gap-2 flex-col'>
                      {/* <div>
                        {t('common.vehicle.description')}：{item?.description}
                      </div> */}
                      <div>
                        <div className='flex justify-between items-center'>
                          <div>取货位置：{item?.fromSlotNo}</div>
                          <div>放货位置：{item?.toSlotNo}</div>
                        </div>
                        {t('common.vehicle.activeTime')}: {dayjs(item?.activedTime).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            </>
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
