import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Task } from "../backend";

interface ExitConfirmModalProps {
  open: boolean;
  onStay: () => void;
  onEscape: (minutesSpent: number) => void;
  focusTask: Task | null;
}

export function ExitConfirmModal({
  open,
  onStay,
  onEscape,
  focusTask,
}: ExitConfirmModalProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      // Reset and clear when closed
      setElapsedSeconds(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    // Start tracking elapsed time while modal is open
    setElapsedSeconds(0);
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [open]);

  if (!focusTask) return null;

  const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onStay();
      }}
    >
      <DialogContent
        className="bg-card border border-border max-w-2xl"
        data-ocid="exit.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-pressure" />
            <DialogTitle className="font-display font-black text-xl uppercase tracking-tight text-foreground">
              Are you quitting or escaping?
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-2">
          <div className="bg-pressure/10 border border-pressure/30 rounded-lg p-3 mb-5">
            <p className="text-sm text-foreground font-semibold">
              {focusTask.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {Number(focusTask.skipCount) > 0 && (
                <span className="text-warning">
                  Skipped {Number(focusTask.skipCount)} time
                  {Number(focusTask.skipCount) > 1 ? "s" : ""}.{" "}
                </span>
              )}
              Difficulty: ×{focusTask.difficultyMultiplier.toFixed(1)}
              {elapsedSeconds > 0 && (
                <span className="ml-2 text-pressure">
                  · {elapsedSeconds}s on this decision
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="border border-pressure/60 bg-pressure/5 rounded-lg p-4">
              <div className="text-xs font-black uppercase tracking-widest text-pressure mb-3">
                IF YOU QUIT
              </div>
              <ul className="space-y-2">
                {[
                  "Burden increases",
                  "Task mutates (harder)",
                  "Discipline −15 pts",
                  "Loop count +1",
                  "Your future self pays",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="text-pressure mt-0.5 flex-shrink-0">
                      ▸
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-success/60 bg-success/5 rounded-lg p-4">
              <div className="text-xs font-black uppercase tracking-widest text-success mb-3">
                IF YOU STAY
              </div>
              <ul className="space-y-2">
                {[
                  "Identity strength +10",
                  "Discipline maintained",
                  "Burden unchanged",
                  "Streak protected",
                  "Future self thanks you",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="text-success mt-0.5 flex-shrink-0">▸</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onStay}
              className="w-full bg-success hover:bg-success-dark text-white font-black uppercase tracking-widest py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
              data-ocid="exit.confirm_button"
            >
              <Shield className="w-4 h-4" />
              STAY AND FIGHT
            </button>
            <button
              type="button"
              onClick={() => onEscape(elapsedMinutes)}
              className="w-full bg-pressure/20 hover:bg-pressure/40 border border-pressure/50 text-pressure font-bold uppercase tracking-widest py-2 rounded-lg text-xs transition-all duration-200"
              data-ocid="exit.cancel_button"
            >
              ESCAPE (mark as avoided)
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
