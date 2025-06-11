import { Typography } from "antd";

import PdaLayoutFeature from "../feature/PdaLayoutFeature";

const LayoutHeader = (props: any) => {
  const { title } = props;
  return (
    // <Header classNames={classNames(styles['layout-header'], 'flex-between-h')}>
    <div className="flex items-center justify-between px-4 py-2">
      <Typography.Title className="!m-0" level={4}>
        <span className="text-primary">{title}</span>
      </Typography.Title>
      <PdaLayoutFeature />
    </div>
  );
};

export default LayoutHeader;
