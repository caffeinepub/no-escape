import { c as createLucideIcon, j as jsxRuntimeExports, C as Clock, m as motion, Z as Zap } from "./index-CB4bI8Pq.js";
import { C as CircleCheck } from "./circle-check-CDBbxl5l.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
function RealityDashboard({
  completedCount,
  avoidedCount,
  totalFocusMinutes,
  burdenScore,
  tasks
}) {
  const totalTasks = tasks.length;
  const avoidanceRate = totalTasks > 0 ? Math.round(avoidedCount / totalTasks * 100) : 0;
  const completionRate = totalTasks > 0 ? Math.round(completedCount / totalTasks * 100) : 0;
  const focusEfficiency = completedCount + avoidedCount > 0 ? Math.round(completedCount / (completedCount + avoidedCount) * 100) : 100;
  const statCards = [
    {
      icon: CircleCheck,
      label: "Completed",
      value: completedCount,
      sub: `${completionRate}% rate`,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20"
    },
    {
      icon: CircleX,
      label: "Avoided",
      value: avoidedCount,
      sub: avoidedCount > 3 ? "Pattern detected" : avoidedCount > 0 ? "Watch yourself" : "Clean record",
      color: avoidedCount > 3 ? "text-pressure" : avoidedCount > 0 ? "text-warning" : "text-success",
      bg: avoidedCount > 3 ? "bg-pressure/10" : "bg-secondary/50",
      border: avoidedCount > 3 ? "border-pressure/20" : "border-border"
    },
    {
      icon: Clock,
      label: "Focus Minutes",
      value: totalFocusMinutes,
      sub: totalFocusMinutes >= 60 ? `${Math.floor(totalFocusMinutes / 60)}h ${totalFocusMinutes % 60}m` : "today",
      color: "text-foreground",
      bg: "bg-secondary/50",
      border: "border-border"
    }
  ];
  const metricCards = [
    {
      icon: Zap,
      label: "Focus Streak",
      value: `${completedCount}`,
      unit: "tasks",
      progress: Math.min(completedCount * 10, 100),
      color: "bg-success",
      textColor: "text-success"
    },
    {
      icon: ChartColumn,
      label: "Efficiency Score",
      value: `${focusEfficiency}`,
      unit: "%",
      progress: focusEfficiency,
      color: focusEfficiency >= 70 ? "bg-success" : focusEfficiency >= 40 ? "bg-warning" : "bg-pressure",
      textColor: focusEfficiency >= 70 ? "text-success" : focusEfficiency >= 40 ? "text-warning" : "text-pressure"
    },
    {
      icon: TrendingDown,
      label: "Time Wasted",
      value: `${avoidanceRate}`,
      unit: "%",
      progress: avoidanceRate,
      color: avoidanceRate > 50 ? "bg-pressure" : avoidanceRate > 25 ? "bg-warning" : "bg-success",
      textColor: avoidanceRate > 50 ? "text-pressure" : avoidanceRate > 25 ? "text-warning" : "text-success"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6",
      "data-ocid": "dashboard.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-lg uppercase tracking-widest text-foreground", children: "Reality Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "No sugar-coating" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: statCards.map((card, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: idx * 0.1 },
            className: `bg-card border rounded-lg px-5 py-4 ${card.border}`,
            "data-ocid": "dashboard.card",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: card.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-mono font-black text-5xl ${card.color}`, children: card.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: card.sub })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${card.bg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(card.icon, { className: `w-5 h-5 ${card.color}` }) })
            ] })
          },
          card.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: metricCards.map((card, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 + idx * 0.1 },
            className: "bg-card border border-border rounded-lg px-5 py-4",
            "data-ocid": "dashboard.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(card.icon, { className: `w-4 h-4 ${card.textColor}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: card.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `font-mono font-black text-3xl ${card.textColor}`,
                    children: card.value
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm mb-1", children: card.unit })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: `h-full rounded-full ${card.color}`,
                  initial: { width: 0 },
                  animate: { width: `${card.progress}%` },
                  transition: { duration: 1, delay: 0.5 + idx * 0.1 }
                }
              ) })
            ]
          },
          card.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `bg-card border rounded-lg px-6 py-5 ${burdenScore > 70 ? "card-glow-red border-pressure/30" : burdenScore > 40 ? "card-glow-amber border-warning/30" : "border-border"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-1", children: "Current Future Burden" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `font-mono font-black text-5xl ${burdenScore > 70 ? "text-pressure" : burdenScore > 40 ? "text-warning" : "text-success"}`,
                      children: burdenScore
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-lg mb-1", children: "/100" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 max-w-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-6 bg-secondary rounded-full overflow-hidden relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[30%] bg-success/20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[40%] bg-warning/20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[30%] bg-pressure/20" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      className: `h-full rounded-full relative ${burdenScore > 70 ? "bg-pressure" : burdenScore > 40 ? "bg-warning" : "bg-success"}`,
                      initial: { width: 0 },
                      animate: { width: `${Math.min(burdenScore, 100)}%` },
                      transition: { duration: 1.2, ease: "easeOut" }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-1 text-[9px] text-muted-foreground uppercase tracking-wider", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "70" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100" })
                ] })
              ] }),
              burdenScore > 70 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-pressure text-sm font-bold uppercase tracking-wider animate-text-pulse", children: "CRITICAL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Immediate action required" })
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  RealityDashboard
};
