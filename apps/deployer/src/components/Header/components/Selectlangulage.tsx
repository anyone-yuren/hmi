import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';

import { commonServices } from '@gbeata/app-global';
import { useRequest } from 'ahooks';
import { setLanguage } from 'gbeata';
import { useEffect } from 'react';

const Selectlangulage = () => {
  const { i18n, t } = useTranslation();
  const { data } = useRequest(() => commonServices.getLanguageType({}), {});

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);
  const languages: any = [
    {
      key: 'zh_CN',
      matchKey: 'zh',
      label: '中文',
    },
    {
      key: 'en_US',
      matchKey: 'en',
      label: 'English',
    },
    {
      key: 'ja_JP',
      matchKey: 'ja',
      label: '日本語',
    },
    {
      key: 'ko_KR',
      matchKey: 'ko',
      label: '한국어',
    },
    {
      key: 'fr_FR',
      matchKey: 'fr',
      label: 'Français',
    },
    {
      key: 'es_ES',
      matchKey: 'es',
      label: 'Español',
    },
    {
      key: 'tr_TR',
      matchKey: 'tr',
      label: 'Türkçe',
    },
    {
      key: 'pl_PL',
      matchKey: 'pl',
      label: 'polski',
    },
  ];
  useEffect(() => {
    console.log('data', data);
    if (!data?.['language_type']) return;
    const [obj] = languages.filter((item) => item.matchKey === data['language_type']);
    i18n.changeLanguage(obj.key);
    // if (data) {
    //   i18n.changeLanguage(data.language_type);
    // }
  }, [data]);
  const handleChange = async (key: string) => {
    const [obj] = languages.filter((item) => item.key === key);
    await commonServices.postLanguageType(obj?.matchKey);
    i18n.changeLanguage(key);
  };
  return (
    <Dropdown
      menu={{
        items: languages,
        onClick: ({ key }) => {
          handleChange(key);
        },
      }}
      trigger={['click']}
    >
      {/* <Button
        shape='circle'
        size='small'
        icon={
          <span className='anticon'>
            <GlobalOutlined />
          </span>
        }
      /> */}
      <Button type='text' className='mt-0'>
        <div className='flex items-center justify-center w-full gap-4'>
          {languages.find((item) => item.key === i18n.language)?.label}
          <DownOutlined />
        </div>
      </Button>
    </Dropdown>
  );
};

export default Selectlangulage;
