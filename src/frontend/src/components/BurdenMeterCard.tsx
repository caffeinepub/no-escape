import { AlertTriangle, CheckCircle, Shield, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { type Task, TaskState } from "../backend";

interface BurdenMeterCardProps {
  burdenScore: number;
  tasks: Task[];
}

const ZONES = [
  {
    min: 0,
    max: 30,
    label: "SAFE ZONE",
    color: "bg-success",
    textColor: "text-success",
    desc: "You're on top of things.",
  },
  {
    min: 31,
    max: 70,
    label: "WARNING ZONE",
    color: "bg-warning",
    textColor: "text-warning",
    desc: "Tension building. Act now.",
  },
  {
    min: 71,
    max: 100,
    label: "CRITICAL ZONE",
    color: "bg-pressure",
    textColor: "text-pressure",
    desc: "Your future self is suffering.",
  },
];

export function BurdenMeterCard({ burdenScore, tasks }: BurdenMeterCardProps) {
  const currentZone =
    ZONES.find((z) => burdenScore >= z.min && burdenScore <= z.max) || ZONES[2];
  const avoidedTasks = tasks.filter((t) => t.state === TaskState.avoided);
  const idleTasks = tasks.filter((t) => t.state === TaskState.idle);

  // Build chart data — visual mountain bars
  const chartBars = Array.from({ length: 20 }, (_, i) => {
    const x = i / 19;
    const burdenNorm = burdenScore / 100;
    const peak = Math.exp(-((x - burdenNorm) ** 2) * 15);
    const baseline = 0.1 + x * 0.2;
    return { value: Math.max(peak * 0.8, baseline), pos: Math.round(x * 100) };
  });

  const ZoneIcon =
    burdenScore > 70
      ? AlertTriangle
      : burdenScore > 40
        ? TrendingUp
        : CheckCircle;

  return (
    <div
      className={`bg-card border rounded-lg shadow-card overflow-hidden ${
        burdenScore > 70
          ? "card-glow-red border-pressure/30"
          : burdenScore > 40
            ? "card-glow-amber border-warning/30"
            : "card-glow-green border-success/30"
      }`}
      data-ocid="burden.card"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-base uppercase tracking-widest text-foreground">
            Future Burden Meter
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consequence accumulation tracker
          </p>
        </div>
        <ZoneIcon className={`w-5 h-5 ${currentZone.textColor}`} />
      </div>

      <div className="px-5 py-5 space-y-6">
        {/* Score display */}
        <div className="flex items-end justify-between">
          <div>
            <div
              className={`font-mono font-black text-6xl ${currentZone.textColor}`}
            >
              {burdenScore}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">
              / 100 burden points
            </div>
          </div>
          <div className="text-right">
            <div
              className={`font-bold text-sm uppercase tracking-wider ${currentZone.textColor}`}
            >
              {currentZone.label}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {currentZone.desc}
            </div>
          </div>
        </div>

        {/* Mountain chart */}
        <div className="relative">
          <div className="flex items-end gap-0.5 h-20">
            {chartBars.map(({ value: height, pos }) => {
              const barBurden = pos;
              const color =
                barBurden <= 30
                  ? "bg-success/60"
                  : barBurden <= 70
                    ? "bg-warning/60"
                    : "bg-pressure/60";
              const isActive = Math.abs(barBurden - burdenScore) < 5;
              return (
                <motion.div
                  key={`bar-${pos}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height * 100}%` }}
                  transition={{ delay: (pos / 100) * 0.6, duration: 0.5 }}
                  className={`flex-1 rounded-t-sm ${
                    isActive
                      ? burdenScore > 70
                        ? "bg-pressure"
                        : burdenScore > 40
                          ? "bg-warning"
                          : "bg-success"
                      : color
                  }`}
                />
              );
            })}
          </div>
          {/* Zone labels */}
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-success uppercase tracking-wider">
              SAFE
            </span>
            <span className="text-[9px] text-warning uppercase tracking-wider">
              WARN
            </span>
            <span className="text-[9px] text-pressure uppercase tracking-wider">
              CRITICAL
            </span>
          </div>
        </div>

        {/* Main progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground uppercase tracking-wider">
              Burden Level
            </span>
            <span className={`font-bold ${currentZone.textColor}`}>
              {Math.round(burdenScore)}%
            </span>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full ${
                burdenScore > 70
                  ? "bg-pressure"
                  : burdenScore > 40
                    ? "bg-warning"
                    : "bg-success"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(burdenScore, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Zone markers */}
            <div
              className="absolute top-0 bottom-0 w-px bg-border/50"
              style={{ left: "30%" }}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-border/50"
              style={{ left: "70%" }}
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-lg px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Avoided Tasks
            </div>
            <div className="text-xl font-mono font-bold text-pressure">
              {avoidedTasks.length}
            </div>
            <div className="text-[10px] text-muted-foreground">
              carrying over
            </div>
          </div>
          <div className="bg-secondary/50 rounded-lg px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Pending Tasks
            </div>
            <div className="text-xl font-mono font-bold text-warning">
              {idleTasks.length}
            </div>
            <div className="text-[10px] text-muted-foreground">
              awaiting action
            </div>
          </div>
        </div>

        {/* Skipped task multipliers */}
        {avoidedTasks.length > 0 && (
          <div className="bg-pressure/10 border border-pressure/20 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-pressure" />
              <span className="text-xs font-bold uppercase tracking-wider text-pressure">
                Compounding Tasks
              </span>
            </div>
            <div className="space-y-1.5">
              {avoidedTasks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex justify-between text-xs">
                  <span className="text-muted-foreground truncate mr-2">
                    {t.title}
                  </span>
                  <span className="text-pressure font-bold flex-shrink-0">
                    ×{t.difficultyMultiplier.toFixed(1)}
                  </span>
                </div>
              ))}
              {avoidedTasks.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{avoidedTasks.length - 3} more...
                </div>
              )}
            </div>
          </div>
        )}

        {burdenScore === 0 && (
          <div className="flex items-center gap-2 text-success text-sm">
            <Shield className="w-4 h-4" />
            <span>No burden. Keep it that way.</span>
          </div>
        )}
      </div>
    </div>
  );
}
