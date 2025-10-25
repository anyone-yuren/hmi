import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React, { useState } from 'react';

const JsonFileUploader: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);

  // 处理上传
  const props: UploadProps = {
    accept: '.json',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      // 类型检测
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        message.error('请选择一个 JSON 文件！');
        return Upload.LIST_IGNORE;
      }

      // 读取文件内容
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = JSON.parse(text);
          setJsonData(data);
          message.success(`文件 ${file.name} 读取成功`);
        } catch (err) {
          message.error('JSON 解析失败，请检查文件内容是否正确！');
        }
      };
      reader.readAsText(file);

      // 阻止默认上传行为（不上传到服务器）
      return false;
    },
  };

  return (
    <Upload {...props}>
      <Button size='small' icon={<UploadOutlined />}>
        上传
      </Button>
    </Upload>
  );
};

export default JsonFileUploader;
