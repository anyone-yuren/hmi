import { useShallow } from 'zustand/react/shallow';
import { useBodyOutlineStore } from '../store/bodyOutlineStore';
import styles from './BodyOutlinePanel.module.css';

interface BodyOutlinePanelProps {
  bodyDimensions?: {
    width: number;
    height: number;
    length: number;
  };
}

export default function BodyOutlinePanel({ bodyDimensions }: BodyOutlinePanelProps) {
  const { bodyOutlineConfig, setBodyOutlineConfig, resetBodyOutlineConfig, toggleBodyOutline } =
    useBodyOutlineStore(
      useShallow((state) => ({
        bodyOutlineConfig: state.bodyOutlineConfig,
        setBodyOutlineConfig: state.setBodyOutlineConfig,
        resetBodyOutlineConfig: state.resetBodyOutlineConfig,
        toggleBodyOutline: state.toggleBodyOutline,
      })),
    );

  // 获取默认值（从车体尺寸计算）
  const defaultWidth = bodyDimensions?.width || 200;
  const defaultHeight = bodyDimensions?.height || 150;
  const defaultLength = bodyDimensions?.length || 300;

  const handleResetToDefault = () => {
    resetBodyOutlineConfig(defaultWidth, defaultHeight, defaultLength);
  };

  const handleWidthChange = (value: number) => {
    setBodyOutlineConfig({ width: Math.max(10, value) });
  };

  const handleHeightChange = (value: number) => {
    setBodyOutlineConfig({ height: Math.max(10, value) });
  };

  const handleLengthChange = (value: number) => {
    setBodyOutlineConfig({ length: Math.max(10, value) });
  };

  const handleColorChange = (value: string) => {
    setBodyOutlineConfig({ color: value });
  };

  const handleOpacityChange = (value: number) => {
    setBodyOutlineConfig({ opacity: Math.max(0, Math.min(1, value)) });
  };

  const handleLineWidthChange = (value: number) => {
    setBodyOutlineConfig({ lineWidth: Math.max(1, value) });
  };

  const handleToggleEnabled = (checked: boolean) => {
    toggleBodyOutline(checked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>车体轮廓设置</h3>
      </div>

      <div className={styles.content}>
        {/* 启用开关 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>启用轮廓</label>
          <input
            type="checkbox"
            checked={bodyOutlineConfig.enabled}
            onChange={(e) => handleToggleEnabled(e.target.checked)}
            className={styles.checkbox}
          />
        </div>

        {bodyOutlineConfig.enabled && (
          <>
            {/* 宽度 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                宽度: <span className={styles.value}>{bodyOutlineConfig.width.toFixed(0)}</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={bodyOutlineConfig.width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className={styles.slider}
              />
              <input
                type="number"
                min="10"
                value={bodyOutlineConfig.width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className={styles.numberInput}
              />
            </div>

            {/* 高度 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                高度: <span className={styles.value}>{bodyOutlineConfig.height.toFixed(0)}</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={bodyOutlineConfig.height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className={styles.slider}
              />
              <input
                type="number"
                min="10"
                value={bodyOutlineConfig.height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className={styles.numberInput}
              />
            </div>

            {/* 长度 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                长度: <span className={styles.value}>{bodyOutlineConfig.length.toFixed(0)}</span>
              </label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={bodyOutlineConfig.length}
                onChange={(e) => handleLengthChange(Number(e.target.value))}
                className={styles.slider}
              />
              <input
                type="number"
                min="10"
                value={bodyOutlineConfig.length}
                onChange={(e) => handleLengthChange(Number(e.target.value))}
                className={styles.numberInput}
              />
            </div>

            {/* 颜色 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>颜色</label>
              <input
                type="color"
                value={bodyOutlineConfig.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{bodyOutlineConfig.color}</span>
            </div>

            {/* 透明度 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                透明度: <span className={styles.value}>{(bodyOutlineConfig.opacity * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={bodyOutlineConfig.opacity}
                onChange={(e) => handleOpacityChange(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            {/* ���宽 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                线宽: <span className={styles.value}>{bodyOutlineConfig.lineWidth}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={bodyOutlineConfig.lineWidth}
                onChange={(e) => handleLineWidthChange(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </>
        )}

        {/* 重置按钮 */}
        <div className={styles.footer}>
          <button onClick={handleResetToDefault} className={styles.resetButton}>
            恢复默认值
          </button>
        </div>
      </div>
    </div>
  );
}
