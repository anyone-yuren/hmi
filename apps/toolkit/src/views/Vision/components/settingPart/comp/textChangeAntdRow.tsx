import { useGetState } from 'ahooks';
import { Input, message, Modal } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const TextChangeAntdRow = (props: any) => {
  const { onChange, value, title, validateRange } = props;
  const [tempValue, setTempValue, getTempValue] = useGetState('');
  const { t } = useTranslation();

  const validate = (val: any) => {
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

  const handleOk = async () => {
    const val = getTempValue();
    try {
      await validate(val);
      onChange && onChange(val);
      Modal.destroyAll();
    } catch (err) {
      message.error(t('deployer.vision.paramsValidateRange') + `[${validateRange?.[0]}-${validateRange?.[1]}]`);
      return Promise.reject();
    }
  };
  const handleClick = () => {
    setTempValue(value);
    Modal.confirm({
      title: <div className='text-center text-[19px]'>{title}</div>,
      icon: null,
      maskClosable: true,
      content: (
        <>
          <div className='bg-[#f5f5f5] rounded py-[8px]'>
            <Input
              defaultValue={value}
              variant='borderless'
              onChange={(event: any) => {
                setTempValue(event.target.value);
              }}
            />
          </div>

          <div className='flex gap-[1px] mt-[10px]'>
            <div
              className='flex-1 flex items-center justify-center hover:bg-[#00ffda14] p-[2px]'
              onClick={() => {
                Modal.destroyAll();
              }}
            >
              <span className='text-[18px] py-[8px]'>取消</span>
            </div>
            <div className='flex-1 flex items-center justify-center hover:bg-[#00ffda14] p-[2px]' onClick={handleOk}>
              <span className='text-[#00d1d1] text-[18px] py-[8px]'>确定</span>
            </div>
          </div>
        </>
      ),
      footer: null,
      onOk: async () => {},
    });
  };

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

export default memo(TextChangeAntdRow);
