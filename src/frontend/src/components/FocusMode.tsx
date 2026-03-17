import { CheckCircle2, Circle, X, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Subtask, Task } from "../backend";

const PRESSURE_PROMPTS = [
  "Stay with it.",
  "Don't escape.",
  "You started this.",
  "Finish what you began.",
  "No exits here.",
  "This is your moment.",
  "Every second counts.",
  "Don't let yourself down.",
];

interface FocusModeProps {
  task: Task;
  onComplete: (minutesSpent: number, subtasks: Subtask[]) => void;
  onExitRequest: () => void;
}

export function FocusMode({ task, onComplete, onExitRequest }: FocusModeProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks);
  const [promptIndex, setPromptIndex] = useState(0);
  const [promptVisible, setPromptVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const promptIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const estimatedSeconds = Number(task.estimatedMinutes) * 60;
  const isOverdue = elapsedSeconds > estimatedSeconds;
  const progress =
    estimatedSeconds > 0
      ? Math.min((elapsedSeconds / estimatedSeconds) * 100, 100)
      : 0;

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedSecs = elapsedSeconds % 60;
  const timeDisplay = `${String(elapsedMinutes).padStart(2, "0")}:${String(elapsedSecs).padStart(2, "0")}`;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    promptIntervalRef.current = setInterval(() => {
      setPromptVisible(false);
      setTimeout(() => {
        setPromptIndex((i) => (i + 1) % PRESSURE_PROMPTS.length);
        setPromptVisible(true);
      }, 500);
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
    };
  }, []);

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    );
  };

  const handleComplete = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
    onComplete(Math.ceil(elapsedSeconds / 60), subtasks);
  };

  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress =
    subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] bg-background flex flex-col ${
        isOverdue ? "animate-overdue-pulse" : "animate-focus-pulse"
      }`}
      style={{ background: "oklch(0.07 0.008 228)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-pressure animate-text-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-pressure">
            FOCUS MODE — ACTIVE
          </span>
        </div>
        <button
          type="button"
          onClick={onExitRequest}
          className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground flex items-center gap-1 px-3 py-1 rounded border border-border hover:border-pressure transition-colors"
          data-ocid="focus.close_button"
        >
          <X className="w-3 h-3" /> Exit
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8 max-w-2xl mx-auto w-full">
        {/* Task title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Current Task
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight uppercase text-center">
            {task.title}
          </h2>
          <div className="mt-2 text-sm text-muted-foreground">
            Est. {Number(task.estimatedMinutes)} min
            {task.difficultyMultiplier > 1.0 && (
              <span className="ml-2 text-warning">
                ×{task.difficultyMultiplier.toFixed(1)} difficulty
              </span>
            )}
          </div>
        </motion.div>

        {/* Timer */}
        <div className="text-center">
          <div
            className={`font-mono text-7xl sm:text-8xl font-bold tracking-tighter tabular-nums ${
              isOverdue ? "text-pressure animate-text-pulse" : "text-foreground"
            }`}
          >
            {timeDisplay}
          </div>
          {isOverdue && (
            <div className="text-pressure text-sm font-bold uppercase tracking-wider mt-2 animate-text-pulse">
              OVERTIME — You said {Number(task.estimatedMinutes)} minutes
            </div>
          )}
          {!isOverdue && (
            <div className="text-muted-foreground text-sm mt-2">
              {Number(task.estimatedMinutes) - elapsedMinutes} min remaining
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isOverdue
                  ? "bg-pressure"
                  : progress > 80
                    ? "bg-success"
                    : "bg-warning"
              }`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Pressure prompt */}
        <div
          className={`text-center transition-opacity duration-500 ${
            promptVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p
            className={`font-display font-bold text-xl ${
              isOverdue ? "text-pressure" : "text-muted-foreground"
            }`}
          >
            &ldquo;{PRESSURE_PROMPTS[promptIndex]}&rdquo;
          </p>
        </div>

        {/* Subtasks */}
        {subtasks.length > 0 && (
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Subtasks
              </span>
              <span className="text-xs text-muted-foreground">
                {completedSubtasks}/{subtasks.length}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-success rounded-full transition-all duration-500"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>
            <div className="space-y-2">
              {subtasks.map((subtask, idx) => (
                <button
                  type="button"
                  key={subtask.id}
                  onClick={() => toggleSubtask(subtask.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    subtask.completed
                      ? "bg-success/10 border-success/30 text-muted-foreground"
                      : "bg-card border-border hover:border-warning text-foreground"
                  }`}
                  data-ocid={`focus.checkbox.${idx + 1}`}
                >
                  {subtask.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      subtask.completed ? "line-through" : ""
                    }`}
                  >
                    {subtask.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 w-full">
          <button
            type="button"
            onClick={handleComplete}
            className="flex-1 bg-success hover:bg-success-dark text-white font-black uppercase tracking-widest py-4 rounded-lg text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            data-ocid="focus.primary_button"
          >
            <CheckCircle2 className="w-5 h-5" />
            COMPLETE TASK
          </button>
        </div>
      </div>
    </motion.div>
  );
}
