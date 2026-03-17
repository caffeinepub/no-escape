import { c as createLucideIcon, r as reactExports, T as TaskState, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-CB4bI8Pq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12.5 17-.5-1-.5 1h1z", key: "3me087" }],
  [
    "path",
    {
      d: "M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",
      key: "1o5pge"
    }
  ],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }]
];
const Skull = createLucideIcon("skull", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5", key: "1hfsw2" }],
  ["line", { x1: "13", x2: "19", y1: "19", y2: "13", key: "1vrmhu" }],
  ["line", { x1: "16", x2: "20", y1: "16", y2: "20", key: "1bron3" }],
  ["line", { x1: "19", x2: "21", y1: "21", y2: "19", key: "13pww6" }]
];
const Sword = createLucideIcon("sword", __iconNode);
function BossFightMode({
  tasks,
  onActivate,
  onDefeat
}) {
  const [active, setActive] = reactExports.useState(false);
  const eligibleTasks = tasks.filter(
    (t) => t.state === TaskState.idle || t.state === TaskState.avoided
  );
  const totalMinutes = eligibleTasks.reduce(
    (sum, t) => sum + Number(t.estimatedMinutes),
    0
  );
  if (eligibleTasks.length < 3 && !active) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    !active && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        className: "bg-card border border-pressure/50 rounded-lg p-5",
        "data-ocid": "boss.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { className: "w-6 h-6 text-pressure" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-black text-base uppercase tracking-widest text-pressure", children: "Boss Fight Available" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                eligibleTasks.length,
                " unfinished tasks combining into final challenge"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActive(true),
              className: "w-full flex items-center justify-center gap-2 bg-pressure hover:bg-pressure-dark text-white font-black uppercase tracking-widest text-sm py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95",
              "data-ocid": "boss.open_modal_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { className: "w-4 h-4" }),
                "⚔ ACTIVATE BOSS FIGHT"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: active && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[90] bg-[oklch(0.08_0.04_20)] flex items-center justify-center p-4",
        "data-ocid": "boss.modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { type: "spring", stiffness: 200, damping: 20 },
            className: "w-full max-w-2xl bg-card border-2 border-pressure rounded-xl overflow-hidden",
            style: {
              boxShadow: "0 0 60px oklch(0.4 0.2 20), 0 0 120px oklch(0.25 0.12 20)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-pressure/20 border-b border-pressure/40 px-6 py-5 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "⚔️" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl uppercase tracking-tighter text-pressure mb-1", children: "BOSS FIGHT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm uppercase tracking-widest text-muted-foreground", children: "THE FINAL STAND" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: [
                  "Combined Enemies (",
                  eligibleTasks.length,
                  ") — ",
                  totalMinutes,
                  " ",
                  "minutes total"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: eligibleTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-3 bg-pressure/10 border border-pressure/20 rounded px-3 py-2",
                    "data-ocid": `boss.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { className: "w-3.5 h-3.5 text-pressure flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-semibold flex-1 truncate", children: task.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                        Number(task.estimatedMinutes),
                        "m"
                      ] })
                    ]
                  },
                  task.id
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-t border-border space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setActive(false);
                      onActivate();
                    },
                    className: "w-full flex items-center justify-center gap-2 bg-success hover:bg-success-dark text-white font-black uppercase tracking-widest text-base py-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95",
                    "data-ocid": "boss.confirm_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { className: "w-5 h-5" }),
                      "DEFEAT THE BOSS"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setActive(false);
                      onDefeat();
                    },
                    className: "w-full flex items-center justify-center gap-2 bg-secondary hover:bg-surface-elevated border border-border text-muted-foreground font-bold uppercase tracking-widest text-sm py-3 rounded-lg transition-all duration-200",
                    "data-ocid": "boss.cancel_button",
                    children: "RETREAT (PENALTY)"
                  }
                )
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
export {
  BossFightMode
};
