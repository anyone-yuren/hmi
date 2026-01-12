import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';

import { commonServices } from '@gbeata/app-global';
import type { MenuProps } from 'antd';
import { setLanguage } from 'gbeata';
import { useEffect } from 'react';

const Selectlangulage = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);
  const languages: MenuProps['items'] = [
    {
      key: 'zh_CN',
      label: '中文',
    },
    {
      key: 'en_US',
      label: 'English',
    },
    {
      key: 'ja_JP',
      label: '日本語',
    },
    {
      key: 'ko_KR',
      label: '한국어',
    },
    {
      key: 'fr_FR',
      label: 'Français',
    },
  ];
  const handleChange = async (key: string) => {
    await commonServices.postLanguageType(key.split('_')[0]);
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
      <Button type='text' className='mt-4'>
        <div className='flex items-center justify-center w-full gap-4'>
          {languages.find((item) => item.key === i18n.language)?.label}
          <DownOutlined />
        </div>
      </Button>
    </Dropdown>
  );
};

export default Selectlangulage;
