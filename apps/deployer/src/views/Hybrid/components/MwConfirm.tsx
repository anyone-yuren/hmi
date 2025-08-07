import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { t } from 'i18next';
import * as React from 'react';
import ReactDOM from 'react-dom';

const MwModal = (props: any) => {
  const { content, contentText = '', visible = false, title = '', onCancel, onOk } = props;
  const [open, setOpen] = React.useState(visible);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    onCancel && onCancel();
    setOpen(false);
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      onOk && (await onOk());
      setConfirmLoading(false);
      setOpen(false);
    } catch (error) {
      setConfirmLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
      hideBackdrop
    >
      <DialogTitle
        id='alert-dialog-title'
        style={{
          fontSize: '24px',
          padding: '30px 24px 0px 24px',
          color: '#3D3D3D',
          textAlign: 'center',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent className='text-center' style={{ width: '400px', fontSize: '18px', color: '#666666' }}>
        {content ? (
          content
        ) : (
          <DialogContentText
            id='alert-dialog-description'
            sx={{
              fontSize: 22,
              color: '#666666',
              textAlign: 'center',
              paddingBottom: '20px',
            }}
          >
            {contentText}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex' }}>
        <Button onClick={handleClose} style={{ flex: 1, fontSize: '18px', color: '#888888' }}>
          {t('common.cancel')}
        </Button>
        <div
          style={{
            width: '1px',
            height: '48px',
            background: 'rgba(0, 0, 0, 0.1)',
          }}
        ></div>
        <LoadingButton
          loading={confirmLoading}
          onClick={handleConfirm}
          style={{ flex: 1, color: '#00D1D1', fontSize: '18px' }}
        >
          {confirmLoading ? null : t('common.confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

MwModal.displayName = 'MwModal';

interface IModalConfig {
  title?: string;
  contentText?: string;
  content?: React.ReactNode | string;
  onOk?: () => void;
  onCancel?: () => void;
}

const confirm = (config: IModalConfig) => {
  // 把props传进去然后render到body上
  const container = document.createDocumentFragment();
  const modal = ReactDOM.createRoot(container);
  modal.render(<MwModal visible={true} {...config}></MwModal>);
};

MwModal.confirm = confirm;

export default MwModal;
