import { MenuItem, MenuList, Paper, ThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ISubTaskItem } from '../index.d';

interface IMouseEvent {
  id: string;
  hashMap: Record<string, any>;
  handleAction: (type: ISubTaskItem['task_type']) => void;
}
function MouseEvent(props: IMouseEvent) {
  const { id, hashMap: _hashMap, handleAction } = props;
  const { t } = useTranslation();
  const type = useMemo(() => {
    return _hashMap[id]?.type;
  }, [id]);

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
      <Paper>
        <MenuList sx={{ '& .MuiMenuItem-root': { justifyContent: 'center' } }}>
          {type === 1 && (
            <>
              <MenuItem
                dense
                divider
                sx={{ fontSize: 15, textAlign: 'center' }}
                onClick={() => {
                  handleAction && handleAction('Pick');
                }}
              >
                {t('取货')}
              </MenuItem>
              <MenuItem
                dense
                divider
                sx={{ fontSize: 15, textAlign: 'center' }}
                onClick={() => {
                  handleAction && handleAction('Place');
                }}
              >
                {t('放货')}
              </MenuItem>
            </>
          )}
          {type === 6 && (
            <MenuItem
              dense
              divider
              sx={{ fontSize: 15, textAlign: 'center' }}
              onClick={() => {
                handleAction && handleAction('Charge');
              }}
            >
              {t('充电')}
            </MenuItem>
          )}
          <MenuItem
            dense
            divider
            sx={{ fontSize: 15, textAlign: 'center' }}
            onClick={() => {
              handleAction && handleAction('Null');
            }}
          >
            {t('移动')}
          </MenuItem>
        </MenuList>
      </Paper>
    </ThemeProvider>
  );
}

export default MouseEvent;
