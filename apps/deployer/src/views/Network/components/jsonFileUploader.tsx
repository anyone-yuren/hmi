import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, message, Modal } from 'antd';
import React, { useRef } from 'react';
import { postImportPortList } from '../services';

const JsonFileUploader: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [modal, contextHolder] = Modal.useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { run: importPortList, loading: uploadLoading } = useRequest(postImportPortList, {
    manual: true,
    onSuccess: () => {
      message.success('导入成功！');
      onSuccess?.();
    },
    onError: (err) => {
      message.error(err?.message || '导入失败');
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      message.error('请选择一个 JSON 文件！');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          message.warning('JSON 文件格式不正确，应为数组结构！');
          return;
        }

        modal.confirm({
          title: '确认导入这些规则吗？',
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
          okText: '确认导入',
          cancelText: '取消',
          onOk: () => {
            importPortList({ port_forwarding_list: data });
          },
        });
      } catch {
        message.error('JSON 解析失败，请检查文件内容！');
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
        上传
      </Button>
      {contextHolder}
    </>
  );
};

export default JsonFileUploader;
