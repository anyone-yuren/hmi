import {
  Button,
  Grid,
  InputLabel,
  List,
  ListSubheader,
  Paper,
  Switch,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { useRequest } from 'ahooks';
import { Flex } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { addHeightInfo, chargePolicy, deleteHeightInfo, getChargePolicy, getHeightInfo } from '../services';
import InputWidthKeyboard from './inputWithKeyboard';
import KeyboardWrapper from './KeyboardWrapper';
import TempTaskList from './TempTaskList';

type FormValues = {
  name: string;
  low_height: string;
  high_height: string;
};
// 新增的icon
function TaskSetting() {
  const [tempTaskList, setTempTaskList] = useState<any>([]);
  const [numberKeyboardOpen, setNumberKeyboardOpen] = useState(false);
  const [numberKeyboardMode, setNumberKeyboardMode] = useState('number');
  const [focusedKey, setFocusedKey] = useState<keyof FormValues>();
  const keyboardWrapperRef = useRef<any>(null);
  const [checked, setAutoChargeEnable] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoChargeEnable(event.target.checked);
  };

  const { t } = useTranslation();

  useEffect(() => {
    getList();
  }, []);

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      low_height: '',
      high_height: '',
    },
  });

  const [auto_charge_threshold, setLowPowerThreshold] = useState<any>(2);
  const [auto_charge_idle_wait_time, setIdleWaitTime] = useState<any>(2);

  const postChargePolicy = async () => {
    const res = await chargePolicy({
      auto_charge_threshold,
      auto_charge_idle_wait_time,
      auto_charge_enable: checked,
    });
    if (res) {
      toast.success(t('提交成功'));
    }
  };

  const handleElementFocus = useCallback(
    (key: keyof FormValues) => {
      setNumberKeyboardOpen(true);
      setFocusedKey(key);
      setTimeout(() => {
        const value = form.getValues()[key];
        if (value) {
          keyboardWrapperRef.current?.setInput(value);
        }
      });
    },
    [form, keyboardWrapperRef.current],
  );

  const getList = async () => {
    const { data = [] } = await getHeightInfo();
    setTempTaskList(data || []);
  };

  const { runAsync: getChargePolicyUri, loading } = useRequest(getChargePolicy, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code === 200) {
        const { auto_charge_enable, auto_charge_idle_wait_time, auto_charge_threshold } = res.data;
        setAutoChargeEnable(auto_charge_enable);
        setIdleWaitTime(auto_charge_idle_wait_time);
        setLowPowerThreshold(auto_charge_threshold);
      }
    },
  });

  useEffect(() => {
    getChargePolicyUri();
  }, []);

  return (
    <Paper
      sx={{
        background: '#fff',
        height: 'calc(100% - 60px)',
        // marginTop: "20px",
        borderRadius: '20px',
        padding: '40px',
        overflow: 'auto',
        flex: 1,
      }}
    >
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: 'light',
            primary: {
              main: '#00D1D1',
            },
          },
          typography: {
            fontSize: 20,
          },
        })}
      >
        <Grid container gap={2} sx={{ height: '100%' }}>
          <Grid
            flex='1'
            sx={{
              border: '1px solid #d8d8d8',
              paddingInline: '16px',
              height: '100%',
              overflow: 'scroll',
            }}
          >
            <ListSubheader sx={{ paddingInline: 0, zIndex: 10 }}>{t('取货库位叉臂高度设置')}</ListSubheader>
            <div className='h-[10px]'></div>
            <FormContainer
              formContext={form}
              onSuccess={async (data) => {
                await addHeightInfo(data);
                await getList();
                form.reset();
              }}
            >
              <ThemeProvider
                theme={createTheme({
                  palette: {
                    mode: 'light',
                    primary: {
                      main: '#00D1D1',
                    },
                  },
                  typography: {
                    fontSize: 20,
                  },
                })}
              >
                <Grid container flexDirection={'column'} gap={1}>
                  <TextFieldElement
                    name='name'
                    label={t('名称')}
                    placeholder={t('请输入') + t('名称')}
                    variant='outlined'
                    sx={{
                      width: '100%',
                    }}
                    onFocus={() => {
                      handleElementFocus('name');
                      setNumberKeyboardMode('abc');
                    }}
                    onBlur={() => {
                      setNumberKeyboardOpen(false);
                      setNumberKeyboardMode('number');
                    }}
                    rules={{
                      required: true,
                    }}
                    required
                    size='small'
                  />
                  <TextFieldElement
                    name='low_height'
                    label={t('进叉高度')}
                    placeholder={t('请输入') + t('进叉高度')}
                    variant='outlined'
                    sx={{
                      width: '100%',
                    }}
                    onFocus={() => handleElementFocus('low_height')}
                    onBlur={() => {
                      setNumberKeyboardOpen(false);
                    }}
                    rules={{
                      required: true,
                    }}
                    required
                    size='small'
                  />
                  <TextFieldElement
                    name='high_height'
                    label={t('出叉高度')}
                    placeholder={t('请输入') + t('出叉高度')}
                    variant='outlined'
                    sx={{
                      width: '100%',
                    }}
                    onFocus={() => handleElementFocus('high_height')}
                    onBlur={() => {
                      setNumberKeyboardOpen(false);
                    }}
                    rules={{
                      required: true,
                    }}
                    required
                    size='small'
                  />
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{
                      color: 'white',
                    }}
                  >
                    {t('添加')}
                  </Button>
                </Grid>
              </ThemeProvider>
            </FormContainer>
            <Divider
              sx={{
                marginBlock: '8px',
              }}
            />
            <TempTaskList
              data={tempTaskList}
              onDelete={async (index) => {
                const obj = tempTaskList[index];
                await deleteHeightInfo({ name: obj.name });
                toast.success(t('提交成功'));
                await getList();
              }}
            />
          </Grid>
          {!loading ? (
            <Grid
              flex='1'
              sx={{
                display: 'flex',
                border: '1px solid #d8d8d8',
              }}
            >
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  color: 'black',
                }}
                subheader={<ListSubheader>{t('自动充电设置')}</ListSubheader>}
              >
                <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
                <div style={{ paddingInline: '16px' }}>
                  <InputLabel htmlFor='standard-adornment-amount'>{t('最低电量')}</InputLabel>
                  <Flex justify='center' align='center' gap={2}>
                    <InputWidthKeyboard
                      style={{ flex: 1 }}
                      mode='numbers'
                      input={auto_charge_threshold + ''}
                      placeholder={t('请输入')}
                      setInput={(e: any) => {
                        setLowPowerThreshold(Number(e));
                      }}
                    ></InputWidthKeyboard>
                    <div style={{ width: '40px' }}>%</div>
                  </Flex>
                  <InputLabel htmlFor='standard-adornment-amount'>{t('空闲时间')}</InputLabel>
                  <Flex justify='center' align='center' gap={2}>
                    <InputWidthKeyboard
                      mode='numbers'
                      style={{ flex: 1 }}
                      input={auto_charge_idle_wait_time + ''}
                      placeholder={t('请输入')}
                      setInput={(e) => {
                        setIdleWaitTime(Number(e));
                      }}
                    ></InputWidthKeyboard>
                    <div style={{ width: '40px' }}>{t('秒')}</div>
                  </Flex>
                </div>
                <Flex>
                  <Button
                    sx={{
                      margin: '6px auto',
                      color: 'white',
                    }}
                    variant='contained'
                    onClick={postChargePolicy}
                  >
                    {t('保存')}
                  </Button>
                </Flex>
              </List>
              <Divider component='li' />
              {/* <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  color: "black",
                }}
                subheader={<ListSubheader>点位显示控制</ListSubheader>}
              >
                <ListItem>
                  <ListItemText id="switch-list-label-wifi" primary="普通点" />
                  <Switch
                    edge="end"
                    inputProps={{
                      "aria-labelledby": "switch-list-label-wifi",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    id="switch-list-label-bluetooth"
                    primary="待命点"
                  />
                  <Switch
                    edge="end"
                    // onChange={handleToggle("bluetooth")}
                    // checked={checked.includes("bluetooth")}
                    inputProps={{
                      "aria-labelledby": "switch-list-label-bluetooth",
                    }}
                  />
                </ListItem>
              </List> */}
            </Grid>
          ) : null}
        </Grid>
      </ThemeProvider>

      <KeyboardWrapper
        ref={keyboardWrapperRef}
        containerStyle={{
          display: numberKeyboardOpen ? 'block' : 'none',
        }}
        key={focusedKey}
        setInputFocus={() => {
          setTimeout(() => {
            const currentElement = document.activeElement as HTMLInputElement;
            currentElement.focus();
          });
        }}
        onChange={(value) => {
          form.setValue(focusedKey!, value);
          const currentElement = document.activeElement as HTMLInputElement;
          setTimeout(() => {
            currentElement.focus();
          });
        }}
        onClickOutside={() => {
          if (numberKeyboardOpen) {
            setNumberKeyboardOpen(false);
          }
        }}
      />
    </Paper>
  );
}

export default TaskSetting;
