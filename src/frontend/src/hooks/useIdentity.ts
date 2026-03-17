import { useCallback, useState } from "react";

const STORAGE_KEY = "ne_identity";

interface IdentityData {
  traits: string[];
  strength: number;
}

const DEFAULT: IdentityData = { traits: [], strength: 70 };

function load(): IdentityData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as IdentityData;
  } catch {}
  return DEFAULT;
}

function save(data: IdentityData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useIdentity() {
  const [data, setData] = useState<IdentityData>(load);

  const persist = useCallback((next: IdentityData) => {
    save(next);
    setData(next);
  }, []);

  const setTraits = useCallback(
    (traits: string[]) =>
      setData((prev) => {
        const next = { ...prev, traits };
        save(next);
        return next;
      }),
    [],
  );

  const addStrength = useCallback((amount: number) => {
    setData((prev) => {
      const next = { ...prev, strength: Math.min(100, prev.strength + amount) };
      save(next);
      return next;
    });
  }, []);

  const subtractStrength = useCallback((amount: number) => {
    setData((prev) => {
      const next = { ...prev, strength: Math.max(0, prev.strength - amount) };
      save(next);
      return next;
    });
  }, []);

  // identityMessage reads current data via closure — use the ref pattern via
  // passing data explicitly so callers always get a fresh value
  const identityMessage = useCallback(
    (action: "complete" | "avoid"): string => {
      // We read from state via the setter trick to avoid stale closure:
      // Return a stable string based on current data snapshot captured at call time.
      // Since this is called inside event handlers (after awaits) we re-read localStorage
      // to get the latest persisted value.
      let current: IdentityData;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        current = raw ? (JSON.parse(raw) as IdentityData) : DEFAULT;
      } catch {
        current = DEFAULT;
      }
      if (current.traits.length === 0) {
        return action === "complete"
          ? "You followed through. That matters."
          : "You chose to avoid. That compounds.";
      }
      const trait = current.traits[0].toLowerCase();
      if (action === "complete") {
        return `That's what ${trait} people do.`;
      }
      return `A ${trait} person wouldn't do this.`;
    },
    [],
  );

  return {
    traits: data.traits,
    strength: data.strength,
    setTraits,
    addStrength,
    subtractStrength,
    identityMessage,
    persist,
  };
}
