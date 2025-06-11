import { ArrowRightOutlined, PlayCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Input, List, Popconfirm, Row, Skeleton, Typography, message } from 'antd';
import { v1DeviceExecuteEvent, v1DeviceReset } from 'apis';
import { t } from 'i18next';

import { useRequest } from 'ahooks';
import { useTheme } from 'antd-style';
import { useRef, type FC } from 'react';
import { useParams } from 'react-router-dom';
import useStyles from '../styles';

const { Text } = Typography;

export interface PProFiles {
  deviceInfo: {
    basicInformation: any[];
    commandInformation: any[];
    communicationTypeConfiguration: any[];
    interactiveInterfaceConfiguration: any[];
    realTimeInformation: any[];
  };
  loading: boolean;
  signaRdevice: any;
}
const ProFile: FC<PProFiles> = ({ deviceInfo = {}, loading = true, signaRdevice }) => {
  const { styles } = useStyles();
  const { id } = useParams();
  const token = useTheme();
  const { runAsync: executeEventAsync } = useRequest(v1DeviceExecuteEvent, {
    manual: true,
  });
  const {
    basicInformation,
    commandInformation,
    communicationTypeConfiguration,
    interactiveInterfaceConfiguration,
    realTimeInformation,
  } = deviceInfo;

  const { runAsync: resetAsync } = useRequest(
    () => {
      return v1DeviceReset(id);
    },
    {
      manual: true,
      onSuccess: (res) => {
        message.success(t('global.device.resetSuccess'));
      },
    },
  );

  const floorRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Row gutter={[12, 12]}>
        {commandInformation?.length ? (
          <Col span={6}>
            <Flex gap={16} vertical>
              {/* <Card title={t('global.device.debug')}> */}
              <Card
                title={<div className='flex justify-between'>{t('global.device.debug')}</div>}
                styles={{
                  header: {
                    paddingRight: '14px',
                  },
                }}
                extra={
                  <Popconfirm
                    title={t('global.device.resetConfirm')}
                    onConfirm={async () => {
                      await resetAsync();
                    }}
                  >
                    <Button shape='circle' icon={<RedoOutlined />}></Button>
                  </Popconfirm>
                }
              >
                <List itemLayout='horizontal' className='px-2' loading={loading}>
                  {/* <List.Item actions={[<Switch checkedChildren='开启' unCheckedChildren='关闭' defaultChecked />]}>
                    <List.Item.Meta avatar={''} title={'门控'} />
                  </List.Item>
                  <List.Item actions={[<Input style={{ width: '120px' }} addonAfter={<ArrowRightOutlined />} />]}>
                    <List.Item.Meta avatar={''} title={'去往楼层'} />
                  </List.Item>
                  <List.Item actions={[<Button type='primary' size='small' shape='circle' icon={<BulbOutlined />} />]}>
                    <List.Item.Meta avatar={''} title={'复位'} />
                  </List.Item> */}
                  {commandInformation?.map((item) => {
                    const {
                      title,
                      id,
                      uiElementType,
                      eventIdentifier,
                      arguments: extendField = [],
                      regexPattern,
                    } = item;
                    if (uiElementType === 'Command') {
                      if (extendField.length) {
                        return (
                          <List.Item
                            actions={[
                              <Input
                                size='small'
                                style={{ width: '100px' }}
                                ref={floorRef}
                                disabled={!signaRdevice?.isConnected}
                                addonAfter={
                                  <ArrowRightOutlined
                                    onClick={() => {
                                      const floor = floorRef?.current?.input?.value;
                                      if (!signaRdevice?.isConnected) return;
                                      if (!/^[+-]?\d*\.?\d+$/.test(floor)) {
                                        message.warning(t('global.device.floorInfo'));
                                        return;
                                      }
                                      executeEventAsync(signaRdevice?.deviceName, {
                                        eventName: eventIdentifier,
                                        args: [floor],
                                      });
                                    }}
                                  />
                                }
                              />,
                            ]}
                          >
                            <List.Item.Meta avatar={''} title={title} />
                          </List.Item>
                        );
                      }
                      return (
                        <List.Item
                          actions={[
                            <Button
                              size='small'
                              shape='circle'
                              icon={<PlayCircleOutlined />}
                              disabled={!signaRdevice?.isConnected}
                              onClick={() => {
                                executeEventAsync(signaRdevice?.deviceName, {
                                  eventName: eventIdentifier,
                                });
                              }}
                            />,
                          ]}
                        >
                          <List.Item.Meta avatar={''} title={title} />
                        </List.Item>
                      );
                    }
                  })}
                </List>
              </Card>
            </Flex>
          </Col>
        ) : null}
        <Col span={commandInformation?.length ? 18 : 24}>
          <Flex gap={12} vertical>
            <Card
              styles={{
                body: {
                  backgroundColor: token.colorBgLayout,
                },
              }}
              title={
                <Flex justify={'space-between'} align='center' gap={16}>
                  <List>
                    <List.Item key='1'>
                      <List.Item.Meta
                        title={<div className='text-base'>{t('global.device.baseInfo')}</div>}
                        // description={
                        //   <div className='flex gap-4'>
                        //     <div>创建时间：2025/05/02 </div>
                        //     <div>更新时间：2025/05/02</div>
                        //   </div>
                        // }
                      />
                    </List.Item>
                  </List>
                </Flex>
              }
            >
              <Row gutter={[12, 12]} className='p-2'>
                {loading
                  ? Array.from({ length: 5 }).map((item, index) => {
                      return (
                        <Col className='flex justify-between shadow-sm p-2' span={6}>
                          <Skeleton.Button size='small' active block />
                        </Col>
                      );
                    })
                  : basicInformation?.map((item) => {
                      const { uiElementType } = item;
                      return (
                        <Col span={uiElementType === 'RichTextBox' ? 24 : 8}>
                          <div className='p-2 flex justify-between shadow-sm'>
                            <div className='font-bold'>{item?.title}：</div>
                            <span>{item?.value ?? '-'}</span>
                          </div>
                        </Col>
                      );
                    })}
              </Row>
            </Card>
            <Card
              title={t('global.device.connectInfo')}
              styles={{
                body: {
                  backgroundColor: token.colorBgLayout,
                },
              }}
            >
              <Row gutter={[12, 12]} className='p-2'>
                {loading
                  ? Array.from({ length: 5 }).map((item, index) => {
                      return (
                        <Col className='flex justify-between shadow-sm p-2' span={6}>
                          <Skeleton.Button size='small' active block />
                        </Col>
                      );
                    })
                  : communicationTypeConfiguration?.map((item) => {
                      return (
                        <Col span={8}>
                          <div className='p-2 flex justify-between shadow-sm'>
                            <div className='font-bold'>{item?.title}：</div>
                            <span>{item?.value ?? '-'}</span>
                          </div>
                        </Col>
                      );
                    })}
              </Row>
            </Card>
            {interactiveInterfaceConfiguration?.length ? (
              <Card
                title={t('global.device.controlInfo')}
                styles={{
                  body: {
                    backgroundColor: token.colorBgLayout,
                  },
                }}
              >
                <Row gutter={[12, 12]} className='p-2'>
                  {loading
                    ? Array.from({ length: 5 }).map((item, index) => {
                        return (
                          <Col className='flex justify-between shadow-sm p-2' span={6}>
                            <Skeleton.Button size='small' active block />
                          </Col>
                        );
                      })
                    : interactiveInterfaceConfiguration?.map((item) => {
                        const { title, value, id } = item;
                        let extendFieldValue = '';
                        if (id) {
                          const [signalRField, field] = id.split('.');
                          extendFieldValue = signaRdevice?.[signalRField]?.[field] ?? '' + '';
                        }
                        return (
                          <Col span={8}>
                            <div className='p-2 flex justify-between shadow-sm'>
                              <div className='font-bold'>{title}：</div>
                              <div className='flex items-center gap-4'>
                                {value ?? '-'} <span>{extendFieldValue}</span>
                              </div>
                            </div>
                          </Col>
                        );
                      })}
                </Row>
              </Card>
            ) : null}
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default ProFile;
