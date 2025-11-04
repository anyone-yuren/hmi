import { Button } from '@mui/material';
import { useSize } from 'ahooks';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle, Layer, Rect, Stage, Transformer } from 'react-konva';
import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import LightTheme from './lightTheme';

interface IProps {
  type: string;
  background?: string;
  titleColor?: string;
}

interface ITransform {
  scale: number;
  x: number;
  y: number;
}

interface IBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Point {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const generateRandomPoints = (count: number, width: number, height: number): Point[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: 2 + Math.random() * 3,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }));
};

const PointCloudView = ({ title, sharedTransform, setSharedTransform, sharedBox, setSharedBox }: any) => {
  const ref = useRef(null);
  const size = useSize(ref);
  const stageRef = useRef<any>(null);
  const rectRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const [isInteracting, setIsInteracting] = useState(false);

  const points = useMemo(() => generateRandomPoints(2000, 500, 500), []);

  // 🔹 同步 transform，只在当前视图未交互时同步
  useEffect(() => {
    if (!stageRef.current || isInteracting) return;
    stageRef.current.scale({ x: sharedTransform.scale, y: sharedTransform.scale });
    stageRef.current.position({ x: sharedTransform.x, y: sharedTransform.y });
    stageRef.current.batchDraw();
  }, [sharedTransform, isInteracting]);

  // 同步 box
  useEffect(() => {
    if (rectRef.current) {
      rectRef.current.position({ x: sharedBox.x, y: sharedBox.y });
      rectRef.current.size({ width: sharedBox.width, height: sharedBox.height });
      rectRef.current.getLayer()?.batchDraw();
    }
  }, [sharedBox]);

  // 鼠标滚轮缩放
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    setIsInteracting(true);
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setSharedTransform({ scale: newScale, x: newPos.x, y: newPos.y });
    setTimeout(() => setIsInteracting(false), 100); // 稍后解除锁定
  };

  // 拖动平移
  const handleDragMove = (e: any) => {
    setIsInteracting(true);
    const stage = e.target.getStage();
    setSharedTransform((prev: ITransform) => ({
      ...prev,
      x: stage.x(),
      y: stage.y(),
    }));
  };
  const handleDragEnd = () => setTimeout(() => setIsInteracting(false), 50);

  // 选中矩形后，显示transformer
  const handleSelectRect = () => {
    const transformer = trRef.current;
    transformer.nodes([rectRef.current]);
    transformer.getLayer()?.batchDraw();
  };

  // 点击空白取消选中
  const handleDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      const transformer = trRef.current;
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
    }
  };

  // 矩形变换同步
  const handleRectTransform = () => {
    const node = rectRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newBox = {
      x: node.x(),
      y: node.y(),
      width: Math.max(10, node.width() * scaleX),
      height: Math.max(10, node.height() * scaleY),
    };
    node.scaleX(1);
    node.scaleY(1);
    setSharedBox(newBox);
  };

  return (
    <div ref={ref} className='flex-1 h-full'>
      <Stage
        ref={stageRef}
        width={size?.width}
        height={size?.height}
        draggable
        onWheel={handleWheel}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onMouseDown={handleDeselect}
        style={{ background: '#f0f0f0' }}
      >
        <Layer>
          {points.map((p) => (
            <Circle key={p.id} x={p.x} y={p.y} radius={p.size / 2} fill={p.color} opacity={0.8} />
          ))}

          <Rect
            ref={rectRef}
            {...sharedBox}
            stroke='red'
            strokeWidth={2}
            draggable
            onClick={handleSelectRect}
            onTap={handleSelectRect}
            onDragEnd={(e) => {
              setSharedBox({
                ...sharedBox,
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onTransformEnd={handleRectTransform}
          />
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            anchorSize={8}
            borderDash={[4, 4]}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 10 || newBox.height < 10) return oldBox;
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

const PointCloudFilter2D = (props: IProps) => {
  const { type, background, titleColor } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [sharedTransform, setSharedTransform] = useState<ITransform>({
    scale: 1,
    x: 0,
    y: 0,
  });

  const [sharedBox, setSharedBox] = useState<IBox>({
    x: 100,
    y: 100,
    width: 100,
    height: 80,
  });

  return (
    <div>
      <Button fullWidth variant='contained' sx={{ color: 'white' }} onClick={() => setOpen(true)}>
        {'2D' + t('deployer.vision.pointsCloud')}
      </Button>

      <SecondaryPage
        open={open}
        setOpen={setOpen}
        fullScreen
        background={background || '#162640'}
        titleColor={titleColor}
      >
        <SecondaryPaper>
          {open && (
            <LightTheme>
              <div className='flex text-black h-full w-full'>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '10px',
                    width: '100%',
                  }}
                >
                  <PointCloudView
                    title='主视图'
                    sharedTransform={sharedTransform}
                    setSharedTransform={setSharedTransform}
                    sharedBox={sharedBox}
                    setSharedBox={setSharedBox}
                  />
                  <PointCloudView
                    title='俯视图'
                    sharedTransform={sharedTransform}
                    setSharedTransform={setSharedTransform}
                    sharedBox={sharedBox}
                    setSharedBox={setSharedBox}
                  />
                </div>
              </div>
            </LightTheme>
          )}
        </SecondaryPaper>
      </SecondaryPage>
    </div>
  );
};

export default memo(PointCloudFilter2D);
