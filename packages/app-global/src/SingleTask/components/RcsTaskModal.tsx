import {
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RenderItemRow } from '../Style';
const RcsTaskModal = (props: any) => {
  const { rows, mode } = props;
  const { t } = useTranslation();
  const isTask = useMemo(() => {
    return mode === 'task';
  }, [mode]);
  const missionItemHashMap = {
    type: {
      0: t('common.taskState.moving'),
      1: t('common.taskState.pickUp'),
      2: t('common.taskState.pickDown'),
      3: t('common.taskState.charging'),
    },
    state: {
      1: t('common.taskStatus.unexecuted'),
      0: t('common.taskStatus.running'),
    },
  };
  return (
    <div className='bg-[white]'>
      <RenderItemRow>
        <ThemeProvider
          theme={createTheme({
            palette: {
              mode: 'light',
              primary: {
                main: '#00D1D1',
              },
            },
            typography: {
              fontSize: 20,
            },
          })}
        >
          <TableContainer sx={{ maxHeight: '450px' }}>
            <Table size='medium' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>{t('deployer.singleTask.point')}</TableCell>
                  <TableCell align='center'>{t('deployer.singleTask.taskType')}</TableCell>
                  {false && isTask && <TableCell align='center'>{t('deployer.singleTask.restCount')}</TableCell>}
                  {isTask && <TableCell align='center'>{t('common.status')}</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <TableRow key={row?.id}>
                      <TableCell align='center'>{row?.point}</TableCell>
                      <TableCell align='center'>{missionItemHashMap['type'][row?.type]}</TableCell>
                      {false && isTask && <TableCell align='center'>{row?.loop}</TableCell>}
                      {isTask && <TableCell align='center'>{missionItemHashMap.state[row?.state]}</TableCell>}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </ThemeProvider>
      </RenderItemRow>
    </div>
  );
};

export default RcsTaskModal;
