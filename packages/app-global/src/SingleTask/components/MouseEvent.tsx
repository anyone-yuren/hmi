import { MenuItem, MenuList, Paper, ThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ISubTaskItem } from '../index.d';

interface IMouseEvent {
  id: string;
  hashMap: Record<string, any>;
  handleAction: (type: ISubTaskItem['task_type']) => void;
}

const menuItemStyle = { fontSize: 15, textAlign: 'center' };
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
                sx={menuItemStyle}
                onClick={() => {
                  handleAction && handleAction('Pick');
                }}
              >
                {t('deployer.singleTask.pick')}
              </MenuItem>
              <MenuItem
                dense
                divider
                sx={menuItemStyle}
                onClick={() => {
                  handleAction && handleAction('Place');
                }}
              >
                {t('deployer.singleTask.place')}
              </MenuItem>
            </>
          )}
          {type === 6 && (
            <MenuItem
              dense
              divider
              sx={menuItemStyle}
              onClick={() => {
                handleAction && handleAction('Charge');
              }}
            >
              {t('deployer.singleTask.charge')}
            </MenuItem>
          )}
          <MenuItem
            dense
            divider
            sx={menuItemStyle}
            onClick={() => {
              handleAction && handleAction('Null');
            }}
          >
            {t('deployer.singleTask.move')}
          </MenuItem>
          <MenuItem
            dense
            divider
            sx={menuItemStyle}
            onClick={() => {
              handleAction && handleAction('Offset');
            }}
          >
            {t('deployer.singleTask.offset')}
          </MenuItem>
          <MenuItem
            dense
            divider
            sx={menuItemStyle}
            onClick={() => {
              handleAction && handleAction('Info');
            }}
          >
            {t('deployer.singleTask.info')}
          </MenuItem>
        </MenuList>
      </Paper>
    </ThemeProvider>
  );
}

export default MouseEvent;
