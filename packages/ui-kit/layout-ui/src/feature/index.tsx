import { Space } from 'antd';

import Notification from '../components/notification';

export default function LayoutFeature() {
  return (
    <Space size={'middle'}>
      {/* <DocLink />
      <GithubLink /> */}
      <Notification />
    </Space>
  );
}
