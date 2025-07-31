

export interface IBaseModel {
  type: string;
  showMarks?: boolean;
}

export interface IRectProps extends IBaseModel {
  id?: string;
  name?: string;
  width: number;
  height: number;
}

export interface IRectAnnotationProps {
  width: number,
  height: number,
  handleSizeArea: (key: string) => void
}