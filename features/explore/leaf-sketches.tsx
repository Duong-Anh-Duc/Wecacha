export function LeafSketch() {
  return (
    <svg viewBox="0 0 220 420" fill="none" className="h-full w-full">
      <path
        d="M112 404C95 319 100 244 126 176C143 132 171 88 202 34"
        stroke="#1f3a24"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {[
        ["118", "308", "-34", "78", "32"],
        ["96", "256", "28", "84", "34"],
        ["132", "214", "-30", "74", "30"],
        ["112", "168", "34", "88", "34"],
        ["152", "122", "-27", "78", "30"],
        ["169", "80", "32", "66", "25"]
      ].map(([cx, cy, rotate, rx, ry]) => (
        <g key={`${cx}-${cy}`} transform={`rotate(${rotate} ${cx} ${cy})`}>
          <path
            d={`M${Number(cx) - Number(rx) / 2} ${cy}C${Number(cx) - Number(rx) / 5} ${Number(cy) - Number(ry)} ${Number(cx) + Number(rx) / 5} ${Number(cy) - Number(ry)} ${Number(cx) + Number(rx) / 2} ${cy}C${Number(cx) + Number(rx) / 6} ${Number(cy) + Number(ry)} ${Number(cx) - Number(rx) / 5} ${Number(cy) + Number(ry)} ${Number(cx) - Number(rx) / 2} ${cy}Z`}
            stroke="#1f3a24"
            strokeWidth="1"
          />
          <path
            d={`M${Number(cx) - Number(rx) / 2 + 8} ${cy}C${Number(cx) - 8} ${Number(cy) - 4} ${Number(cx) + 8} ${Number(cy) - 4} ${Number(cx) + Number(rx) / 2 - 8} ${cy}`}
            stroke="#1f3a24"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

export function LeafSprig() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
      <path
        d="M18 96C42 72 63 48 92 18"
        stroke="#1f3a24"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M37 76C22 69 19 54 42 47C51 60 50 72 37 76Z" stroke="#1f3a24" />
      <path d="M57 56C42 47 43 31 67 28C74 42 70 53 57 56Z" stroke="#1f3a24" />
      <path d="M76 37C63 28 67 15 91 14C96 27 90 36 76 37Z" stroke="#1f3a24" />
    </svg>
  );
}
