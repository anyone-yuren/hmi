import { Badge, InputNumber, Tag, TimePicker, Tooltip } from 'antd';
import dayjs from 'dayjs';
import {
  type AnyKeyProps,
  registerField,
  registerTableRender,
  type RenderProps,
  setSearchTableDefaultValue,
} from 'gbeata';
import { t } from 'i18next';

// import AgvWithTray from '@/assets/images/agvWithTray.png';

setSearchTableDefaultValue({
  /** 扩展栏是否显示 */
  extraVisible: true,
  /** 扩展栏【刷新】按钮是否显示 */
  extraRefreshVisible: true,
  /** 扩展栏【密度】按钮是否显示 */
  extraSizeVisible: false,
  /** 扩展栏【密度】按钮默认值 */
  /** 可选值：large、middle、small */
  extraSizeDefaultValue: 'small',
  /** 扩展栏【展示列】按钮是否显示 */
  extraSettingVisible: false,
  /** 扩展栏【全屏】按钮是否显示 */
  extraFullscreenVisible: false,
});
registerTableRender('status', ({ text = 0, field }: RenderProps) => {
  const { valueEnum } = field;
  return (
    <>
      <Badge
        status={valueEnum[text]?.type || valueEnum.default.type}
        text={valueEnum[text]?.title || valueEnum.default.title}
      />
    </>
  );
});

registerTableRender('tag', ({ text, field }: RenderProps) => {
  return <Tag color={text ? 'success' : 'error'}>{text ? t('common.yes') : t('common.no')}</Tag>;
});

// 表单的自定义列 - 时间
registerTableRender('date', ({ text }: RenderProps) => {
  return text ? dayjs(new Date(text)).format('YYYY-MM-DD HH:mm:ss') : '-';
});

registerTableRender('2rowEllipsis', ({ text, field }: RenderProps) => {
  return (
    <Tooltip placement={'top'} title={text}>
      <div className='line-clamp-2 cursor-pointer'>{text}</div>
    </Tooltip>
  );
});

const FORM_TYPE_TIME_RANGE = 'time-range';
// 注册区间日期
registerField(FORM_TYPE_TIME_RANGE, {
  type: FORM_TYPE_TIME_RANGE,
  defaultValue: [],
  render: ({ field, readonly, getFieldValue }: AnyKeyProps) => {
    let text = getFieldValue(field.key, readonly);
    if (Array.isArray(text)) {
      if (text[0] === null) {
        text = null;
      } else if (text) {
        text = [
          <span key='start' style={{ display: 'inline-block' }}>
            {(text[0] || '').toString()}
          </span>,
          <span key='divider' style={{ margin: '0 0.5em' }}>
            {t('开始时间')}
          </span>,
          <span key='end' style={{ display: 'inline-block' }}>
            {(text[1] || '').toString()}
          </span>,
        ];
      }
    }
    return readonly ? (
      <span className='g-form-text'>{text || 'none'}</span>
    ) : (
      <TimePicker.RangePicker placeholder={[t('开始时间'), t('结束时间')]} className='max-width' {...field.props} />
    );
  },
});

const FORM_TYPE_FULL_NUMBER = 'full-number';
registerField(FORM_TYPE_FULL_NUMBER, {
  type: FORM_TYPE_FULL_NUMBER,
  defaultValue: null,
  render: ({ field, readonly, getFieldValue }: AnyKeyProps) => {
    return readonly ? (
      <span className='g-form-text'>{getFieldValue(field.key) || '-'}</span>
    ) : (
      <InputNumber
        className='w-full'
        disabled={readonly}
        placeholder={t('请输入{{title}}', { title: field.title })}
        // min={NUMBER_DEFAULT_MIN}
        // max={NUMBER_DEFAULT_MAX}
        {...field.props}
      />
    );
  },
});

const FORM_TYPE_INPUT_RANGE = 'input-range';
registerField(FORM_TYPE_INPUT_RANGE, {
  type: FORM_TYPE_INPUT_RANGE,
  defaultValue: [],
  render: (props: AnyKeyProps) => {
    const { field, readonly, getFieldValue } = props;
    return readonly ? (
      <span className='g-form-text'>{getFieldValue(field!.key) || '-'}</span>
    ) : (
      <InputRangeCom {...field.props} />
    );
  },
});

const InputRangeCom = (props: any) => {
  return (
    <div className='flex items-center' key={'InputRangeCom'}>
      <InputNumber
        className='flex-1'
        min={0}
        key={`input1${props.value[0]}`}
        defaultValue={props.value[0]}
        onChange={(value) => {
          const newAry = [...props.value];
          newAry[0] = value;
          props.onChange(newAry);
        }}
        suffix={props.suffix || '%'}
      ></InputNumber>
      <div className='px-[10px]'>-</div>
      <InputNumber
        className='flex-1'
        min={0}
        key={`input2${props.value[1]}`}
        defaultValue={props.value[1]}
        onChange={(value) => {
          const newAry = [...props.value];
          newAry[0] = value;
          props.onChange(newAry);
        }}
        suffix={props.suffix || '%'}
      ></InputNumber>
    </div>
  );
};
