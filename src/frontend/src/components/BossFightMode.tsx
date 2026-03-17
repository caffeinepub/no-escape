import { Skull, Sword } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type Task, TaskState } from "../backend";

interface BossFightModeProps {
  tasks: Task[];
  onActivate: () => void;
  onDefeat: () => void;
}

export function BossFightMode({
  tasks,
  onActivate,
  onDefeat,
}: BossFightModeProps) {
  const [active, setActive] = useState(false);

  const eligibleTasks = tasks.filter(
    (t) => t.state === TaskState.idle || t.state === TaskState.avoided,
  );
  const totalMinutes = eligibleTasks.reduce(
    (sum, t) => sum + Number(t.estimatedMinutes),
    0,
  );

  if (eligibleTasks.length < 3 && !active) return null;

  return (
    <>
      {!active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-pressure/50 rounded-lg p-5"
          data-ocid="boss.card"
        >
          <div className="flex items-center gap-3 mb-3">
            <Skull className="w-6 h-6 text-pressure" />
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-widest text-pressure">
                Boss Fight Available
              </h3>
              <p className="text-xs text-muted-foreground">
                {eligibleTasks.length} unfinished tasks combining into final
                challenge
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActive(true)}
            className="w-full flex items-center justify-center gap-2 bg-pressure hover:bg-pressure-dark text-white font-black uppercase tracking-widest text-sm py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
            data-ocid="boss.open_modal_button"
          >
            <Sword className="w-4 h-4" />⚔ ACTIVATE BOSS FIGHT
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[oklch(0.08_0.04_20)] flex items-center justify-center p-4"
            data-ocid="boss.modal"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full max-w-2xl bg-card border-2 border-pressure rounded-xl overflow-hidden"
              style={{
                boxShadow:
                  "0 0 60px oklch(0.4 0.2 20), 0 0 120px oklch(0.25 0.12 20)",
              }}
            >
              <div className="bg-pressure/20 border-b border-pressure/40 px-6 py-5 text-center">
                <div className="text-4xl mb-2">⚔️</div>
                <h2 className="font-display font-black text-3xl uppercase tracking-tighter text-pressure mb-1">
                  BOSS FIGHT
                </h2>
                <div className="text-sm uppercase tracking-widest text-muted-foreground">
                  THE FINAL STAND
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Combined Enemies ({eligibleTasks.length}) — {totalMinutes}{" "}
                  minutes total
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {eligibleTasks.map((task, i) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 bg-pressure/10 border border-pressure/20 rounded px-3 py-2"
                      data-ocid={`boss.item.${i + 1}`}
                    >
                      <Skull className="w-3.5 h-3.5 text-pressure flex-shrink-0" />
                      <span className="text-sm text-foreground font-semibold flex-1 truncate">
                        {task.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Number(task.estimatedMinutes)}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-5 border-t border-border space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setActive(false);
                    onActivate();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-success hover:bg-success-dark text-white font-black uppercase tracking-widest text-base py-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  data-ocid="boss.confirm_button"
                >
                  <Sword className="w-5 h-5" />
                  DEFEAT THE BOSS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActive(false);
                    onDefeat();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-surface-elevated border border-border text-muted-foreground font-bold uppercase tracking-widest text-sm py-3 rounded-lg transition-all duration-200"
                  data-ocid="boss.cancel_button"
                >
                  RETREAT (PENALTY)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
