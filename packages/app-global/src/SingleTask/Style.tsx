import { Box, IconButton, Select, styled } from '@mui/material';
import GlobalPanel from './components/GlobalPanel';

export const SubTaskContainer = styled('div')(() => ({
  background: 'rgba(0, 209, 209, 0.1)',
  padding: '5px 5px 0px 5px',
  margin: '0px 0px 0px 0px',
  display: 'flex',
  gap: '5px',
  // flexDirection: 'column',
  borderRadius: '10px',
  '.header': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '.title': {
      fontSize: '14px',
      color: 'white',
    },
    '.iconGroup': {
      display: 'flex',
      alignItems: 'center',
    },
  },
}));
export const TaskPanelContainer = styled('div')(() => ({
  position: 'absolute',
  width: 350,
  height: 'calc(100vh - 40px)',
  backgroundColor: 'white',
  top: 0,
  right: 0,
  zIndex: 10,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  margin: 20,
  '.taskPanelHeader': {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    '.title': {
      color: 'black',
      flex: 1,
      fontSize: 20,
    },
  },
  '.taskPanelAction': {
    minHeight: 300,
    flexShrink: 0,
    color: 'black',
  },
  '.taskPanelList': {
    flex: 1,
    color: 'black',
    overflow: 'scroll',
    position: 'relative',
    '.taskPanelListHeader': {
      display: 'flex',
      position: 'sticky',
      top: 0,
      gap: 10,
      padding: '5px 0 5px 0',
      background: '#ccc',
      div: {
        flex: 1,
        textAlign: 'center',
      },
    },
    '.taskPanelListItem': {
      display: 'flex',
      gap: 10,
      padding: '5px 0 5px 0',
      div: {
        flex: 1,
        textAlign: 'center',
        background: '#ccc',
      },
    },
  },
}));
export const TaskIconContainer = styled('div')(() => ({
  position: 'absolute',
  background: '#00D1D1',
  height: '50px',
  width: '50px',
  borderRadius: '50px',
  right: -45,
  top: '50%',
  transform: 'translate(0%, -50%)',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '3px',
  zIndex: 1211,
}));

export const InputGroup = styled('div')(() => ({
  height: 50,
  background: '#d8d8d833',
  borderRadius: 5,
  padding: '0px 10px 0px 10px',
  margin: '0px 0px 0px 0px',
  flex: 1,
  flexShrink: 0,
  width: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '.title': {
    color: 'white',
    opacity: '0.5',
    fontSize: 14,
    whiteSpace: 'nowrap',
    overflow: 'scroll',
  },
  '.content': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export const TaskItem = styled('div')(() => ({
  height: 50,
  background: 'rgba(0, 209, 209, 0.1)',
  borderRadius: 5,
  padding: '0px 10px 0px 10px',
  margin: '0px 0px 10px 0px',
  flex: 1,
  flexShrink: 0,
  width: '100%',
  display: 'flex',
  // flexDirection: 'column',
  justifyContent: 'center',
  '.title': {
    color: 'white',
    fontSize: 14,
    display: 'flex',
    justifyContent: 'space-between',
  },
  '.content': {
    fontSize: 14,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export const IconStyleButton: any = styled(IconButton)(({ theme, bottom, notActive }: any) => ({
  width: '50px',
  height: '50px',
  zIndex: theme.zIndex.drawer + 1,
  color: notActive ? theme.palette.primary.main : '#fff',
  backgroundColor: notActive ? '#fff' : theme.palette.primary.main,
  '&:hover': {
    backgroundColor: notActive ? '#fff' : theme.palette.primary.main,
  },
}));

export const MapTaskSelect: any = styled(Select)(() => ({
  border: 'none',
  width: '100%',
  color: 'white',
  textIndent: 0,
  fontSize: '16px',
  marginTop: 0,
  '& .MuiOutlinedInput-notchedOutline': {
    display: 'none',
  },
  '& .MuiSelect-select': {
    padding: '0px 0px 0px 0px!important',
  },
  '& .MuiSvgIcon-root': {
    right: 0,
  },
}));

export const MapContainer: any = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  flexDirection: 'column',
  overflow: 'hidden',
}));

export const MapTaskPanel: any = styled('div')(() => ({
  position: 'relative',
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  gap: 5,
}));

export const MapTaskPopup: any = styled(GlobalPanel)(() => ({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 1212,
  width: 360,
}));

export const MapTaskPanelHeader: any = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const MapTaskPanelAction: any = styled('div')(() => ({
  flex: 3,
  height: 0,
  display: 'flex',
  flexDirection: 'column',
  '.listContainer': {
    flex: 1,
    overflow: 'scroll',
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
    position: 'relative',
  },
}));

export const MapTaskPanelList: any = styled('div')(() => ({
  flex: 2,
  flexShrink: 0,
  overflowY: 'scroll',
  position: 'relative',
}));

export const MapTaskPanelListHeader: any = styled('div')(() => ({
  fontSize: 18,
  marginBottom: 5,
  position: 'sticky',
  top: 0,
  background: '#445260',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
export const MapTaskPanelEmptyContainer: any = styled('div')(() => ({
  background: '#fff',
  minHeight: '150px',
  div: {
    width: '100px',
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, 0%)',
  },
}));

export const RenderItemRow = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  color: '#fff',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  // margin: "10px 0",
  width: '100%',
  padding: '20px!important',
  height: 'calc(100% - 60px)',
  justifyContent: 'flex-start',
  background: '#ffffff',
  '&& p': {
    padding: '0',
    margin: '0',
    fontSize: '1.5rem',
    color: '#000',
  },
}));

export const generateUniqueId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
