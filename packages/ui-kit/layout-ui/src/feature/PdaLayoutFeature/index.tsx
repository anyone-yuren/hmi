import { Space } from 'antd';

import Notification from '../../components/notification';

export default function LayoutFeature() {
  return (
    <Space size={'small'}>
      {/* <DocLink />
      <GithubLink /> */}
      <Notification />
      {/* <UserDropdown /> */}
    </Space>
  );
}
