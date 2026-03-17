import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface TimeBleedProps {
  idleSeconds: number;
  maxIdleSeconds?: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TimeBleed({
  idleSeconds,
  maxIdleSeconds = 300,
}: TimeBleedProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(idleSeconds > 5);
  }, [idleSeconds]);

  const ratio = Math.min(idleSeconds / maxIdleSeconds, 1);
  const remaining = 1 - ratio;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - remaining);

  const strokeColor =
    ratio >= 0.8
      ? "oklch(0.5 0.22 20)"
      : ratio >= 0.5
        ? "oklch(0.75 0.18 55)"
        : "oklch(0.65 0.18 145)";

  const textColor =
    ratio >= 0.8
      ? "text-pressure"
      : ratio >= 0.5
        ? "text-warning"
        : "text-success";

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center"
      data-ocid="timebleed.panel"
    >
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        aria-label="Time bleeding visualization"
        role="img"
      >
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-secondary"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
        />
        <text
          x="70"
          y="60"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          letterSpacing="2"
          style={{ fill: strokeColor }}
        >
          TIME
        </text>
        <text
          x="70"
          y="72"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          letterSpacing="2"
          style={{ fill: strokeColor }}
        >
          BLEEDING
        </text>
        <text
          x="70"
          y="90"
          textAnchor="middle"
          fontSize="14"
          fontWeight="900"
          fontFamily="monospace"
          style={{ fill: strokeColor }}
        >
          {formatTime(idleSeconds)}
        </text>
      </svg>
      <div
        className={`text-[10px] uppercase tracking-widest font-bold ${textColor} mt-1`}
      >
        {ratio >= 0.8 ? "CRITICAL" : ratio >= 0.5 ? "DRAINING" : "IDLE"}
      </div>
    </motion.div>
  );
}
