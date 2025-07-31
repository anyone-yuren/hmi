const NormalAxis = () => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="250" r="3" fill="black" />

      <line x1="30" y1="300" x2="30" y2="10" stroke="black" stroke-width="10" />
      <path
        d="M 30 0 L 10 40 L 50 40 L 30 0"
        stroke="black"
        stroke-width="2"
        fill="black"
      />
      <text x="60" y="40" font-family="Arial" font-size="60" font-weight="bold">
        Y
      </text>

      <line
        x1="270"
        y1="270"
        x2="0"
        y2="270"
        stroke="black"
        stroke-width="10"
      />
      <path
        d="M 300 270 L 260 250 L 260 290 L 300 270"
        stroke="black"
        stroke-width="2"
        fill="black"
      />

      <text
        x="250"
        y="240"
        font-family="Arial"
        font-size="60"
        font-weight="bold"
      >
        X
      </text>
    </svg>
  );
};

const VehicleAxis = () => {
  return (
    <div>
      <svg
        width="60"
        height="60"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="250" r="3" fill="black" />

        <line
          x1="30"
          y1="280"
          x2="30"
          y2="0"
          stroke="black"
          stroke-width="10"
        />
        <path
          d="M 30 300 L 10 260 L 50 260 L 30 300"
          stroke="black"
          stroke-width="2"
          fill="black"
        />
        <text
          x="60"
          y="270"
          font-family="Arial"
          font-size="60"
          font-weight="bold"
        >
          Y
        </text>

        <line
          x1="270"
          y1="30"
          x2="0"
          y2="30"
          stroke="black"
          stroke-width="10"
        />
        <path
          d="M 300 30  L 260 10  L 260 50  L 300 30"
          stroke="black"
          stroke-width="2"
          fill="black"
        />

        <text
          x="250"
          y="120"
          font-family="Arial"
          font-size="60"
          font-weight="bold"
        >
          X
        </text>
      </svg>
    </div>
  );
};

export { NormalAxis, VehicleAxis };
