import PageLoading from '@/components/PageLoading';
import { PlusOutlined } from '@ant-design/icons';
import { useLatest, useRequest } from 'ahooks';
import { Button, List, Typography } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import InputWidthKeyboard from '../../Hybrid/components/inputWithKeyboard';
import MwConfirm from '../../Hybrid/components/MwConfirm';
import { relocatePoint } from '../../Hybrid/service';
import { useHybirdStore } from '../../Hybrid/store/hybird.store';

const { Title, Text } = Typography;
const OnlinePoint = () => {
  const { t, i18n } = useTranslation();
  const { setOnlineData } = useHybirdStore(
    useShallow((store) => {
      return {
        setOnlineData: store.setOnlineData,
      };
    }),
  );
  const [linePoint, setLinePoint] = React.useState([]);
  const {
    data: onlinePoint,
    loading,
    runAsync: run,
  } = useRequest(relocatePoint, {
    manual: true,
  });

  const getLinePoint = async () => {
    const res: any = await run({ cmd_type: 4 });
    if (res.error_code === 10000) {
      setLinePoint(res.point_list);
      setOnlineData(res);
    } else {
      res?.error_description && toast.error(res?.error_description);
      // toast.error(t('获取上线点失败'));
    }
  };
  React.useEffect(() => {
    getLinePoint();
  }, []);

  const generate = React.useMemo(() => {
    return (
      <List
        size="small"
        dataSource={linePoint}
        renderItem={(item: any) => (
          <List.Item
            key={item.point_id}
            actions={[
              <Button
                type='link'
                size='small'
                key="online"
                onClick={() => {
                  MwConfirm.confirm({
                    title: t('deployer.hybrid.online') as string,
                    content: t('deployer.hybrid.isOnline'),
                    onOk: async () => {
                      const res: any = await run({
                        cmd_type: 3,
                        point_id: item.point_id,
                      });
                      if (res.error_code === 10000) {
                        toast.success(t('common.actionSuccess'));
                      } else {
                        toast.error(t('common.actionFail'));
                      }
                    },
                  });
                }}
              >
                {t('deployer.hybrid.online')}
              </Button>,
              <Button
                type='link'
                danger
                size='small'
                key="delete"
                onClick={() => {
                  MwConfirm.confirm({
                    title: t('common.delete') as string,
                    content: t('deployer.hybrid.isDelete'),
                    onOk: async () => {
                      const res: any = await run({
                        cmd_type: 2,
                        point_id: item.point_id,
                      });
                      if (res.error_code === 10000) {
                        toast.success(t('common.actionSuccess'));
                        getLinePoint();
                      } else {
                        toast.error(t('common.actionFail'));
                      }
                    },
                  });
                }}
              >
                {t('common.delete')}
              </Button>
            ]}
          >
            <Text>{item.point_id}</Text>
          </List.Item>
        )}
      />
    );
  }, [linePoint, i18n.language]);

  const [newPoint, setNewPoint] = React.useState();
  const latestInputText = useLatest(newPoint);

  const addPoint = async () => {
    MwConfirm.confirm({
      title: t('deployer.hybrid.onlineId') as string,
      content: (
        <>
          <InputWidthKeyboard
            mode='numbers'
            input={''}
            placeholder={t('common.plsInput')}
            setInput={setNewPoint}
          ></InputWidthKeyboard>
        </>
      ),

      onOk: async () => {
        const addFloorNumber = Number(latestInputText.current);
        const res: any = await run({
          cmd_type: 1,
          point_id: addFloorNumber,
        });
        if (res.error_code === 10000) {
          toast.success(t('common.actionSuccess'));
          getLinePoint();
        } else {
          toast.error(t('deployer.hybrid.addFail'));
        }
      },
    });
  };
  return (
      <div className='w-full'>
        <Title level={5} className='!mt-2 !mb-2 flex justify-between items-center'>
          {t('deployer.hybrid.onlineList')}
          <Button type="text" icon={<PlusOutlined />} onClick={addPoint} />
        </Title>
        {loading ? (
          <PageLoading></PageLoading>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {generate}
          </div>
        )}
      </div>
  );
};

export default OnlinePoint;
