import './title1.css';
export default function Title(props: any) {
  return (
    <div className='w-full h-full flex flex-col bg-[#091b23]'>
      <div className='icon h-[28px] flex-shrink-0 font-bold flex items-center text-white pl-[15px] bg-gradient-to-r from-[#0b5170] to-[#0b517000]'>
        {props.title}
      </div>
      <div className='flex-1'>{props.children}</div>
    </div>
  );
}
