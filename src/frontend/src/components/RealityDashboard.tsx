import {
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingDown,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { type Task, TaskState } from "../backend";

interface RealityDashboardProps {
  completedCount: number;
  avoidedCount: number;
  totalFocusMinutes: number;
  burdenScore: number;
  tasks: Task[];
}

export function RealityDashboard({
  completedCount,
  avoidedCount,
  totalFocusMinutes,
  burdenScore,
  tasks,
}: RealityDashboardProps) {
  const totalTasks = tasks.length;
  const avoidanceRate =
    totalTasks > 0 ? Math.round((avoidedCount / totalTasks) * 100) : 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const focusEfficiency =
    completedCount + avoidedCount > 0
      ? Math.round((completedCount / (completedCount + avoidedCount)) * 100)
      : 100;

  const statCards = [
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completedCount,
      sub: `${completionRate}% rate`,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
    },
    {
      icon: XCircle,
      label: "Avoided",
      value: avoidedCount,
      sub:
        avoidedCount > 3
          ? "Pattern detected"
          : avoidedCount > 0
            ? "Watch yourself"
            : "Clean record",
      color:
        avoidedCount > 3
          ? "text-pressure"
          : avoidedCount > 0
            ? "text-warning"
            : "text-success",
      bg: avoidedCount > 3 ? "bg-pressure/10" : "bg-secondary/50",
      border: avoidedCount > 3 ? "border-pressure/20" : "border-border",
    },
    {
      icon: Clock,
      label: "Focus Minutes",
      value: totalFocusMinutes,
      sub:
        totalFocusMinutes >= 60
          ? `${Math.floor(totalFocusMinutes / 60)}h ${totalFocusMinutes % 60}m`
          : "today",
      color: "text-foreground",
      bg: "bg-secondary/50",
      border: "border-border",
    },
  ];

  const metricCards = [
    {
      icon: Zap,
      label: "Focus Streak",
      value: `${completedCount}`,
      unit: "tasks",
      progress: Math.min(completedCount * 10, 100),
      color: "bg-success",
      textColor: "text-success",
    },
    {
      icon: BarChart3,
      label: "Efficiency Score",
      value: `${focusEfficiency}`,
      unit: "%",
      progress: focusEfficiency,
      color:
        focusEfficiency >= 70
          ? "bg-success"
          : focusEfficiency >= 40
            ? "bg-warning"
            : "bg-pressure",
      textColor:
        focusEfficiency >= 70
          ? "text-success"
          : focusEfficiency >= 40
            ? "text-warning"
            : "text-pressure",
    },
    {
      icon: TrendingDown,
      label: "Time Wasted",
      value: `${avoidanceRate}`,
      unit: "%",
      progress: avoidanceRate,
      color:
        avoidanceRate > 50
          ? "bg-pressure"
          : avoidanceRate > 25
            ? "bg-warning"
            : "bg-success",
      textColor:
        avoidanceRate > 50
          ? "text-pressure"
          : avoidanceRate > 25
            ? "text-warning"
            : "text-success",
    },
  ];

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6"
      data-ocid="dashboard.section"
    >
      <div className="flex items-center gap-3">
        <h2 className="font-display font-black text-lg uppercase tracking-widest text-foreground">
          Reality Dashboard
        </h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          No sugar-coating
        </span>
      </div>

      {/* Big 3 stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-card border rounded-lg px-5 py-4 ${card.border}`}
            data-ocid="dashboard.card"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  {card.label}
                </div>
                <div className={`font-mono font-black text-5xl ${card.color}`}>
                  {card.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {card.sub}
                </div>
              </div>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="bg-card border border-border rounded-lg px-5 py-4"
            data-ocid="dashboard.panel"
          >
            <div className="flex items-center gap-2 mb-3">
              <card.icon className={`w-4 h-4 ${card.textColor}`} />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {card.label}
              </span>
            </div>
            <div className="flex items-end gap-1 mb-3">
              <span
                className={`font-mono font-black text-3xl ${card.textColor}`}
              >
                {card.value}
              </span>
              <span className="text-muted-foreground text-sm mb-1">
                {card.unit}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${card.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${card.progress}%` }}
                transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Burden score large display */}
      <div
        className={`bg-card border rounded-lg px-6 py-5 ${
          burdenScore > 70
            ? "card-glow-red border-pressure/30"
            : burdenScore > 40
              ? "card-glow-amber border-warning/30"
              : "border-border"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Current Future Burden
            </div>
            <div className="flex items-end gap-2">
              <span
                className={`font-mono font-black text-5xl ${
                  burdenScore > 70
                    ? "text-pressure"
                    : burdenScore > 40
                      ? "text-warning"
                      : "text-success"
                }`}
              >
                {burdenScore}
              </span>
              <span className="text-muted-foreground text-lg mb-1">/100</span>
            </div>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-6 bg-secondary rounded-full overflow-hidden relative">
              {/* Zone segments */}
              <div className="absolute inset-0 flex">
                <div className="w-[30%] bg-success/20" />
                <div className="w-[40%] bg-warning/20" />
                <div className="w-[30%] bg-pressure/20" />
              </div>
              <motion.div
                className={`h-full rounded-full relative ${
                  burdenScore > 70
                    ? "bg-pressure"
                    : burdenScore > 40
                      ? "bg-warning"
                      : "bg-success"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(burdenScore, 100)}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-muted-foreground uppercase tracking-wider">
              <span>0</span>
              <span>30</span>
              <span>70</span>
              <span>100</span>
            </div>
          </div>
          {burdenScore > 70 && (
            <div className="text-right">
              <div className="text-pressure text-sm font-bold uppercase tracking-wider animate-text-pulse">
                CRITICAL
              </div>
              <div className="text-xs text-muted-foreground">
                Immediate action required
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
