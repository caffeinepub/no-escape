import { useMemo } from "react";
import type { Task } from "../backend";
import { TaskState } from "../backend";

interface UseUserFactsProps {
  tasks: Task[];
  stats: {
    completed: number;
    avoided: number;
    focusMinutes: number;
    burdenScore: number;
  };
  identityTraits: string[];
}

function loadLoopData(): {
  avoidances: Array<{ taskId: string; taskTitle: string; timestamp: number }>;
} {
  try {
    const raw = localStorage.getItem("ne_loops");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { avoidances: [] };
}

function loadRegressionData(): {
  focus: number;
  discipline: number;
  momentum: number;
} | null {
  try {
    const raw = localStorage.getItem("ne_regression");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function useUserFacts({
  tasks,
  stats,
  identityTraits,
}: UseUserFactsProps): string[] {
  return useMemo(() => {
    const facts: string[] = [];
    const loopData = loadLoopData();
    const regressionData = loadRegressionData();

    // Identity traits
    if (identityTraits.length > 0) {
      facts.push(
        `You have ${identityTraits.length} identity trait${identityTraits.length > 1 ? "s" : ""} defined: ${identityTraits[0]}${identityTraits.length > 1 ? " +more" : ""}.`,
      );
    }

    // Strongest trait
    if (identityTraits.length > 1) {
      facts.push(`Your primary identity trait is "${identityTraits[0]}".`);
    }

    // Avoidance count
    if (stats.avoided > 0) {
      facts.push(
        `You've avoided tasks ${stats.avoided} time${stats.avoided > 1 ? "s" : ""} total.`,
      );
    }

    // Completed tasks
    if (stats.completed > 0) {
      facts.push(
        `You've completed ${stats.completed} task${stats.completed > 1 ? "s" : ""}.`,
      );
    }

    // Discipline score
    if (regressionData) {
      facts.push(`Your discipline score is ${regressionData.discipline}/100.`);
      if (regressionData.momentum < 50) {
        facts.push(
          `Momentum is dropping — currently ${regressionData.momentum}/100.`,
        );
      }
      if (regressionData.focus > 80) {
        facts.push(
          `Focus is strong at ${regressionData.focus}/100. Don't break the streak.`,
        );
      }
    }

    // Focus time
    if (stats.focusMinutes > 0) {
      facts.push(
        `You've spent ${stats.focusMinutes} minute${stats.focusMinutes > 1 ? "s" : ""} in focus mode.`,
      );
    }

    // Most avoided task from loop data
    if (loopData.avoidances.length > 0) {
      const countByTask: Record<string, { title: string; count: number }> = {};
      for (const a of loopData.avoidances) {
        if (!countByTask[a.taskId]) {
          countByTask[a.taskId] = { title: a.taskTitle, count: 0 };
        }
        countByTask[a.taskId].count++;
      }
      const mostAvoided = Object.values(countByTask).sort(
        (a, b) => b.count - a.count,
      )[0];
      if (mostAvoided && mostAvoided.count >= 2) {
        facts.push(
          `Most avoided task: "${mostAvoided.title}" (${mostAvoided.count}×).`,
        );
      }
      facts.push(
        `You've avoided tasks ${loopData.avoidances.length} times total across all sessions.`,
      );
    }

    // Burden score
    if (stats.burdenScore > 0) {
      const label =
        stats.burdenScore > 70
          ? "Critical"
          : stats.burdenScore > 40
            ? "Warning"
            : "Safe";
      facts.push(`Burden score: ${stats.burdenScore}/100 — ${label}.`);
    }

    // Active tasks count
    const idleCount = tasks.filter((t) => t.state === TaskState.idle).length;
    if (idleCount > 0) {
      facts.push(
        `${idleCount} task${idleCount > 1 ? "s" : ""} still waiting for you right now.`,
      );
    }

    // Focus efficiency
    const total = stats.completed + stats.avoided;
    if (total > 0) {
      const efficiency = Math.round((stats.completed / total) * 100);
      facts.push(
        `Focus efficiency: ${efficiency}% (${stats.completed} done, ${stats.avoided} avoided).`,
      );
    }

    // Fallback
    if (facts.length === 0) {
      facts.push("The app is watching. Start a task.");
    }

    return facts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tasks,
    stats.completed,
    stats.avoided,
    stats.focusMinutes,
    stats.burdenScore,
    identityTraits,
  ]);
}
