import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, Z as Zap } from "./index-CB4bI8Pq.js";
import { X } from "./x-DSv980EX.js";
import { C as CircleCheck } from "./circle-check-CDBbxl5l.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode);
const PRESSURE_PROMPTS = [
  "Stay with it.",
  "Don't escape.",
  "You started this.",
  "Finish what you began.",
  "No exits here.",
  "This is your moment.",
  "Every second counts.",
  "Don't let yourself down."
];
function FocusMode({ task, onComplete, onExitRequest }) {
  const [elapsedSeconds, setElapsedSeconds] = reactExports.useState(0);
  const [subtasks, setSubtasks] = reactExports.useState(task.subtasks);
  const [promptIndex, setPromptIndex] = reactExports.useState(0);
  const [promptVisible, setPromptVisible] = reactExports.useState(true);
  const intervalRef = reactExports.useRef(null);
  const promptIntervalRef = reactExports.useRef(null);
  const estimatedSeconds = Number(task.estimatedMinutes) * 60;
  const isOverdue = elapsedSeconds > estimatedSeconds;
  const progress = estimatedSeconds > 0 ? Math.min(elapsedSeconds / estimatedSeconds * 100, 100) : 0;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedSecs = elapsedSeconds % 60;
  const timeDisplay = `${String(elapsedMinutes).padStart(2, "0")}:${String(elapsedSecs).padStart(2, "0")}`;
  reactExports.useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1e3);
    promptIntervalRef.current = setInterval(() => {
      setPromptVisible(false);
      setTimeout(() => {
        setPromptIndex((i) => (i + 1) % PRESSURE_PROMPTS.length);
        setPromptVisible(true);
      }, 500);
    }, 1e4);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
    };
  }, []);
  const toggleSubtask = (id) => {
    setSubtasks(
      (prev) => prev.map((s) => s.id === id ? { ...s, completed: !s.completed } : s)
    );
  };
  const handleComplete = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
    onComplete(Math.ceil(elapsedSeconds / 60), subtasks);
  };
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress = subtasks.length > 0 ? completedSubtasks / subtasks.length * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: `fixed inset-0 z-[100] bg-background flex flex-col ${isOverdue ? "animate-overdue-pulse" : "animate-focus-pulse"}`,
      style: { background: "oklch(0.07 0.008 228)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-pressure animate-text-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-pressure", children: "FOCUS MODE — ACTIVE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: onExitRequest,
              className: "text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground flex items-center gap-1 px-3 py-1 rounded border border-border hover:border-pressure transition-colors",
              "data-ocid": "focus.close_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
                " Exit"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-4 gap-8 max-w-2xl mx-auto w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0 },
              className: "text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Current Task" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight uppercase text-center", children: task.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-muted-foreground", children: [
                  "Est. ",
                  Number(task.estimatedMinutes),
                  " min",
                  task.difficultyMultiplier > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-warning", children: [
                    "×",
                    task.difficultyMultiplier.toFixed(1),
                    " difficulty"
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `font-mono text-7xl sm:text-8xl font-bold tracking-tighter tabular-nums ${isOverdue ? "text-pressure animate-text-pulse" : "text-foreground"}`,
                children: timeDisplay
              }
            ),
            isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-pressure text-sm font-bold uppercase tracking-wider mt-2 animate-text-pulse", children: [
              "OVERTIME — You said ",
              Number(task.estimatedMinutes),
              " minutes"
            ] }),
            !isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground text-sm mt-2", children: [
              Number(task.estimatedMinutes) - elapsedMinutes,
              " min remaining"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground uppercase tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                Math.round(progress),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: `h-full rounded-full ${isOverdue ? "bg-pressure" : progress > 80 ? "bg-success" : "bg-warning"}`,
                style: { width: `${progress}%` },
                transition: { duration: 0.5 }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `text-center transition-opacity duration-500 ${promptVisible ? "opacity-100" : "opacity-0"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `font-display font-bold text-xl ${isOverdue ? "text-pressure" : "text-muted-foreground"}`,
                  children: [
                    "“",
                    PRESSURE_PROMPTS[promptIndex],
                    "”"
                  ]
                }
              )
            }
          ),
          subtasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Subtasks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                completedSubtasks,
                "/",
                subtasks.length
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-secondary rounded-full overflow-hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-success rounded-full transition-all duration-500",
                style: { width: `${subtaskProgress}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: subtasks.map((subtask, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleSubtask(subtask.id),
                className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${subtask.completed ? "bg-success/10 border-success/30 text-muted-foreground" : "bg-card border-border hover:border-warning text-foreground"}`,
                "data-ocid": `focus.checkbox.${idx + 1}`,
                children: [
                  subtask.completed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-success flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-sm font-medium ${subtask.completed ? "line-through" : ""}`,
                      children: subtask.title
                    }
                  )
                ]
              },
              subtask.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleComplete,
              className: "flex-1 bg-success hover:bg-success-dark text-white font-black uppercase tracking-widest py-4 rounded-lg text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
              "data-ocid": "focus.primary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5" }),
                "COMPLETE TASK"
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  FocusMode
};
