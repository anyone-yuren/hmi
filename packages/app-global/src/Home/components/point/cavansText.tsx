import { Html } from '@react-three/drei';
import { Suspense } from 'react';
// 使用canvas绘制文字
const HtmlPanel = ({ text, position, fontSize = '8px' }) => {
  return (
    <Suspense>
      <Html distanceFactor={20} position={position} rotation={[-Math.PI / 2, 0, 0]} transform>
        <span
          style={{
            fontSize,
          }}
        >
          {text}
        </span>
      </Html>
    </Suspense>
  );
};

export default HtmlPanel;
