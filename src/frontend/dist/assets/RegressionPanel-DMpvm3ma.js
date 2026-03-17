import { j as jsxRuntimeExports, m as motion } from "./index-CB4bI8Pq.js";
function SkillBar({
  label,
  value,
  delay = 0
}) {
  const isRegressing = value < 40;
  const color = value >= 70 ? "bg-success" : value >= 40 ? "bg-warning" : "bg-pressure";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `p-3 rounded-lg border ${isRegressing ? "border-pressure/50 bg-pressure/5" : "border-border bg-secondary/30"}`,
      style: isRegressing ? { boxShadow: "0 0 12px oklch(0.35 0.18 20 / 0.3)" } : {},
      "data-ocid": "regression.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-foreground", children: label }),
            isRegressing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black uppercase tracking-wider text-pressure bg-pressure/20 px-1.5 py-0.5 rounded", children: "REGRESSING" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs font-mono font-bold ${value >= 70 ? "text-success" : value >= 40 ? "text-warning" : "text-pressure"}`,
              children: [
                value,
                " / 100"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-background rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: `h-full rounded-full ${color}`,
            initial: { width: 0 },
            animate: { width: `${value}%` },
            transition: { duration: 0.8, delay, ease: "easeOut" }
          }
        ) })
      ]
    }
  );
}
function RegressionPanel({ skills }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-lg overflow-hidden",
      "data-ocid": "regression.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base uppercase tracking-widest text-foreground", children: "Skill Regression" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Avoidance degrades your capabilities" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkillBar, { label: "Focus", value: skills.focus, delay: 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkillBar, { label: "Discipline", value: skills.discipline, delay: 0.1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkillBar, { label: "Momentum", value: skills.momentum, delay: 0.2 })
        ] })
      ]
    }
  );
}
export {
  RegressionPanel
};
