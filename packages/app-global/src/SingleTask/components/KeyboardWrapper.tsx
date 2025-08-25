import { useClickAway } from 'ahooks';
import { MutableRefObject, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

interface IProps {
  containerStyle?: React.CSSProperties;
  onChange: (input: string) => void;
  onClickOutside?: () => void;
  setInputFocus?: () => void;
}

export interface IKeyboardWrapperRef {
  getInput: () => string;
  setInput: (input: string | number) => void;
}

const KeyboardWrapper = forwardRef<IKeyboardWrapperRef, IProps>(
  ({ containerStyle, onChange, onClickOutside, setInputFocus }, ref) => {
    const [layoutName, setLayoutName] = useState('default');
    const keyboardRef = useRef<any>(null);

    const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

    useClickAway((e) => {
      const isInputTarget = e.target instanceof HTMLInputElement;
      if (!isInputTarget) {
        onClickOutside?.();
      }
    }, containerRef);

    const onKeyPress = useCallback((button: string) => {
      if (button === '{shift}' || button === '{lock}') {
        setLayoutName(layoutName === 'default' ? 'shift' : 'default');
      }
      if (button === '{abc}') {
        setLayoutName('abc');
        setInputFocus?.();
      }
      if (button === '{numbers}') {
        setLayoutName('default');
        setInputFocus?.();
      }
      if (button === '{shift}') {
        setLayoutName('abc');
        setInputFocus?.();
      }
      if (button === '{SHIFT}') {
        setLayoutName('shift');
        setInputFocus?.();
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        getInput: () => keyboardRef.current.getInput(),
        setInput: (input) => {
          keyboardRef.current.setInput(input);
        },
      }),
      [keyboardRef.current],
    );

    return (
      <div
        ref={(el) => setTimeout(() => (containerRef.current = el))}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          right: 0,
          zIndex: 999,
          color: 'black',
          width: layoutName === 'abc' || layoutName === 'shift' ? '50%' : '35%',
          transform: 'translateX(-50%)',
          ...containerStyle,
        }}
      >
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          layoutName={layoutName}
          onChange={(input) => {
            onChange(input);
          }}
          onKeyPress={onKeyPress}
          layout={{
            default: ['1 2 3', '4 5 6', '7 8 9', '. 0 {bksp}', '{abc}'],
            abc: ['q w e r t y u i o p', 'a s d f g h j k l', '{SHIFT} z x c v b n m {bksp}', '{numbers} {ent}'],
            shift: ['Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M {bksp}', '{numbers} {ent}'],
          }}
          display={{
            '{bksp}': '⌫',
            '{abc}': 'ABC',
            '{numbers}': 'numbers',
            '{ent}': 'confirm',
            '{SHIFT}': '⇧',
            '{shift}': '⇧',
          }}
        />
      </div>
    );
  },
);

export default KeyboardWrapper;
