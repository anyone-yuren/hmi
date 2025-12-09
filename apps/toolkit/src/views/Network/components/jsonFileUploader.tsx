import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, message, Modal } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { postImportPortList } from '../services';

const JsonFileUploader: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { run: importPortList, loading: uploadLoading } = useRequest(postImportPortList, {
    manual: true,
    onSuccess: () => {
      message.success(t('common.exportSuccess'));
      onSuccess?.();
    },
    onError: (err) => {
      message.error(err?.message || t('deployer.network.failedImport'));
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      message.error(t('deployer.network.invalidJson'));
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          message.warning(t('deployer.network.invalidJsonFormat'));
          return;
        }

        modal.confirm({
          title: t('deployer.network.confirmImport'),
          content: (
            <div
              style={{ maxHeight: 200, overflowY: 'auto' }}
              className='rounded-xl bg-black text-white p-2'
              onClick={(e) => e.stopPropagation()} // ✅ 阻止冒泡
            >
              <pre>{JSON.stringify(data.slice(0, 5), null, 2)}</pre>
              {data.length > 5 && <div>... 共 {data.length} 条</div>}
            </div>
          ),
          okText: t('common.confirm'),
          cancelText: t('common.cancel'),
          onOk: () => {
            importPortList({ port_forwarding_list: data });
          },
        });
      } catch {
        message.error(t('deployer.network.parseJsonFailed'));
      }
    };
    reader.readAsText(file);

    // 清空 input，以便可再次上传同一文件
    event.target.value = '';
  };

  return (
    <>
      <input ref={fileInputRef} type='file' accept='.json' style={{ display: 'none' }} onChange={handleFileChange} />
      <Button
        size='small'
        icon={<UploadOutlined />}
        loading={uploadLoading}
        onClick={() => fileInputRef.current?.click()}
      >
        {t('common.upload')}
      </Button>
      {contextHolder}
    </>
  );
};

export default JsonFileUploader;
