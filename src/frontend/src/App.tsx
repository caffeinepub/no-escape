import { Toaster } from "@/components/ui/sonner";
import { AlertTriangle, Shield, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  Outcome,
  type Stats,
  type Subtask,
  type Task,
  TaskState,
} from "./backend";
import { BurdenMeterCard } from "./components/BurdenMeterCard";
import { IdentityPanel } from "./components/IdentityPanel";
import { TaskListCard } from "./components/TaskListCard";
import { TimeBleed } from "./components/TimeBleed";
import { Tutorial, useTutorial } from "./components/Tutorial";
import { useActor } from "./hooks/useActor";
import { useIdentity } from "./hooks/useIdentity";
import { useLoopDetection } from "./hooks/useLoopDetection";
import { useRegression } from "./hooks/useRegression";

// Lazy-load heavy components that are not needed on initial render
const AICoach = lazy(() =>
  import("./components/AICoach").then((m) => ({ default: m.AICoach })),
);
const BossFightMode = lazy(() =>
  import("./components/BossFightMode").then((m) => ({
    default: m.BossFightMode,
  })),
);
const ExitConfirmModal = lazy(() =>
  import("./components/ExitConfirmModal").then((m) => ({
    default: m.ExitConfirmModal,
  })),
);
const FocusMode = lazy(() =>
  import("./components/FocusMode").then((m) => ({ default: m.FocusMode })),
);
const RealityDashboard = lazy(() =>
  import("./components/RealityDashboard").then((m) => ({
    default: m.RealityDashboard,
  })),
);
const RegressionPanel = lazy(() =>
  import("./components/RegressionPanel").then((m) => ({
    default: m.RegressionPanel,
  })),
);
const UserFactsWidget = lazy(() =>
  import("./components/UserFactsWidget").then((m) => ({
    default: m.UserFactsWidget,
  })),
);

const SAMPLE_TASKS: Array<{
  title: string;
  minutes: number;
  subtasks: string[];
}> = [
  {
    title: "Review project proposal",
    minutes: 45,
    subtasks: [
      "Read executive summary",
      "Check budget allocation",
      "Note key risks",
    ],
  },
  {
    title: "Write weekly report",
    minutes: 30,
    subtasks: ["Gather metrics", "Draft summary", "Send to team"],
  },
  {
    title: "Clear email inbox",
    minutes: 20,
    subtasks: ["Archive old threads", "Reply to pending", "Flag action items"],
  },
  {
    title: "Exercise session",
    minutes: 60,
    subtasks: ["Warm up 10 min", "Main workout 40 min", "Cool down 10 min"],
  },
];

export default function App() {
  const { actor } = useActor();
  const identity = useIdentity();
  const regression = useRegression();
  const loopDetection = useLoopDetection();
  const tutorial = useTutorial();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [focusSessionId, setFocusSessionId] = useState<string | null>(null);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [pressureLevel, setPressureLevel] = useState(0);
  const [_isLoading, setIsLoading] = useState(true);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [lastIdentityMessage, setLastIdentityMessage] = useState<
    string | undefined
  >();

  const pressureTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pressureLevelRef = useRef(0);
  pressureLevelRef.current = pressureLevel;

  // Stable refs for timers so they don't trigger stale closure re-renders
  const tasksRef = useRef<Task[]>(tasks);
  tasksRef.current = tasks;

  // Guard against StrictMode double-init
  const initializedRef = useRef(false);

  const loadData = useCallback(async () => {
    if (!actor) return [];
    try {
      const [allTasks, allStats] = await Promise.all([
        actor.getAllTasks(),
        actor.getStats(),
      ]);
      setTasks(allTasks);
      setStats(allStats);
      return allTasks;
    } catch (e) {
      console.error("Failed to load data", e);
      return [];
    }
  }, [actor]);

  useEffect(() => {
    const init = async () => {
      if (!actor) return;
      if (initializedRef.current) return;
      initializedRef.current = true;
      setIsLoading(true);
      const existing = await loadData();
      if (existing.length === 0) {
        await Promise.all(
          SAMPLE_TASKS.map((t) =>
            actor.createTask(
              crypto.randomUUID(),
              t.title,
              BigInt(t.minutes),
              t.subtasks.map((s) => ({
                id: crypto.randomUUID(),
                title: s,
                completed: false,
              })),
            ),
          ),
        );
        await loadData();
      }
      setIsLoading(false);
    };
    init();
  }, [loadData, actor]);

  useEffect(() => {
    const PRESSURE_MESSAGES = [
      "You have tasks waiting.",
      "You're avoiding again.",
      "You chose comfort over progress.",
      "This is who you are now?",
      "Every second you wait, it gets heavier.",
    ];
    pressureTimerRef.current = setInterval(() => {
      const currentTasks = tasksRef.current;
      const idleTasks = currentTasks.filter((t) => t.state === TaskState.idle);
      if (idleTasks.length > 0) {
        const level = pressureLevelRef.current;
        const msg =
          PRESSURE_MESSAGES[Math.min(level, PRESSURE_MESSAGES.length - 1)];
        toast.error(msg, {
          description: `${idleTasks.length} task${
            idleTasks.length > 1 ? "s" : ""
          } waiting for you.`,
          position: "bottom-left",
          duration: 5000,
        });
        setPressureLevel((p) => p + 1);
      }
    }, 30000);
    return () => {
      if (pressureTimerRef.current) clearInterval(pressureTimerRef.current);
    };
  }, []);

  // Idle seconds — only when not in focus mode
  useEffect(() => {
    if (focusTask) {
      setIdleSeconds(0);
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
      return;
    }
    idleTimerRef.current = setInterval(() => {
      const hasIdle = tasksRef.current.some((t) => t.state === TaskState.idle);
      if (hasIdle) setIdleSeconds((s) => s + 1);
      else setIdleSeconds(0);
    }, 1000);
    return () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [focusTask]);

  const handleStartFocus = async (task: Task) => {
    if (!actor) return;
    const sessionId = crypto.randomUUID();
    setIdleSeconds(0);
    try {
      await actor.startSession(sessionId, task.id);
      const updated = { ...task, state: TaskState.active };
      await actor.updateTask(task.id, updated);
      setFocusTask(updated);
      setFocusSessionId(sessionId);
      await loadData();
    } catch (e) {
      console.error("Failed to start session", e);
      toast.error("Failed to start focus session.");
    }
  };

  const handleCompleteTask = async (
    minutesSpent: number,
    updatedSubtasks: Subtask[],
  ) => {
    if (!focusTask || !focusSessionId) return;
    try {
      const updatedTask: Task = {
        ...focusTask,
        state: TaskState.completed,
        subtasks: updatedSubtasks,
      };
      await Promise.all([
        actor?.endSession(
          focusSessionId,
          Outcome.completed,
          BigInt(minutesSpent),
        ),
        actor?.updateTask(focusTask.id, updatedTask),
      ]);
      identity.addStrength(10);
      regression.onComplete();
      const msg = identity.identityMessage("complete");
      setLastIdentityMessage(msg);
      toast.success(msg, {
        description: "Task completed. Burden reduced.",
        position: "bottom-center",
        duration: 6000,
      });
      setPressureLevel(0);
      setFocusTask(null);
      setFocusSessionId(null);
      await loadData();
    } catch (e) {
      console.error("Failed to complete task", e);
    }
  };

  const handleEscapeTask = async (minutesSpent: number) => {
    if (!focusTask || !focusSessionId) return;
    try {
      const updatedTask: Task = { ...focusTask, state: TaskState.avoided };
      await Promise.all([
        actor?.endSession(
          focusSessionId,
          Outcome.avoided,
          BigInt(minutesSpent),
        ),
        actor?.updateTask(focusTask.id, updatedTask),
        actor?.carryOverTasks(),
      ]);
      identity.subtractStrength(15);
      regression.onAvoid();
      loopDetection.logAvoidance(focusTask.id, focusTask.title);
      const loopWarning = loopDetection.getLoopWarning(focusTask.id);
      const msg = identity.identityMessage("avoid");
      setLastIdentityMessage(msg);
      toast.error(msg, {
        description: "Future burden increased. You'll pay for this.",
        position: "bottom-center",
        duration: 6000,
      });
      if (loopWarning) {
        setTimeout(() => {
          toast.error("LOOP DETECTED", {
            description: loopWarning,
            position: "bottom-center",
            duration: 8000,
          });
        }, 1200);
      }
      setFocusTask(null);
      setFocusSessionId(null);
      setExitConfirmOpen(false);
      await loadData();
    } catch (e) {
      console.error("Failed to escape task", e);
    }
  };

  const handleAddTask = async (title: string, minutes: number) => {
    if (!actor) return;
    const id = crypto.randomUUID();
    try {
      await actor.createTask(id, title, BigInt(minutes), []);
      await loadData();
      toast.success("Task added. Now do it.", {
        position: "bottom-center",
        duration: 3000,
      });
    } catch (e) {
      console.error("Failed to create task", e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!actor) return;
    try {
      await actor.deleteTask(taskId);
      await loadData();
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  };

  const handleBossWin = async () => {
    if (!actor) return;
    const unfinished = tasks.filter(
      (t) => t.state === TaskState.idle || t.state === TaskState.avoided,
    );
    try {
      await Promise.all(
        unfinished.map((t) =>
          actor.updateTask(t.id, { ...t, state: TaskState.completed }),
        ),
      );
      identity.addStrength(25);
      regression.onComplete();
      toast.success("DAY WON. You defeated every challenge.", {
        description: `${unfinished.length} tasks defeated.`,
        position: "bottom-center",
        duration: 8000,
      });
      await loadData();
    } catch (e) {
      console.error("Boss win failed", e);
    }
  };

  const handleBossDefeat = async () => {
    if (!actor) return;
    const remaining = tasks.filter(
      (t) => t.state === TaskState.idle || t.state === TaskState.avoided,
    );
    try {
      await Promise.all([
        ...remaining.map((t) =>
          actor.updateTask(t.id, { ...t, state: TaskState.avoided }),
        ),
        actor.carryOverTasks(),
      ]);
      identity.subtractStrength(20);
      regression.onAvoid();
      toast.error("DEFEATED. Tomorrow will be worse.", {
        description: "All remaining tasks carried over with penalty.",
        position: "bottom-center",
        duration: 8000,
      });
      await loadData();
    } catch (e) {
      console.error("Boss defeat failed", e);
    }
  };

  const handleSlipping = async () => {
    const idleTask = tasks.find((t) => t.state === TaskState.idle);
    if (!idleTask) {
      toast("No idle tasks. You're already doing it.", {
        position: "bottom-center",
      });
      return;
    }
    const microId = crypto.randomUUID();
    const microTitle = `MICRO: ${idleTask.title.slice(0, 40)}`;
    try {
      if (!actor) return;
      await actor.createTask(microId, microTitle, BigInt(5), [
        {
          id: crypto.randomUUID(),
          title: "Focus for 5 minutes",
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          title: "Make ONE small step",
          completed: false,
        },
      ]);
      toast("5-minute micro-task assigned. No excuses.", {
        description: microTitle,
        position: "bottom-center",
        duration: 5000,
      });
      const updatedTasks = await actor.getAllTasks();
      setTasks(updatedTasks);
      const microTask = updatedTasks.find((t) => t.id === microId);
      if (microTask) await handleStartFocus(microTask);
    } catch (e) {
      console.error("Failed to create micro task", e);
    }
  };

  const burdenScore = stats ? Number(stats.currentBurdenScore) : 0;
  const completedCount = stats ? Number(stats.completedCount) : 0;
  const avoidedCount = stats ? Number(stats.avoidedCount) : 0;
  const totalFocusMinutes = stats ? Number(stats.totalFocusMinutes) : 0;
  const hasIdleTasks = tasks.some((t) => t.state === TaskState.idle);

  const factsStats = {
    completed: completedCount,
    avoided: avoidedCount,
    focusMinutes: totalFocusMinutes,
    burdenScore,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border"
        data-ocid="nav.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-pressure" />
            <span className="font-display font-black text-xl tracking-tighter text-foreground uppercase">
              NO<span className="text-pressure">X</span>ESCAPE
            </span>
          </div>
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            <button
              type="button"
              className="text-sm font-semibold uppercase tracking-wider text-pressure border-b-2 border-pressure pb-0.5"
              data-ocid="nav.link"
            >
              Dashboard
            </button>
            <button
              type="button"
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              Survival Guide
            </button>
            <button
              type="button"
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              Progress
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  identity.strength > 60
                    ? "bg-success"
                    : identity.strength > 30
                      ? "bg-warning"
                      : "bg-pressure animate-pulse"
                }`}
              />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                ID: {identity.strength}
              </span>
            </div>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
                <span className="text-xs font-bold text-foreground">YU</span>
              </div>
              {burdenScore > 50 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pressure rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  !
                </span>
              )}
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-foreground">
                Survivor
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Burden:{" "}
                <span
                  className={
                    burdenScore > 70
                      ? "text-pressure"
                      : burdenScore > 40
                        ? "text-warning"
                        : "text-success"
                  }
                >
                  {burdenScore}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section
          className="bg-gradient-to-b from-surface to-background border-b border-border py-10 px-4"
          data-ocid="hero.section"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              {/* No initial/animate delay — renders immediately */}
              <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-none text-foreground animate-glow-red mb-4">
                THERE IS
                <br />
                <span className="text-pressure">NO ESCAPE</span>
              </h1>
              <p className="text-muted-foreground text-base mb-6 max-w-md">
                This system doesn't let you procrastinate. Every task avoided
                compounds your future burden. Every task completed sets you
                free. Choose wisely.
              </p>
              <button
                type="button"
                onClick={() => {
                  const idleTask = tasks.find(
                    (t) => t.state === TaskState.idle,
                  );
                  if (idleTask) handleStartFocus(idleTask);
                  else
                    toast("All tasks done or in progress. Good.", {
                      position: "bottom-center",
                    });
                }}
                className="inline-flex items-center gap-2 bg-pressure hover:bg-pressure-dark text-white font-bold uppercase tracking-widest text-sm px-8 py-3 rounded transition-all duration-200 hover:scale-105 active:scale-95"
                data-ocid="hero.primary_button"
              >
                <Zap className="w-4 h-4" />
                ENTER FOCUS MODE
              </button>
            </div>
            <div className="space-y-4">
              {!focusTask && hasIdleTasks && (
                <div className="flex justify-center">
                  <TimeBleed idleSeconds={idleSeconds} maxIdleSeconds={300} />
                </div>
              )}
              {/* Reduced delays to 0 for snappy paint */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    Future Burden
                  </span>
                  <span
                    className={`text-2xl font-mono font-bold ${burdenScore > 70 ? "text-pressure" : burdenScore > 40 ? "text-warning" : "text-success"}`}
                  >
                    {burdenScore}/100
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${burdenScore > 70 ? "bg-pressure" : burdenScore > 40 ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${Math.min(burdenScore, 100)}%` }}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    Task Completion
                  </span>
                  <span className="text-2xl font-mono font-bold text-success">
                    {completedCount}/{tasks.length}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-1000"
                    style={{
                      width:
                        tasks.length > 0
                          ? `${(completedCount / tasks.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 pt-6"
          id="identity-panel-section"
        >
          <IdentityPanel
            traits={identity.traits}
            strength={identity.strength}
            setTraits={identity.setTraits}
            lastMessage={lastIdentityMessage}
          />
        </section>

        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
          data-ocid="main.section"
          id="task-list-section"
        >
          <TaskListCard
            tasks={tasks}
            onStartFocus={handleStartFocus}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
          <div className="space-y-6">
            <div id="burden-meter-section">
              <BurdenMeterCard burdenScore={burdenScore} tasks={tasks} />
            </div>
            <Suspense fallback={null}>
              <div id="regression-section">
                <RegressionPanel skills={regression.skills} />
              </div>
            </Suspense>
            <Suspense fallback={null}>
              <BossFightMode
                tasks={tasks}
                onActivate={handleBossWin}
                onDefeat={handleBossDefeat}
              />
            </Suspense>
          </div>
        </section>

        <Suspense fallback={null}>
          <RealityDashboard
            completedCount={completedCount}
            avoidedCount={avoidedCount}
            totalFocusMinutes={totalFocusMinutes}
            burdenScore={burdenScore}
            tasks={tasks}
          />
        </Suspense>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <Suspense fallback={null}>
            <AICoach />
          </Suspense>
        </section>
      </main>

      <footer className="border-t border-border bg-surface py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              NO ESCAPE
            </span>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}
            </span>
            <span className="text-xs font-bold text-pressure uppercase tracking-wider animate-text-pulse">
              <AlertTriangle className="inline w-3 h-3 mr-1" />
              CRITICAL MODE ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="text-warning hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* I'm Slipping — bottom-left to avoid overlap with Facts widget */}
      <button
        type="button"
        onClick={handleSlipping}
        className="fixed bottom-6 left-6 z-50 bg-pressure hover:bg-pressure-dark text-white font-black uppercase tracking-wider text-sm px-6 py-4 rounded-lg animate-emergency shadow-card-lg flex items-center gap-2"
        data-ocid="emergency.button"
        id="emergency-button"
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="hidden sm:inline">I'M SLIPPING!</span>
        <span className="sm:hidden">SOS</span>
      </button>

      {/* Facts widget — bottom-right corner */}
      <Suspense fallback={null}>
        <UserFactsWidget
          tasks={tasks}
          stats={factsStats}
          identityTraits={identity.traits}
        />
      </Suspense>

      <AnimatePresence>
        {focusTask && (
          <Suspense fallback={null}>
            <FocusMode
              task={focusTask}
              onComplete={handleCompleteTask}
              onExitRequest={() => setExitConfirmOpen(true)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <ExitConfirmModal
          open={exitConfirmOpen}
          onStay={() => setExitConfirmOpen(false)}
          onEscape={(minutesSpent) => handleEscapeTask(minutesSpent)}
          focusTask={focusTask}
        />
      </Suspense>

      {tutorial.show && <Tutorial onDone={tutorial.dismiss} />}
      <Toaster richColors theme="dark" />
    </div>
  );
}
