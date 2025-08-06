import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useRequest } from 'ahooks';
import YAML from 'js-yaml';
import { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyBox from './components/empty';
import { EmptyBoxDiv, ErrDiv, InputCell, StatusCell, SuccessDiv, TableBox } from './components/style';
import WsContainer from './components/wsContainer';
import { getConfig_h7 } from './services';
const Io = () => {
  const { t, i18n } = useTranslation();
  const {
    data: IoResponse,
    mutate: updateIoResponse,
    run: getIoResponse,
    loading,
  } = useRequest<any, any>(getConfig_h7, {
    manual: true,
    onSuccess: (response) => {
      updateIoResponse(YAML.load(response)); // 倒反天罡
    },
  });

  useEffect(() => {
    getIoResponse();
  }, [i18n.language]);
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
      ioInputConfig: t('deployer.io.input'),
      ioOutputConfig: t('deployer.io.output'),
    };
  }, [i18n.language]);

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
      <span className='top-[25px] left-[55px] absolute z-10 text-[12px] text-[#a2a9b0]'>{t('deployer.io.tips')}</span>
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
            <TableBox stickyHeader aria-label='simple table' className=''>
              <TableHead>
                <TableRow>
                  <TableCell align='center' className='min-w-[61px]'>
                    {t('common.status')}
                  </TableCell>
                  <TableCell align='left' sx={{ color: '#FFE500!important' }}>
                    {titleHashMap[key]}
                  </TableCell>
                  <TableCell align='center' className='min-w-[91px]'>
                    {t('deployer.io.port')}
                  </TableCell>
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
                    <EmptyBox title={t('common.noData')} backgroundColor='transparent'></EmptyBox>
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
