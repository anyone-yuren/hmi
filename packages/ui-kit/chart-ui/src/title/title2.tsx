export default function Title(props: any) {
  return (
    <div className='w-full h-full flex flex-col bg-[#091b23]'>
      <div className='h-[28px] flex-shrink-0 font-bold flex items-center text-white pl-[15px] bg-[#0b5170]'>
        {props.title}
      </div>
      <div className='flex-1'>{props.children}</div>
    </div>
  );
}
