const LineChart = ({ data }) => {
  return (
    <svg viewBox='0 0 360 120' className='w-full h-[120px] block'>
      <defs>
        {/* 折线渐变 */}
        <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#3d8bff' />
          <stop offset='100%' stopColor='#1ecb6b' />
        </linearGradient>

        {/* 面积渐变 */}
        <linearGradient id='areaGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#3d8bff' stopOpacity='0.3' />
          <stop offset='100%' stopColor='#1ecb6b' stopOpacity='0' />
        </linearGradient>

        {/* 发光滤镜 */}
        <filter id='glow' x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation='3' result='blur' />
          <feMerge>
            <feMergeNode in='blur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      {/* 面积背景 */}
      <path
        fill='url(#areaGradient)'
        d={
          `M ${data[0].x},${data[0].y} ` +
          data.map((p) => `L ${p.x},${p.y} `).join('') +
          ` L ${data[data.length - 1].x},120 L ${data[0].x},120 Z`
        }
      />

      {/* 折线 */}
      <polyline
        points={data.map((p) => `${p.x},${p.y}`).join(' ')}
        fill='none'
        stroke='url(#lineGradient)'
        strokeWidth='4'
        filter='url(#glow)'
      />

      {/* 圆点 + tooltip */}
      {data.map((p, idx) => (
        <g key={idx} className='group'>
          <circle
            cx={p.x}
            cy={p.y}
            r='6'
            fill={idx < 5 ? '#3d8bff' : '#1ecb6b'} // 前半年蓝色，后半年绿色
          />
          {/* tooltip */}
          <g className='opacity-0 group-hover:opacity-100 transition-opacity'>
            <rect
              x={p.x - 35}
              y={p.y - 45}
              width='70'
              height='32'
              rx='8'
              className='fill-[#ffffff] opacity-90 drop-shadow-lg'
            />
            <text x={p.x} y={p.y - 25} textAnchor='middle' className='fill-white text-[15px] font-medium'>
              {p.label}: {p.value}
            </text>
          </g>
        </g>
      ))}

      {/* X 轴标签 */}
      <g className='text-[#ffffff] text-[12px] font-inter'>
        {data.map((p, idx) => (
          <text key={idx} x={p.x} y='115' textAnchor='middle'>
            {p.label}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default LineChart;
