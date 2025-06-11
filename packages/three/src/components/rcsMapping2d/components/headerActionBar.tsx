import { Icon } from '@iconify/react';
import { Button, Space, Tooltip } from 'antd';
import { useTheme } from 'antd-style';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import Floor from './header/floor';
import FunctionSelect from './header/functionSelect';
import InitLocation from './header/initLocation';
import RouteCheck from './header/routeCheck';
import SelectArea from './header/selectArea';

const HeaderActionBar = ({ mappingData, panelSwitchCb }: any) => {
  const { referencePoints } = mappingData;
  const [selfVisible, setSelfVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [lineVisible, setLineVisible] = useState(false);
  const [switchVisible, setSwitchVisible] = useState(false);
  const token = useTheme();
  const { t } = useTranslation();

  // 按需渲染
  return (
    <div
      className={`w-full absolute left-0 top-0 ${switchVisible ? 'pr-[300px]' : 'pr-[0px]'} z-10 pt-[6px] ${selfVisible ? 'opacity-0' : 'opacity-100'} hover:opacity-100 duration-300`}
    >
      <div className='w-full  h-[50px] flex items-center justify-between px-[10px]'>
        <Space wrap>
          {searchVisible && <SelectArea></SelectArea>}
          {lineVisible && <RouteCheck></RouteCheck>}
        </Space>
        <Space>
          <Space.Compact block>
            <Tooltip placement={'top'} title={t('查找元素')}>
              <Button
                onClick={() => {
                  setSearchVisible(!searchVisible);
                }}
                icon={
                  <Icon
                    className='text-[25px]'
                    style={{ color: searchVisible ? token?.colorPrimary : token.colorText }}
                    icon='mdi:search'
                  ></Icon>
                }
              />
            </Tooltip>
            <Tooltip placement='top' title={t('检测路线连通性')}>
              <Button
                onClick={() => {
                  setLineVisible(!lineVisible);
                }}
                icon={
                  <Icon
                    className='text-[21px]'
                    style={{ color: lineVisible ? token?.colorPrimary : token.colorText }}
                    icon='teenyicons:line-outline'
                  ></Icon>
                }
              />
            </Tooltip>
            <Tooltip placement={'top'} title={t('切换面板')}>
              <Button
                onClick={() => {
                  const visible = !switchVisible;
                  setSwitchVisible(visible);
                  panelSwitchCb && panelSwitchCb(visible);
                }}
                icon={
                  <Icon
                    className='text-[24px] mt-[4px]'
                    icon={'clarity:switch-line'}
                    style={{ color: switchVisible ? token?.colorPrimary : token.colorText }}
                  ></Icon>
                }
              />
            </Tooltip>
            <Tooltip placement='left' title={t('隐藏操作面板')}>
              <Button
                icon={<Icon className='text-[21px]' icon='pajamas:thumbtack-solid'></Icon>}
                style={{ color: !selfVisible ? token?.colorPrimary : token.colorText }}
                onClick={() => {
                  setSelfVisible(!selfVisible);
                }}
              />
            </Tooltip>
            <InitLocation referencePoints={referencePoints}></InitLocation>
          </Space.Compact>
          <FunctionSelect></FunctionSelect>
          <Floor referencePoints={referencePoints} />
        </Space>
      </div>
      <div className='py-2'></div>
    </div>
  );
};

export default HeaderActionBar;
