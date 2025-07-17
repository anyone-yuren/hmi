import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useRequest } from 'ahooks';
import YAML from 'js-yaml';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyBox from './components/empty';
import { EmptyBoxDiv, ErrDiv, InputCell, StatusCell, SuccessDiv, TableBox } from './components/style';
import WsContainer from './components/wsContainer';
import { getConfig_h7 } from './services';
const Io = () => {
  const { t } = useTranslation();
  const {
    data: IoResponse,
    mutate: updateIoResponse,
    loading,
  } = useRequest<any, any>(getConfig_h7, {
    onSuccess: (response) => {
      updateIoResponse(YAML.load(response)); // 倒反天罡
    },
  });
  const translateIo = (obj: any[]) => {
    if (!obj || !Object.keys(obj).length) return [];
    return Object.keys(obj).map((item) => {
      const [port, state, title] = obj[item];
      return { port, state, title, ioKey: item };
    });
  };
  const renderHashMap = useMemo(() => {
    return {
      ioInputConfig: translateIo(IoResponse?.io_input_config),
      ioOutputConfig: translateIo(IoResponse?.io_output_config),
    };
  }, [IoResponse]);

  const titleHashMap = useMemo(() => {
    return {
      ioInputConfig: t('输入'),
      ioOutputConfig: t('输出'),
    };
  }, []);

  const ioWssChange = (response) => {
    if (!IoResponse) return;
    const obj = { ...IoResponse };
    Object.keys(response).forEach((key) => {
      Object.keys(response[key])?.forEach((childKey) => {
        if (obj?.[key]?.[childKey]) {
          obj[key][childKey][1] = response[key][childKey] ? 1 : 0;
        }
      });
    });
    updateIoResponse(obj);
  };

  return (
    <div className='p-[20px] flex gap-[20px] h-full'>
      {!loading && <WsContainer ioWssChange={ioWssChange}></WsContainer>}
      {['ioInputConfig', 'ioOutputConfig']?.map((key) => {
        return (
          <div
            key={key}
            className='flex-1 h-full relative bg-[#445260] rounded-[20px] overflow-auto px-[20px]'
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              overflowY: 'scroll',
            }}
          >
            {key === 'ioInputConfig' && (
              <span className='top-[4px] absolute z-10 text-[12px] text-[#a2a9b0]'>
                {'提示：灰色为未触发，绿色为触发'}
              </span>
            )}
            <TableBox stickyHeader aria-label='simple table' className=''>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>{t('状态')}</TableCell>
                  <TableCell align='left' sx={{ color: '#FFE500!important' }}>
                    {titleHashMap[key]}
                  </TableCell>
                  <TableCell align='center'>{t('端口号')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='relative'>
                {renderHashMap[key]?.length ? (
                  renderHashMap[key]?.map((row, index) => (
                    <TableRow key={index}>
                      <StatusCell align='center'>{row.state ? <SuccessDiv /> : <ErrDiv />}</StatusCell>
                      <InputCell align='left'>
                        <p>{row.title}</p>
                      </InputCell>
                      <TableCell align='center'>{row.port}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyBoxDiv>
                    <EmptyBox title={t('没有数据')} backgroundColor='transparent'></EmptyBox>
                  </EmptyBoxDiv>
                )}
              </TableBody>
            </TableBox>
          </div>
        );
      })}
    </div>
  );
};
export default memo(Io);
