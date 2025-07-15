import { Outlet } from 'react-router-dom';

// 这个是全局的页面 还可以做一些其他的操作

export default function RootLayout() {
  return (
    <div id={'root-layout'} className='h-full'>
      <Outlet />
    </div>
  );
}
