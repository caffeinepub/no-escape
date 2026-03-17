import { r as reactExports, T as TaskState, j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./index-CB4bI8Pq.js";
function loadLoopData() {
  try {
    const raw = localStorage.getItem("ne_loops");
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return { avoidances: [] };
}
function loadRegressionData() {
  try {
    const raw = localStorage.getItem("ne_regression");
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return null;
}
function useUserFacts({
  tasks,
  stats,
  identityTraits
}) {
  return reactExports.useMemo(() => {
    const facts = [];
    const loopData = loadLoopData();
    const regressionData = loadRegressionData();
    if (identityTraits.length > 0) {
      facts.push(
        `You have ${identityTraits.length} identity trait${identityTraits.length > 1 ? "s" : ""} defined: ${identityTraits[0]}${identityTraits.length > 1 ? " +more" : ""}.`
      );
    }
    if (identityTraits.length > 1) {
      facts.push(`Your primary identity trait is "${identityTraits[0]}".`);
    }
    if (stats.avoided > 0) {
      facts.push(
        `You've avoided tasks ${stats.avoided} time${stats.avoided > 1 ? "s" : ""} total.`
      );
    }
    if (stats.completed > 0) {
      facts.push(
        `You've completed ${stats.completed} task${stats.completed > 1 ? "s" : ""}.`
      );
    }
    if (regressionData) {
      facts.push(`Your discipline score is ${regressionData.discipline}/100.`);
      if (regressionData.momentum < 50) {
        facts.push(
          `Momentum is dropping — currently ${regressionData.momentum}/100.`
        );
      }
      if (regressionData.focus > 80) {
        facts.push(
          `Focus is strong at ${regressionData.focus}/100. Don't break the streak.`
        );
      }
    }
    if (stats.focusMinutes > 0) {
      facts.push(
        `You've spent ${stats.focusMinutes} minute${stats.focusMinutes > 1 ? "s" : ""} in focus mode.`
      );
    }
    if (loopData.avoidances.length > 0) {
      const countByTask = {};
      for (const a of loopData.avoidances) {
        if (!countByTask[a.taskId]) {
          countByTask[a.taskId] = { title: a.taskTitle, count: 0 };
        }
        countByTask[a.taskId].count++;
      }
      const mostAvoided = Object.values(countByTask).sort(
        (a, b) => b.count - a.count
      )[0];
      if (mostAvoided && mostAvoided.count >= 2) {
        facts.push(
          `Most avoided task: "${mostAvoided.title}" (${mostAvoided.count}×).`
        );
      }
      facts.push(
        `You've avoided tasks ${loopData.avoidances.length} times total across all sessions.`
      );
    }
    if (stats.burdenScore > 0) {
      const label = stats.burdenScore > 70 ? "Critical" : stats.burdenScore > 40 ? "Warning" : "Safe";
      facts.push(`Burden score: ${stats.burdenScore}/100 — ${label}.`);
    }
    const idleCount = tasks.filter((t) => t.state === TaskState.idle).length;
    if (idleCount > 0) {
      facts.push(
        `${idleCount} task${idleCount > 1 ? "s" : ""} still waiting for you right now.`
      );
    }
    const total = stats.completed + stats.avoided;
    if (total > 0) {
      const efficiency = Math.round(stats.completed / total * 100);
      facts.push(
        `Focus efficiency: ${efficiency}% (${stats.completed} done, ${stats.avoided} avoided).`
      );
    }
    if (facts.length === 0) {
      facts.push("The app is watching. Start a task.");
    }
    return facts;
  }, [
    tasks,
    stats.completed,
    stats.avoided,
    stats.focusMinutes,
    stats.burdenScore,
    identityTraits
  ]);
}
function UserFactsWidget({
  tasks,
  stats,
  identityTraits
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [factIndex, setFactIndex] = reactExports.useState(0);
  const [displayIndex, setDisplayIndex] = reactExports.useState(0);
  const intervalRef = reactExports.useRef(null);
  const facts = useUserFacts({ tasks, stats, identityTraits });
  reactExports.useEffect(() => {
    if (!expanded || facts.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setFactIndex((i) => (i + 1) % facts.length);
    }, 8e3);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [expanded, facts.length]);
  reactExports.useEffect(() => {
    setDisplayIndex(factIndex);
  }, [factIndex]);
  const currentFact = facts[displayIndex] ?? facts[0] ?? "The app is watching. Start a task.";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2",
      "data-ocid": "facts.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.92, y: 8 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.92, y: 8 },
            transition: { duration: 0.2 },
            className: "w-60 bg-card border border-pressure/40 rounded-lg shadow-xl overflow-hidden",
            style: {
              boxShadow: "0 0 12px 2px oklch(var(--pressure) / 0.18), 0 4px 24px 0 rgba(0,0,0,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border/60 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-pressure", children: "👁 WHAT THE APP KNOWS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setExpanded(false),
                    className: "text-muted-foreground hover:text-foreground transition-colors text-xs leading-none",
                    "aria-label": "Close facts",
                    "data-ocid": "facts.close_button",
                    children: "×"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 min-h-[72px] flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 6 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -6 },
                  transition: { duration: 0.3 },
                  className: "text-xs text-muted-foreground leading-relaxed",
                  children: currentFact
                },
                displayIndex
              ) }) }),
              facts.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: facts.map((fact, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setFactIndex(i),
                    "aria-label": `Fact ${i + 1}`,
                    className: `w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === displayIndex ? "bg-pressure scale-125" : "bg-border hover:bg-muted-foreground"}`
                  },
                  fact.slice(0, 20)
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground/60 font-mono", children: [
                  displayIndex + 1,
                  "/",
                  facts.length
                ] })
              ] })
            ]
          },
          "facts-card"
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setExpanded((e) => !e),
            className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200 border ${expanded ? "bg-pressure/20 border-pressure/60 text-pressure" : "bg-card border-pressure/30 text-muted-foreground hover:border-pressure/60 hover:text-pressure"}`,
            style: {
              boxShadow: expanded ? "0 0 8px 1px oklch(var(--pressure) / 0.25)" : void 0
            },
            "data-ocid": "facts.open_modal_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "👁" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FACTS" })
            ]
          }
        )
      ]
    }
  );
}
export {
  UserFactsWidget
};
