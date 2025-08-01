import { ThemeProvider } from '@emotion/react';
import { Button, createTheme } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { FC, PropsWithChildren } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import EmptyBox from '../components/Empty';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: any) => string;
}

interface ITempTaskListProps {
  data: any[];
  onDelete: (index: number) => void;
}

const TempTaskList: FC<PropsWithChildren<ITempTaskListProps>> = (props) => {
  const { data, onDelete } = props;
  const { t } = useTranslation();
  const columns: readonly Column[] = [
    { id: 'name', label: t('名称'), minWidth: 100, align: 'center' },
    {
      id: 'low_height',
      label: t('进叉高度'),
      minWidth: 100,
      align: 'center',
    },
    {
      id: 'high_height',
      label: t('出叉高度'),
      minWidth: 100,
      align: 'center',
    },
  ];
  return (
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
      <TableContainer
        sx={{
          position: 'relative',
          // height: "100%",
          overflowY: 'auto',
          border: '1px solid rgb(216 216 216 / 100%)',
          color: 'black',
          maxHeight: '450px',
        }}
      >
        <Table stickyHeader aria-label='sticky table' size='small'>
          <TableHead>
            <TableRow sx={{}}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    borderBottomColor: 'rgb(216 216 216 / 100%)',
                    fontSize: 20,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell
                align='center'
                sx={{
                  borderBottomColor: 'rgb(216 216 216 / 100%)',
                  fontSize: 20,
                }}
              >
                {t('操作')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{
                            fontSize: 20,
                          }}
                        >
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                    <TableCell align='center'>
                      <Button
                        onClick={() => {
                          onDelete(index);
                        }}
                        sx={{
                          fontSize: 20,
                        }}
                        color='error'
                      >
                        {t('删除')}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '85%',
                  position: 'absolute',
                }}
              >
                <EmptyBox title={t('没有任务数据')} iconColor='#000' titleColor='#000'></EmptyBox>
              </div>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default memo(TempTaskList);
