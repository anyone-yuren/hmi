import { Cascader, Button } from 'antd';
import { CascaderProps, DefaultOptionType } from 'antd/es/cascader';
import { usePadStore } from '@gbeata/store';
import { ScanOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { memo, useEffect } from 'react';

type DeCascaderProps = CascaderProps<DefaultOptionType> & {
  scannerKey?: string;
  onSearch?: () => void;
  onScannerCallback?: (code: any) => void;
};

function ScannerCascader({ onSearch, scannerKey, onScannerCallback, ...props }: DeCascaderProps) {
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
      <Cascader
        className={scannerKey ? styles.scannerCascader : ''}
        {...(props as any)}
        allowClear
        size="middle"
        style={{ width: `calc(100% - ${scannerKey ? 46 : 0}px)` }}
        // dropdownStyle={{ width: 'calc(100% - 46px)' }}
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

export default memo(ScannerCascader);
