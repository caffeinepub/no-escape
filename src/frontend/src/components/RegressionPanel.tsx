import { motion } from "motion/react";

interface Skills {
  focus: number;
  discipline: number;
  momentum: number;
}

interface RegressionPanelProps {
  skills: Skills;
}

function SkillBar({
  label,
  value,
  delay = 0,
}: { label: string; value: number; delay?: number }) {
  const isRegressing = value < 40;
  const color =
    value >= 70 ? "bg-success" : value >= 40 ? "bg-warning" : "bg-pressure";

  return (
    <div
      className={`p-3 rounded-lg border ${
        isRegressing
          ? "border-pressure/50 bg-pressure/5"
          : "border-border bg-secondary/30"
      }`}
      style={
        isRegressing ? { boxShadow: "0 0 12px oklch(0.35 0.18 20 / 0.3)" } : {}
      }
      data-ocid="regression.panel"
    >
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-foreground">
            {label}
          </span>
          {isRegressing && (
            <span className="text-[9px] font-black uppercase tracking-wider text-pressure bg-pressure/20 px-1.5 py-0.5 rounded">
              REGRESSING
            </span>
          )}
        </div>
        <span
          className={`text-xs font-mono font-bold ${
            value >= 70
              ? "text-success"
              : value >= 40
                ? "text-warning"
                : "text-pressure"
          }`}
        >
          {value} / 100
        </span>
      </div>
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function RegressionPanel({ skills }: RegressionPanelProps) {
  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden"
      data-ocid="regression.card"
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-display font-bold text-base uppercase tracking-widest text-foreground">
          Skill Regression
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Avoidance degrades your capabilities
        </p>
      </div>
      <div className="p-4 space-y-3">
        <SkillBar label="Focus" value={skills.focus} delay={0} />
        <SkillBar label="Discipline" value={skills.discipline} delay={0.1} />
        <SkillBar label="Momentum" value={skills.momentum} delay={0.2} />
      </div>
    </div>
  );
}
