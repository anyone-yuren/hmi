import {
  AnyKeyProps,
  GSelect,
  registerField,
  setDefaultDataFilter,
  setDefaultSearchFilter,
  setGlobalDialogField,
} from 'gbeata';

import type { PageListResult } from '#/entity';
/**
 * 表格请求后过滤
 * @param data object 接口请求完成的数据
 */
setDefaultDataFilter((res: PageListResult) => {
  return {
    // 表格列表的数据
    content: res.items,
    // 数据总共 n 条
    totalCount: res.totalCount,
    ...res,
  };
});

setGlobalDialogField(() => ({
  maskClosable: false,
  destroyOnClose: true,
}));

const isEmptyStringOrUndefined = (value: any) => {
  return value === '' || value === undefined || value === null;
};

setDefaultSearchFilter((params: Record<string, any>) => {
  const { current, pageSize } = params.pagination;
  const searchData: Record<string, any> = {
    SkipCount: (current - 1) * pageSize,
    MaxResultCount: pageSize || 10,
  };
  const paramsSearch = params.search;
  Object.keys(paramsSearch).forEach((key) => {
    isEmptyStringOrUndefined(paramsSearch[key]) && delete paramsSearch[key];
  });
  const sorting = params.sorts;
  let stringSort: any = [];
  if (sorting && sorting.length) {
    stringSort = sorting.map((item: any) => {
      return `${item.key} ${item.order === 'descend' ? 'desc' : 'asc'}`;
    });
  }
  const search = { ...searchData, ...paramsSearch, sorting: stringSort.join(',') };
  return search;
});

/**
 * 通过选项列表把 value 变成 label
 * @param value 当前值
 * @param options 选项列表
 */
export const getValueByOptions = (value: any, options: Array<Option>) => {
  let option = options.find((option) => option.value === value);
  return option ? option.label : value;
};
// 注册选择框
registerField('select-search', {
  type: 'select-search',
  defaultValue: undefined,
  render: ({ field, readonly, getFieldValue }: AnyKeyProps) => {
    if (readonly) {
      let value = getFieldValue(field.key);
      let text = '';
      if (Array.isArray(value)) {
        if (!value.length) {
          text = '';
        }
        text = value.map((item) => getValueByOptions(item, field.options)).join(field.splitText || '、');
      } else {
        text = getValueByOptions(value, field.options);
      }
      return <span className='g-form-text'>{text || '-'}</span>;
    }

    return (
      <GSelect
        showSearch
        optionFilterProp='label'
        placeholder={`请选择${field.title || ''}`}
        disabled={readonly}
        allowClear={true}
        options={field.options}
        {...field.props}
      />
    );
  },
});
