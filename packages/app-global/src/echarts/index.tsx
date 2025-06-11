import { echarts, title } from '@gbeata/charts-ui';
import { useMonitorSignalRStore } from '@gbeata/store';
import { Menu } from 'antd';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import DragItem from './components/DragItem';

interface IProps {
  itemProps?: any;
  titleKey?: string;
  titleKeyChange?: (key: string) => void;
}

const GlobalEchartsConfigPanel = forwardRef((props: IProps, ref) => {
  const { itemProps, titleKey, titleKeyChange } = props;
  const { t, i18n } = useTranslation();
  const { monitorMessage } = useMonitorSignalRStore(
    useShallow((state) => ({
      monitorMessage: state.monitorMessage,
    })),
  );
  const [activeKey, setActiveKey] = useState(['title']);
  const items: any[] = [
    {
      label: t('rcsCharts.titleStyle'),
      key: 'title',
    },
    {
      label: t('rcsCharts.echartsLibrary'),
      key: 'charts',
    },
  ];

  const template = {
    title: () => {
      return (
        <div className='flex w-full flex-wrap gap-[10px]'>
          {Object.keys(title).map((item) => {
            const Title = title[item];
            return (
              <div
                onClick={() => {
                  titleKeyChange && titleKeyChange(item);
                }}
                className='w-[150px] relative cursor-pointer border-[1px] border-[#ffffff00] hover:border-blue-500 transition-colors duration-300'
              >
                <Title title={t('rcsCharts.defaultTitle')}></Title>
              </div>
            );
          })}
        </div>
      );
    },
    charts: () => {
      return (
        <div
          className='flex w-full h-full flex-wrap gap-[10px] overflow-y-scroll overflow-x-hidden'
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(152px,1fr))' }}
        >
          {Object.keys(echarts).map((item, index) => {
            const Echarts = echarts[item]?.component;
            const Title = title.title1;
            console.log('echarts', echarts);
            return (
              <DragItem key={item} itemKey={item}>
                <div className=' h-[120px] overflow-hidden relative cursor-pointer border-[1px] border-[#0eb5b524] hover:border-blue-500 transition-colors duration-300'>
                  <div className='scale-50 origin-top-left w-[200%] h-[240px]'>
                    <Title title={t(echarts[item]?.title) || t('rcsCharts.defaultTitle')}>
                      <Echarts data={monitorMessage?.[item]}></Echarts>
                    </Title>
                  </div>
                </div>
              </DragItem>
            );
          })}
        </div>
      );
    },
  };

  return (
    <div {...itemProps} className={`${itemProps.className} bg-[black] z-[101] flex`}>
      <div className='w-[150px] h-full'>
        <Menu
          className='h-full bg-transparent'
          selectedKeys={activeKey}
          onClick={(event: any) => {
            setActiveKey([event?.key]);
          }}
          mode='inline'
          items={items}
        ></Menu>
      </div>
      <div className='py-[10px] px-[20px] w-full'>{template[activeKey[0]]()}</div>
    </div>
  );
});

export default GlobalEchartsConfigPanel;
