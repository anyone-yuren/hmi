import SvgIcon from '@mui/material/SvgIcon';

// 充电点的icon
function StartIcon({ isActive = false, fontSize = 30, sx = {}, onClick }: any) {
  return (
    <SvgIcon sx={{ ...sx, fontSize }} onClick={onClick}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        fill='none'
        version='1.1'
        width='16'
        height='18'
        viewBox='0 0 16 18'
      >
        <g transform='matrix(0,1,-1,0,16,-16)'>
          <path
            d='M33.7616,13.3699C34.438900000000004,14.5388,33.5923,16,32.237899999999996,16L17.76212,16C16.40766,16,15.561124,14.5388,16.238352,13.3699L23.47623,0.876712C24.153460000000003,-0.292237,25.84653,-0.292237,26.5238,0.876712L33.7616,13.3699Z'
            fill='#FFFFFF'
            fillOpacity='1'
          />
        </g>
      </svg>
    </SvgIcon>
  );
}

export default StartIcon;
