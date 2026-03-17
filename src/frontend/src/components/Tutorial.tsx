import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TUTORIAL_KEY = "no-escape-tutorial-v1";

type Step = {
  id: string;
  title: string;
  description: string;
  targetId: string | null; // DOM element id to spotlight
  position: "top" | "bottom" | "left" | "right" | "center";
};

const STEPS: Step[] = [
  {
    id: "welcome",
    title: "Welcome to NO ESCAPE",
    description:
      "This app is designed to keep you accountable and moving forward. Procrastination has real costs here — but so does progress. Let's walk through how everything works.",
    targetId: null,
    position: "center",
  },
  {
    id: "tasks",
    title: "Your Task List",
    description:
      'This is your mission board. Add tasks, set time estimates, and break them into subtasks. Hit "Start Focus" on any task to enter a locked focus session. Tasks you avoid compound — they get harder over time.',
    targetId: "task-list-section",
    position: "bottom",
  },
  {
    id: "burden",
    title: "Future Burden Meter",
    description:
      "Every avoided task increases your burden score. Let it climb too high and you'll trigger Boss Fight Mode — a final stand against all your unfinished work. Keep it low by completing tasks.",
    targetId: "burden-meter-section",
    position: "left",
  },
  {
    id: "identity",
    title: "Identity System",
    description:
      "Define who you want to be. Your Identity Strength bar rises when you complete tasks and drops when you avoid them. The messages you see are tied to the traits you choose.",
    targetId: "identity-panel-section",
    position: "bottom",
  },
  {
    id: "regression",
    title: "Skills & Regression",
    description:
      "Focus, Discipline, and Momentum are your core stats. They grow when you work and decay when you avoid. Letting them drop too low makes everything feel harder — because it is.",
    targetId: "regression-section",
    position: "left",
  },
  {
    id: "coach",
    title: "AI Coach",
    description:
      "Stuck, overwhelmed, or losing motivation? Talk to your AI Coach. It's here to help you cut through the noise, work through blocks, and keep moving. You can also switch to Future Self mode for a longer view.",
    targetId: "ai-coach-section",
    position: "top",
  },
  {
    id: "slipping",
    title: "I'm Slipping Button",
    description:
      "When you're about to give up, hit this. It assigns a 5-minute micro-task and locks you in. No escape, but also no pressure — just 5 minutes. That's often all it takes to restart momentum.",
    targetId: "emergency-button",
    position: "top",
  },
  {
    id: "done",
    title: "You're Ready",
    description:
      "That's the system. Everything here is designed to make action easier than avoidance. There is no escape from your goals — only through them. Good luck.",
    targetId: null,
    position: "center",
  },
];

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function useSpotlight(targetId: string | null): SpotlightRect | null {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!targetId) {
      setRect(null);
      return;
    }
    const update = () => {
      const el = document.getElementById(targetId);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top + window.scrollY,
        left: r.left + window.scrollX,
        width: r.width,
        height: r.height,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [targetId]);

  return rect;
}

const PAD = 12;

export function Tutorial({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const spotlight = useSpotlight(current.targetId);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isLast = step === STEPS.length - 1;

  // Scroll target into view
  useEffect(() => {
    if (!current.targetId) return;
    const el = document.getElementById(current.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [current.targetId]);

  const next = useCallback(() => {
    if (isLast) {
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  }, [isLast, onDone]);

  const skip = useCallback(() => {
    onDone();
  }, [onDone]);

  // Compute tooltip position
  const getTooltipStyle = () => {
    if (!spotlight || current.position === "center") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const viewportW = window.innerWidth;
    const tooltipW = Math.min(340, viewportW - 32);

    switch (current.position) {
      case "bottom":
        return {
          top: spotlight.top + spotlight.height + PAD + window.scrollY,
          left: Math.max(
            16,
            Math.min(
              spotlight.left + spotlight.width / 2 - tooltipW / 2,
              viewportW - tooltipW - 16,
            ),
          ),
          width: tooltipW,
        };
      case "top":
        return {
          top: spotlight.top - PAD + window.scrollY,
          left: Math.max(
            16,
            Math.min(
              spotlight.left + spotlight.width / 2 - tooltipW / 2,
              viewportW - tooltipW - 16,
            ),
          ),
          width: tooltipW,
          transform: "translateY(-100%)",
        };
      case "left":
        return {
          top: spotlight.top + spotlight.height / 2 + window.scrollY,
          left: Math.max(16, spotlight.left - tooltipW - PAD),
          width: tooltipW,
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          top: spotlight.top + spotlight.height / 2 + window.scrollY,
          left: Math.min(
            spotlight.left + spotlight.width + PAD,
            viewportW - tooltipW - 16,
          ),
          width: tooltipW,
          transform: "translateY(-50%)",
        };
      default:
        return {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="tutorial-overlay"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{ isolation: "isolate" }}
      >
        {/* Dark overlay with cutout */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-auto"
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
          }}
          onClick={next}
          onKeyDown={(e) => {
            if (e.key === "Enter") next();
          }}
          aria-hidden="true"
        >
          <defs>
            <mask id="tutorial-mask">
              <rect width="100%" height="100%" fill="white" />
              {spotlight && (
                <rect
                  x={spotlight.left - PAD - window.scrollX}
                  y={spotlight.top - PAD - window.scrollY}
                  width={spotlight.width + PAD * 2}
                  height={spotlight.height + PAD * 2}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.75)"
            mask="url(#tutorial-mask)"
          />
        </svg>

        {/* Spotlight border glow */}
        {spotlight && (
          <div
            className="absolute pointer-events-none rounded-lg"
            style={{
              top: spotlight.top - PAD,
              left: spotlight.left - PAD,
              width: spotlight.width + PAD * 2,
              height: spotlight.height + PAD * 2,
              boxShadow:
                "0 0 0 2px rgba(239,68,68,0.7), 0 0 24px rgba(239,68,68,0.3)",
              border: "2px solid rgba(239,68,68,0.7)",
            }}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          ref={tooltipRef}
          key={`tooltip-${step}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="absolute pointer-events-auto bg-card border border-border rounded-xl shadow-2xl p-5 z-[10000]"
          style={{ ...getTooltipStyle(), maxWidth: 380 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-4 bg-pressure"
                      : i < step
                        ? "w-1.5 bg-pressure/40"
                        : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {step + 1} / {STEPS.length}
            </span>
          </div>

          {/* Label */}
          {current.targetId && (
            <div className="inline-flex items-center gap-1.5 bg-pressure/10 border border-pressure/30 rounded px-2 py-0.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pressure animate-pulse" />
              <span className="text-[10px] font-bold text-pressure uppercase tracking-widest">
                Highlighted Area
              </span>
            </div>
          )}

          <h3 className="font-display font-bold text-base text-foreground mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {current.description}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <button
              type="button"
              onClick={skip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tutorial
            </button>
            <button
              type="button"
              onClick={next}
              className="px-4 py-1.5 bg-pressure hover:bg-pressure-dark text-white text-xs font-bold uppercase tracking-wider rounded transition-all duration-150 hover:scale-105 active:scale-95"
            >
              {isLast ? "Let's go" : "Next"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

export function useTutorial() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(TUTORIAL_KEY);
    if (!done) {
      // Small delay so the app paints first
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(TUTORIAL_KEY, "done");
    setShow(false);
  }, []);

  return { show, dismiss };
}
