import { useState } from "react";

const STORAGE_KEY = "ne_regression";

interface Skills {
  focus: number;
  discipline: number;
  momentum: number;
}

const DEFAULT: Skills = { focus: 70, discipline: 70, momentum: 70 };

function load(): Skills {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Skills;
  } catch {}
  return DEFAULT;
}

function save(data: Skills) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const clamp = (v: number) => Math.min(100, Math.max(0, v));

export function useRegression() {
  const [skills, setSkills] = useState<Skills>(load);

  const onComplete = () =>
    setSkills((prev) => {
      const next: Skills = {
        focus: clamp(prev.focus + 8),
        discipline: clamp(prev.discipline + 8),
        momentum: clamp(prev.momentum + 8),
      };
      save(next);
      return next;
    });

  const onAvoid = () =>
    setSkills((prev) => {
      const next: Skills = {
        focus: clamp(prev.focus - 12),
        discipline: clamp(prev.discipline - 12),
        momentum: clamp(prev.momentum - 12),
      };
      save(next);
      return next;
    });

  return { skills, onComplete, onAvoid };
}
