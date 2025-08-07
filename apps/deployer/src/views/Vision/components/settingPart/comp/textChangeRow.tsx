import MwConfirm from '@/views/Vision/components/MwConfirm';
import InputWidthKeyboard from '@/views/Vision/components/inputWithKeyboard';
import { TextField } from '@mui/material';
import { useGetState } from 'ahooks';
import { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface IProps {
  title: string;
  value: string | number;
  onChange: (value: string) => void;
  children: React.ReactNode;
  validateRange?: [number, number];
  className?: string;
}

const TextChangeRow = (props: IProps) => {
  const { onChange, value, title, validateRange } = props;
  const [tempValue, setTempValue, getTempValue] = useGetState('');

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);
  const { t } = useTranslation();

  const validate = (val: any) => {
    console.log(val, validateRange);
    return new Promise<void>((resolve, reject) => {
      if (!validateRange?.length) {
        resolve();
        return;
      }
      const [min, max] = validateRange;
      if (min === undefined || max === undefined) {
        resolve();
        return;
      }
      if (Number(val) > max || Number(val) < min) {
        reject();
      } else {
        resolve();
      }
    });
  };

  const handleClick = () => {
    setTempValue(value);
    MwConfirm.confirm({
      title: title,
      content: (
        <>
          {isMultiwayAgv ? (
            <InputWidthKeyboard
              input={tempValue}
              setInput={(val: any) => {
                setTempValue(val);
              }}
              placeholder={`${t('common.plsInput')}`}
              mode={'numbers'}
            ></InputWidthKeyboard>
          ) : (
            <TextField
              autoFocus
              fullWidth
              defaultValue={!tempValue ? '' : tempValue}
              type={'number'}
              onChange={(event) => {
                setTempValue(event.target.value as any);
              }}
            ></TextField>
          )}
        </>
      ),
      onOk: async () => {
        const val = getTempValue();
        try {
          await validate(val);
          onChange && onChange(val);
        } catch (err) {
          console.log(err);
          toast.error(t('参数限制范围') + `[${validateRange?.[0]}-${validateRange?.[1]}]`);
          return Promise.reject();
        }
      },
    });
  };

  useEffect(() => {
    if (value !== undefined) {
      setTempValue(value);
    }
  }, [value]);

  return (
    <div
      onClick={handleClick}
      className={`my-3 p-4 bg-[#d8d8d866] bg-opacity-20 rounded-lg flex items-center justify-between text-lg ${props?.className}`}
    >
      <div>{title}</div>
      {props.children}
    </div>
  );
};

export default memo(TextChangeRow);
