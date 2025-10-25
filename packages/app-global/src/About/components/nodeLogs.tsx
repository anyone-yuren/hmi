import { RedoOutlined } from '@ant-design/icons';
import { useRequest, useSize } from 'ahooks';
import { Button, List, Radio, Result, Splitter, Typography } from 'antd';
import VirtualList from 'rc-virtual-list';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import LoadingPage from '../../components/PageLoading/Loading';
import { viewLog } from '../services';

const { Paragraph } = Typography;
interface IProps {
  nodeKey: string;
  node: any[];
  listLoading: boolean;
  refresh: any;
}
const NodeLogs = (props: IProps) => {
  const { node, nodeKey, listLoading, refresh } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [radioValue, setRadioValue] = useState('all');
  const [nodePath, setNodePath] = useState('');
  const [treeLoadHashMap, setTreeLoadHashMap] = useState({});
  const [downloadKey, setDownloadKey] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);

  const {
    data: logInfo,
    loading: logLoading,
    runAsync: getLogInfo,
  } = useRequest((params) => viewLog(params), {
    manual: true,
  });

  const renderList = useMemo(() => {
    const ary = logInfo?.data || [];
    const typeKeys: any = ['info', 'error', 'warning'];
    const typeKeyHashmap: any = {
      info: 'info',
      error: 'danger',
      warning: 'warning',
    };
    // 使用 Map 去重
    const seenTitles = new Map();
    if (typeof ary === 'string') return [];
    return ary
      ?.map((item) => {
        const matchedType = typeKeys.find((key) => new RegExp(`\\[${key.toUpperCase()}\\]`, 'i').test(item));
        return {
          title: item,
          type: typeKeyHashmap[matchedType] || 'info',
        };
      })
      ?.filter((item) => {
        if (seenTitles.has(item.title)) {
          return false; // 已存在，过滤掉
        }
        seenTitles.set(item.title, true); // 标记为已处理
        return radioValue === 'all' ? true : item.type === radioValue;
      });
  }, [logInfo, radioValue]);

  const loadListNode = async (path: string) => {
    setNodePath(path);
    setVisible(true);
    await getLogInfo({ path });
  };

  useEffect(() => {
    setTreeLoadHashMap((origin) => {
      return {
        ...origin,
        [downloadKey]: logLoading,
      };
    });
  }, [logLoading, downloadKey]);

  const handleDownload = async (logData, path) => {
    try {
      // const logData = logInfo?.data;
      if (!logData || logData.length === 0) {
        console.warn('No log data to download');
        return;
      }
      let logContent = '';
      if (typeof logData === 'string') {
        logContent = logData;
      } else if (Array.isArray(logData)) {
        logContent = logData.join('\n');
      } else {
        logContent = JSON.stringify(logData, null, 2);
      }
      const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const fileName = `${(path || nodePath).replace(/\//g, '_').replace('.log', '')}.txt`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download log file:', error);
    }
  };

  return (
    <div
      className='w-full h-full flex'
      style={{
        background: `
          radial-gradient(circle at 60% 90%, #3f6fa199, #0000 60%), 
          radial-gradient(circle at 20px 20px, #2e67a1cc, #0000 25%), 
          #182336
        `,
      }}
    >
      <Splitter className='w-full h-full'>
        <Splitter.Panel defaultSize='30%' min='20%' max='40%'>
          <div className='p-2'>
            <h2 className='text-lg font-bold mb-1 flex items-center justify-between'>
              {t('common.about.loglist')}
              <Button
                type='primary'
                icon={<RedoOutlined />}
                onClick={() => {
                  refresh();
                  setVisible(false);
                }}
              >
                {t('common.refresh')}
              </Button>
            </h2>
            {true && (
              <List
                className='w-full'
                itemLayout='horizontal'
                dataSource={node}
                loading={listLoading}
                renderItem={(item, index) => (
                  <List.Item
                    className='cursor-pointer hover:bg-[#234e70]'
                    onClick={() => loadListNode(`${nodeKey}/${item}`)}
                    actions={[
                      <Button
                        type={'primary'}
                        loading={treeLoadHashMap[item]}
                        onClick={async (e) => {
                          e.stopPropagation();
                          setDownloadKey(item);
                          const { data } = await getLogInfo({ path: `${nodeKey}/${item}` });
                          handleDownload(data, `${nodeKey}/${item}`);
                        }}
                      >
                        {t('common.download')}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <div className='flex items-center gap-2 justify-between'>
                          <div className='px-1 flex items-center gap-1'>{item}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div className='w-full h-full p-2'>
            {visible &&
              (logLoading ? (
                <LoadingPage />
              ) : (
                <div className='p-[2px] w-full h-full rounded-lg bg-gradient-to-r from-[#234e70] to-teal-400 relative flex flex-col gap-2'>
                  <div className='flex items-center justify-between p-2 bg-black/40 shadow-sm rounded-lg'>
                    <p className='m-0'>{nodePath}</p>
                    <div className='flex gap-2'>
                      {/* <Button type={'primary'} onClick={()=>{
                        handleDownload(logInfo?.data)
                      }}>
                        {t('common.download')}
                      </Button> */}
                      <Radio.Group
                        value={radioValue}
                        buttonStyle='solid'
                        onChange={(event) => {
                          setRadioValue(event.target.value);
                        }}
                      >
                        <Radio.Button value='all'>{t('common.all')}</Radio.Button>
                        <Radio.Button value='danger' className='text-[#ff4d4f]'>
                          {t('common.error')}
                        </Radio.Button>
                        <Radio.Button value='warning' className='text-[#faad14]'>
                          {t('common.warn')}
                        </Radio.Button>
                        <Radio.Button value='info' className='text-[#409eff]'>
                          {t('common.info')}
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                  <div className='bg-black/80 rounded-lg w-full h-full p-2 overflow-y-auto flex-1'>
                    {renderList?.length ? (
                      <div ref={containerRef} className='h-full'>
                        <VirtualList data={renderList} itemHeight={44} height={671} itemKey={'title'}>
                          {(item: any) => (
                            <Paragraph
                              className='!mb-2'
                              type={item.type}
                              style={{ whiteSpace: 'pre-wrap' }}
                            >{`${item.title}`}</Paragraph>
                          )}
                        </VirtualList>
                      </div>
                    ) : (
                      <Result icon={<SvgIcon size={320} name={'noLog'} />} title={t('common.about.nolog')}></Result>
                    )}
                  </div>
                </div>
              ))}
            {!visible && (
              <Result
                icon={<SvgIcon size={320} name={'noLog'} />}
                title={t('common.about.nolog')}
                subTitle={t('common.about.choose')}
                // extra={
                //   <Button type='primary' onClick={() => setVisible(true)}>
                //     {t('common.choose')}
                //   </Button>
                // }
              ></Result>
            )}
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default NodeLogs;
