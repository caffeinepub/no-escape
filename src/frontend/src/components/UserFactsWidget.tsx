import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Task } from "../backend";
import { useUserFacts } from "../hooks/useUserFacts";

interface UserFactsWidgetProps {
  tasks: Task[];
  stats: {
    completed: number;
    avoided: number;
    focusMinutes: number;
    burdenScore: number;
  };
  identityTraits: string[];
}

export function UserFactsWidget({
  tasks,
  stats,
  identityTraits,
}: UserFactsWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const facts = useUserFacts({ tasks, stats, identityTraits });

  // Rotate facts every 8 seconds when expanded
  useEffect(() => {
    if (!expanded || facts.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setFactIndex((i) => (i + 1) % facts.length);
    }, 8000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [expanded, facts.length]);

  // Sync displayIndex after factIndex changes (allows AnimatePresence to swap)
  useEffect(() => {
    setDisplayIndex(factIndex);
  }, [factIndex]);

  const currentFact =
    facts[displayIndex] ?? facts[0] ?? "The app is watching. Start a task.";

  return (
    <div
      className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2"
      data-ocid="facts.panel"
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="facts-card"
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-60 bg-card border border-pressure/40 rounded-lg shadow-xl overflow-hidden"
            style={{
              boxShadow:
                "0 0 12px 2px oklch(var(--pressure) / 0.18), 0 4px 24px 0 rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-pressure">
                👁 WHAT THE APP KNOWS
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-xs leading-none"
                aria-label="Close facts"
                data-ocid="facts.close_button"
              >
                ×
              </button>
            </div>

            {/* Rotating fact */}
            <div className="px-4 py-4 min-h-[72px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={displayIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  {currentFact}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Dot indicators + manual nav */}
            {facts.length > 1 && (
              <div className="px-4 pb-3 flex items-center justify-between">
                <div className="flex gap-1">
                  {facts.map((fact, i) => (
                    <button
                      key={fact.slice(0, 20)}
                      type="button"
                      onClick={() => setFactIndex(i)}
                      aria-label={`Fact ${i + 1}`}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i === displayIndex
                          ? "bg-pressure scale-125"
                          : "bg-border hover:bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground/60 font-mono">
                  {displayIndex + 1}/{facts.length}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200 border ${
          expanded
            ? "bg-pressure/20 border-pressure/60 text-pressure"
            : "bg-card border-pressure/30 text-muted-foreground hover:border-pressure/60 hover:text-pressure"
        }`}
        style={{
          boxShadow: expanded
            ? "0 0 8px 1px oklch(var(--pressure) / 0.25)"
            : undefined,
        }}
        data-ocid="facts.open_modal_button"
      >
        <span>👁</span>
        <span>FACTS</span>
      </button>
    </div>
  );
}
