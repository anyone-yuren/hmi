import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number]; // 可选：控制朝向，默认 [0,0,0]
  fontSizePx?: number; // 以像素为单位的字号，用来生成 canvas
  color?: string;
  background?: string | null; // 如果需要背景色
  pixelPerUnit?: number; // 用多少像素对应 1 个世界单位（默认 100）
}

const CanvasTextMesh = ({
  text,
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0],
  fontSizePx = 48,
  color = 'white',
  background = null,
  pixelPerUnit = 500,
}: Props) => {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const { texture, worldWidth, worldHeight } = useMemo(() => {
    const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const fontPx = fontSizePx;

    // 临时设置字体以测量宽度
    ctx.font = `${Math.round(fontPx * DPR)}px sans-serif`;
    const metrics = ctx.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    const textHeight = Math.ceil(fontPx * 1.2 * DPR);

    const paddingPx = Math.round(8 * DPR); // 高分辨率下的内边距
    canvas.width = Math.max(1, textWidth + paddingPx * 2);
    canvas.height = Math.max(1, textHeight + paddingPx * 2);

    // 重新设置字体（resize 后需要重设）
    ctx.font = `${Math.round(fontPx * DPR)}px sans-serif`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // 背景或清空
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 绘制文字（留出 padding）
    ctx.fillStyle = color;
    ctx.fillText(text, paddingPx, paddingPx);

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.needsUpdate = true;
    // 对齐 UV（canvas 原点在左上，flipY 视情况关闭）
    canvasTexture.flipY = false;
    canvasTexture.minFilter = THREE.LinearFilter;
    canvasTexture.magFilter = THREE.LinearFilter;
    canvasTexture.generateMipmaps = false;

    // world 单位尺寸计算：像素 / DPR / pixelPerUnit
    const worldW = canvas.width / DPR / pixelPerUnit;
    const worldH = canvas.height / DPR / pixelPerUnit;

    return { texture: canvasTexture, worldWidth: worldW, worldHeight: worldH };
  }, [text, fontSizePx, color, background, pixelPerUnit]);

  // 清理 texture
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[worldWidth, worldHeight]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} depthTest={false} />
    </mesh>
  );
};

export default CanvasTextMesh;
