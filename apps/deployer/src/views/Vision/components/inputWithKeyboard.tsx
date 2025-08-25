import { Box } from '@mui/material';
import { t } from 'i18next';
import * as React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const InputWidthKeyboard = (props: any) => {
  const { input, setInput, placeholder, mode } = props;
  const [inputText, setInputText] = React.useState(input);
  const [keyboardMode, setKeyboardMode] = React.useState(mode || 'default');
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [isFocus, setIsFocus] = React.useState(true);
  const editableDivRef = React.useRef<any>(null);
  const keyboardRef = React.useRef();

  const selection = window.getSelection();
  const range = document.createRange();
  const setCurrentCursorPosition = (position) => {
    // 设置光标位置
    range.selectNode(editableDivRef.current.firstChild);
    selection?.addRange(range);

    selection!.removeAllRanges();
    selection!.addRange(range);
  };

  React.useEffect(() => {
    setInput(inputText);
  }, [inputText]);

  const removeChar = (str: string, index: number) => {
    // 检查索引是否在有效范围内
    if (index < 0 || index >= str.length) {
      return str; // 返回原始字符串，因为索引无效
    }
    // 使用 slice 截取字符串的两部分并拼接在一起
    return str?.slice(0, index) + str?.slice(index + 1);
  };

  const insertChar = (str: string, char: string, index: number) => {
    // 检查索引是否在有效范围内
    if (index < 0 || index > str.length) {
      return str; // 返回原始字符串，因为索引无效
    }

    // 使用 slice 截取字符串的两部分并拼接新字符在中间
    return str.slice(0, index) + char + str.slice(index);
  };

  return (
    <div style={{ position: 'relative', ...props.style }}>
      <div
        ref={editableDivRef}
        style={{
          border: '1px solid #000000',
          borderRadius: 5,
          padding: 10,
          marginTop: 5,
          outline: 'none',
        }}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => {
          setIsFocus(false);
        }}
        onBlur={() => {
          setInputText(editableDivRef.current.innerHTML);
          setIsFocus(true);
        }}
        onClick={() => {
          setKeyboardVisible(true);
        }}
      >
        {inputText || (isFocus && (placeholder || t('')))}
      </div>
      {keyboardVisible && (
        <div style={{ position: 'absolute', width: 500, left: -78, top: 60 }}>
          <Box
            sx={{
              position: 'fixed',
              width: 300,
              height: 150,
              zIndex: 1330,
              '& .hg-button': {
                width: '40px!important',
                height: 'auto',
              },
            }}
          >
            <Keyboard
              keyboardRef={(r: any) => (keyboardRef.current = r)}
              mergeDisplay={true}
              layoutName={keyboardMode}
              layout={{
                default: [
                  'q w e r t y u i o p',
                  'a s d f g h j k l',
                  '{SHIFT} z x c v b n m {backspace}',
                  '{numbers} {space} {ent}',
                ],

                shift: [
                  'Q W E R T Y U I O P',
                  'A S D F G H J K L',
                  '{shift} Z X C V B N M {backspace}',
                  '{numbers} {space} {ent}',
                ],

                numbers: ['1 2 3', '4 5 6', '7 8 9', '{abc} 0 {backspace}', '{-} . {ent}'],
              }}
              display={{
                '{numbers}': '123',
                '{ent}': t('common.confirm'),
                '{escape}': 'esc ⎋',
                '{tab}': 'tab ⇥',
                '{backspace}': '⌫',
                '{capslock}': 'caps lock ⇪',
                '{SHIFT}': '⇧',
                '{shift}': '⇧',
                '{controlleft}': 'ctrl ⌃',
                '{controlright}': 'ctrl ⌃',
                '{altleft}': 'alt ⌥',
                '{altright}': 'alt ⌥',
                '{metaleft}': 'cmd ⌘',
                '{metaright}': 'cmd ⌘',
                '{abc}': 'ABC',
                '{-}': '-',
              }}
              onKeyPress={(value, event) => {
                const action: Record<string, () => void> = {
                  '{backspace}': () => {
                    if (!inputText) return;

                    const newInputText = removeChar(inputText, inputText.length - 1);
                    setInputText(newInputText);
                  },
                  '{close}': () => {},
                  '{confirm}': async () => {},
                  '{numbers}': () => {
                    setKeyboardMode('numbers');
                  },
                  '{abc}': () => {
                    setKeyboardMode('default');
                  },
                  '{SHIFT}': () => {
                    setKeyboardMode('shift');
                  },
                  '{shift}': () => {
                    setKeyboardMode('default');
                  },
                  '{space}': () => {
                    const newInputText = insertChar(inputText, ` `, inputText.length);
                    setInputText(newInputText);
                  },
                  '{ent}': () => {
                    setKeyboardVisible(false);
                  },
                  '{-}': () => {
                    let newInput = '';
                    if (inputText.indexOf('-') > -1) {
                      newInput = inputText.replace('-', '');
                    } else {
                      newInput = '-' + inputText;
                    }
                    setInputText(newInput);
                  },
                };
                action[value]
                  ? action[value]()
                  : (() => {
                      const newInput = inputText === 0 ? value : inputText + value;
                      setInputText(newInput);
                    })();
              }}
            />
          </Box>
        </div>
      )}
    </div>
  );
};

export default InputWidthKeyboard;
