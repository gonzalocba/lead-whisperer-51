import { useMemo } from "react";

interface ClosingGaugeProps {
  value: number;
  target: number;
  max?: number;
}

export function ClosingGauge({ value, target, max = 14 }: ClosingGaugeProps) {
  // Semi-circle gauge: 180° arc from -90 (left) to 90 (right) — but we use 180->360
  const cx = 100;
  const cy = 100;
  const r = 80;
  const strokeW = 18;

  const polar = (angleDeg: number, radius = r) => {
    const a = ((angleDeg - 180) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  };

  const arcPath = (startDeg: number, endDeg: number) => {
    const s = polar(startDeg);
    const e = polar(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  // Three zones: green (good <= target), yellow (target..1.3*target), red (rest)
  const zone1End = (target / max) * 180; // green
  const zone2End = Math.min(((target * 1.3) / max) * 180, 180); // yellow

  const valuePct = Math.min(value / max, 1);
  const valueAngle = valuePct * 180;
  const targetAngle = (target / max) * 180;

  const needle = useMemo(() => {
    const tip = polar(valueAngle, r - 6);
    return tip;
  }, [valueAngle]);

  const targetTick = polar(targetAngle, r + 8);
  const overTarget = value > target;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 130" className="w-full max-w-[220px]">
        {/* Background track */}
        <path
          d={arcPath(0, 180)}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Green zone */}
        <path
          d={arcPath(0, zone1End)}
          fill="none"
          stroke="var(--success)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Yellow zone */}
        {zone2End > zone1End && (
          <path
            d={arcPath(zone1End, zone2End)}
            fill="none"
            stroke="var(--warning)"
            strokeWidth={strokeW}
          />
        )}
        {/* Red zone */}
        {zone2End < 180 && (
          <path
            d={arcPath(zone2End, 180)}
            fill="none"
            stroke="var(--destructive)"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        )}

        {/* Target marker (flag tick) */}
        <line
          x1={polar(targetAngle, r - strokeW / 2 - 2).x}
          y1={polar(targetAngle, r - strokeW / 2 - 2).y}
          x2={polar(targetAngle, r + strokeW / 2 + 2).x}
          y2={polar(targetAngle, r + strokeW / 2 + 2).y}
          stroke="var(--foreground)"
          strokeWidth={2}
        />
        <text
          x={targetTick.x}
          y={targetTick.y - 4}
          textAnchor="middle"
          fontSize={9}
          fill="var(--foreground)"
          fontWeight={600}
        >
          {target}d
        </text>

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke="var(--foreground)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={5} fill="var(--foreground)" />

        {/* Scale labels */}
        <text x={polar(0, r + 16).x} y={polar(0, r + 16).y + 4} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0</text>
        <text x={polar(180, r + 16).x} y={polar(180, r + 16).y + 4} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{max}+</text>

        {/* Value */}
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize={26} fontWeight={700} fill="var(--foreground)">
          {value}
        </text>
      </svg>
      <p className="-mt-2 text-xs text-muted-foreground">días reales</p>
      <div className="mt-3 flex gap-2">
        <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs">
          Meta: <span className="font-semibold">{target} días</span>
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            overTarget
              ? "bg-destructive/10 text-destructive"
              : "bg-success/10 text-success"
          }`}
        >
          Real: {value} días
        </span>
      </div>
    </div>
  );
}