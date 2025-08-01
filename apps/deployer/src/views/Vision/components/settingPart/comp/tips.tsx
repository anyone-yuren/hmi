import { Tooltip } from 'antd';
import { memo, useEffect, useState } from 'react';
const images = import.meta.glob('../../../../../assets/vision/*/*.png');
const visionImages = import.meta.glob('../../../../../assets/vision/*.png');

export const ImagesWidthTips = memo(
  ({
    imageHeight = '120px',
    imageStyle = {},
    img = null,
    children,
    tipsProps = {},
    title = '',
    containClass = '',
  }: any) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    useEffect(() => {
      if (!img) return;

      const loadUrl = `../../../../../assets/vision/${img}.png`;

      // const loadImage = async (str: string) => {
      //   const image = await import(str);
      //   setImageSrc(image.default);
      // };
      let imageFn = () => {};
      if (img.split('/')?.length === 1) {
        imageFn = visionImages[loadUrl];
      } else {
        imageFn = images[loadUrl];
      }
      const loadImage = async () => {
        const image: any = imageFn && (await imageFn());
        setImageSrc(image.default || module);
      };
      loadImage();
    }, [img]);
    return (
      <div className={`w-full flex justify-center items-center h-[200px] ${containClass}`}>
        <div className='relative' style={{ height: imageHeight }}>
          {imageSrc && <img className='h-full' style={imageStyle} src={imageSrc} />}
          {title ? (
            <Tooltip placement={'top'} trigger={'click'} title={title} zIndex={9999}>
              <div className='whitespace-nowrap absolute text-[12px] w-full truncate' style={{ ...tipsProps }}>
                {children}
              </div>
            </Tooltip>
          ) : (
            <div className='absolute text-[12px] w-full ' style={{ ...tipsProps }}>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  },
);
const Tips = (props: any) => {
  return (
    <div>
      <div className='w-full bg-[#fffbe6] border-[#ffe58f] border-[1px] rounded-[8px] px-[12px] py-[8px]'>
        {props.children}
      </div>
    </div>
  );
};

export default memo(Tips);
