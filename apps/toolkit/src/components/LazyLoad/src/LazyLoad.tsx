import { type ReactNode, Suspense } from 'react';

import Loading from './Loading';

import type { LoadableComponent } from '@loadable/component';
/**
 * @description 路由懒加载
 * @param {Element} Component 需要访问的组件
 * @returns element
 */
const LazyLoad = (Component: LoadableComponent<{}>, permissionKey?: string): ReactNode => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* userPermission 在执行之后异步获取，这里的判断无意义 */}
        {/* {userPermissions.includes(permissionKey as string) || !permissionKey ? (
          <Component />
        ) : (
          <Result
            // status={status}
            title={'403'}
            icon={<SvgIcon size={380} name={'403'} />}
            subTitle={'对不起您没有访问该页面的权限'}
          />
        )} */}
        <Component />
      </Suspense>
    </>
  );
};

export default LazyLoad;
