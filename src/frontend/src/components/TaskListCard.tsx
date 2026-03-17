import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type Task, TaskState } from "../backend";

interface TaskListCardProps {
  tasks: Task[];
  onStartFocus: (task: Task) => void;
  onAddTask: (title: string, minutes: number) => void;
  onDeleteTask: (taskId: string) => void;
}

function getStateColor(state: TaskState) {
  switch (state) {
    case TaskState.idle:
      return "bg-pressure";
    case TaskState.active:
      return "bg-warning";
    case TaskState.completed:
      return "bg-success";
    case TaskState.avoided:
      return "bg-muted-foreground";
  }
}

function getStateBadge(state: TaskState) {
  switch (state) {
    case TaskState.idle:
      return {
        label: "IDLE",
        class: "bg-pressure/20 text-pressure border-pressure/30",
      };
    case TaskState.active:
      return {
        label: "ACTIVE",
        class: "bg-warning/20 text-warning border-warning/30",
      };
    case TaskState.completed:
      return {
        label: "DONE",
        class: "bg-success/20 text-success border-success/30",
      };
    case TaskState.avoided:
      return {
        label: "AVOIDED",
        class: "bg-muted/50 text-muted-foreground border-border",
      };
  }
}

export function TaskListCard({
  tasks,
  onStartFocus,
  onAddTask,
  onDeleteTask,
}: TaskListCardProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newMinutes, setNewMinutes] = useState("25");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setIsAdding(true);
    await onAddTask(newTitle.trim(), Number.parseInt(newMinutes) || 25);
    setNewTitle("");
    setNewMinutes("25");
    setIsAdding(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const order = {
      [TaskState.active]: 0,
      [TaskState.idle]: 1,
      [TaskState.avoided]: 2,
      [TaskState.completed]: 3,
    };
    return order[a.state] - order[b.state];
  });

  return (
    <div
      className="bg-card border border-border rounded-lg shadow-card"
      data-ocid="tasks.card"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-base uppercase tracking-widest text-foreground">
            Task List
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {tasks.filter((t) => t.state === TaskState.idle).length} urgent ·{" "}
            {tasks.filter((t) => t.state === TaskState.completed).length} done
          </p>
        </div>
        <div className="text-2xl font-mono font-bold text-pressure">
          {tasks.length}
        </div>
      </div>

      <div className="divide-y divide-border" data-ocid="tasks.list">
        <AnimatePresence>
          {sortedTasks.length === 0 ? (
            <div
              className="py-8 text-center text-muted-foreground text-sm"
              data-ocid="tasks.empty_state"
            >
              No tasks. Add one below.
            </div>
          ) : (
            sortedTasks.map((task, idx) => {
              const badge = getStateBadge(task.state);
              const isExpanded = expandedTask === task.id;
              const isClickable = task.state === TaskState.idle;
              const isMutated =
                Number(task.skipCount) >= 2 || task.difficultyMultiplier >= 1.5;
              const extraMinutes = Math.round(
                Number(task.estimatedMinutes) * (task.difficultyMultiplier - 1),
              );

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                  data-ocid={`tasks.item.${idx + 1}`}
                >
                  <div className="flex items-center gap-0 px-0 py-0">
                    <div
                      className={`w-1 self-stretch flex-shrink-0 ${getStateColor(task.state)} rounded-l`}
                    />
                    <div className="flex-1 flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-semibold text-sm truncate ${
                              task.state === TaskState.completed
                                ? "text-muted-foreground line-through"
                                : task.state === TaskState.avoided
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </span>
                          {isMutated && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-pressure/30 border border-pressure/50 text-pressure flex items-center gap-0.5 flex-shrink-0">
                              <Zap className="w-2.5 h-2.5" />
                              MUTATED
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border flex-shrink-0 ${badge.class}`}
                          >
                            {badge.label}
                          </span>
                          {task.difficultyMultiplier > 1.0 && (
                            <span className="text-[10px] font-bold text-warning">
                              ×{task.difficultyMultiplier.toFixed(1)}
                            </span>
                          )}
                        </div>
                        {isMutated && (
                          <div className="text-[10px] text-warning mt-0.5 flex items-center gap-1">
                            <span>⚠</span>
                            <span>
                              Evolved: ×{task.difficultyMultiplier.toFixed(1)}{" "}
                              difficulty
                              {extraMinutes > 0 ? `, +${extraMinutes} min` : ""}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Number(task.estimatedMinutes)} min
                          </span>
                          {task.subtasks.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedTask(isExpanded ? null : task.id)
                              }
                              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
                              data-ocid={`tasks.toggle.${idx + 1}`}
                            >
                              {task.subtasks.filter((s) => s.completed).length}/
                              {task.subtasks.length} subtasks
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isClickable && (
                          <button
                            type="button"
                            onClick={() => onStartFocus(task)}
                            className="p-1.5 bg-pressure/20 hover:bg-pressure/40 text-pressure rounded transition-colors"
                            title="Start focus session"
                            data-ocid={`tasks.edit_button.${idx + 1}`}
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 text-muted-foreground hover:text-pressure rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete task"
                          data-ocid={`tasks.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && task.subtasks.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-background/50"
                      >
                        <div className="pl-9 pr-4 py-3 space-y-1.5">
                          {task.subtasks.map((s) => (
                            <div key={s.id} className="flex items-center gap-2">
                              <div
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.completed ? "bg-success" : "bg-border"}`}
                              />
                              <span
                                className={`text-xs ${s.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                              >
                                {s.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <div
        className="px-4 py-4 border-t border-border bg-background/30"
        data-ocid="tasks.panel"
      >
        <div className="flex gap-2 mb-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="New task..."
            className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm h-9"
            data-ocid="tasks.input"
          />
          <Input
            type="number"
            value={newMinutes}
            onChange={(e) => setNewMinutes(e.target.value)}
            placeholder="min"
            className="w-16 bg-secondary border-border text-foreground text-sm h-9 text-center"
            min="1"
            max="480"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newTitle.trim() || isAdding}
          className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-surface-elevated border border-border text-foreground font-semibold text-sm py-2 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          data-ocid="tasks.submit_button"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Adding..." : "ADD TASK"}
        </button>
      </div>
    </div>
  );
}
