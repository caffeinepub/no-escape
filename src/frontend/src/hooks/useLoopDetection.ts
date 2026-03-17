import { useCallback, useRef, useState } from "react";

const STORAGE_KEY = "ne_loops";

interface AvoidanceEntry {
  taskId: string;
  taskTitle: string;
  timestamp: number;
}

interface LoopData {
  avoidances: AvoidanceEntry[];
}

function load(): LoopData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LoopData;
  } catch {}
  return { avoidances: [] };
}

function save(data: LoopData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useLoopDetection() {
  const [data, setData] = useState<LoopData>(load);
  // Keep a ref that is always current so getLoopWarning never reads stale state
  const dataRef = useRef<LoopData>(data);

  const logAvoidance = useCallback((taskId: string, taskTitle: string) => {
    setData((prev) => {
      const next: LoopData = {
        avoidances: [
          ...prev.avoidances,
          { taskId, taskTitle, timestamp: Date.now() },
        ],
      };
      save(next);
      dataRef.current = next;
      return next;
    });
  }, []);

  const getLoopWarning = useCallback((taskId: string): string | null => {
    const current = dataRef.current;
    const taskAvoidances = current.avoidances.filter(
      (a) => a.taskId === taskId,
    );
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentForTask = taskAvoidances.filter(
      (a) => a.timestamp > oneHourAgo,
    );
    if (taskAvoidances.length >= 3) {
      return `You've avoided this ${taskAvoidances.length} times. This is a pattern. Break it now.`;
    }
    if (recentForTask.length >= 3) {
      return "3 avoidances in the last hour. You're stuck in a loop.";
    }
    return null;
  }, []);

  const recentAvoidanceCount = data.avoidances.filter(
    (a) => a.timestamp > Date.now() - 60 * 60 * 1000,
  ).length;

  return { logAvoidance, getLoopWarning, recentAvoidanceCount, data };
}
