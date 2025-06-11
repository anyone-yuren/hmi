import { Button, Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { usePadStore } from '@gbeata/store';
import { ScanOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { memo, useEffect } from 'react';

interface IProps extends SelectProps {
  scannerKey?: string;
  onSearch?: () => void;
  onScannerCallback?: (code: any) => void;
}

function ScannerSelect({ onSearch, scannerKey, onScannerCallback, ...props }: IProps) {
  const { setScannerKey, scannerMap } = usePadStore();

  const handleSearch = () => {
    onSearch?.();

    // @ts-ignore
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        action: 'camera',
      })
    );
    
    if (scannerKey) {
      setScannerKey(scannerKey);
    }
  };

  useEffect(() => {
    if (scannerKey && scannerMap[scannerKey]) {
      onScannerCallback?.(scannerMap[scannerKey]);
    }
  }, [scannerKey, scannerMap])

  return (
    <div className='flex w-full items-center'>
      <Select
        className={scannerKey ? styles.scannerSelect : ''}
        {...props}
        allowClear
        size="middle"
        style={{ width: `calc(100% - ${scannerKey ? 46 : 0}px)` }}
      />
      {
        !!scannerKey && (
          <Button
            icon={<ScanOutlined />}
            type="primary"
            style={{ width: 46 }}
            className="rounded-l-none"
            onClick={handleSearch}
          />
        )
      }
    </div>
  );
}

export default memo(ScannerSelect);
