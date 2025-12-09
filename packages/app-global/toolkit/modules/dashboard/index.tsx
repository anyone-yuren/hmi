import { IconifyIcon } from 'ui';

const Dashboard = () => {
  return (
    <div className='bg-white/5 h-full flex gap-4 items-center justify-center'>
      <div className='flex flex-col gap-4'>
        <div className='font-bold'>
          <h3 className='text-4xl'>RoboToolkit</h3>
          <p className='text-sm text-gray-500'>场内智能化实施工具</p>
        </div>
        <div className='flex items-start gap-8'>
          <div className='flex flex-col gap-4 min-w-40'>
            <h4 className='text-xl'>启动</h4>
            <div className='handle-list w-full flex flex-col gap-4 text-teal-400'>
              <div className='flex items-center gap-4'>
                <IconifyIcon icon='material-symbols-light:folder-open-outline-sharp' size={20} />
                <span>打开...</span>
              </div>
              <div className='flex items-center gap-4'>
                <IconifyIcon icon='uit:link-h' size={20} />
                <span>连接到...</span>
              </div>
            </div>
            <h4 className='text-xl'>最近打开</h4>
            <div className='handle-list w-full flex flex-col gap-4 text-teal-400'>
              <div className='flex items-center gap-4'>
                <span>CA25046 KW（RFP）Project</span>
              </div>
              <div className='flex items-center gap-4'>
                <span>CR25087 Singapore Sumitomo Phase 2 Project</span>
              </div>
              <div className='flex items-center gap-4'>
                <span>更多...</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4 min-w-40'>
            <h4 className='text-xl'>使用文档</h4>
            <div className='handle-list w-full flex flex-col gap-4'>
              <div className='flex items-center gap-4 rounded-md p-2 bg-teal-400/10 text-white'>
                <IconifyIcon icon='healthicons:register-book-outline' size={20} />
                <span>RoboToolkit使用说明手册</span>
              </div>
              <div className='flex items-center gap-4 rounded-md p-2 bg-teal-400/10 text-white'>
                <IconifyIcon icon='lineicons:map-marker-1' size={20} />
                <span>地图编辑器使用说明文档</span>
              </div>
              <div className='flex items-center gap-4 rounded-md p-2 bg-teal-400/10 text-white'>
                <IconifyIcon icon='proicons:chat-question' size={20} />
                <span>常见问题汇总</span>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
