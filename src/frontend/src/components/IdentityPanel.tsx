import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const QUICK_TRAITS = ["Disciplined", "Focused", "Relentless", "Consistent"];

interface IdentityPanelProps {
  traits: string[];
  strength: number;
  setTraits: (traits: string[]) => void;
  lastMessage?: string;
}

export function IdentityPanel({
  traits,
  strength,
  setTraits,
  lastMessage,
}: IdentityPanelProps) {
  const [customInput, setCustomInput] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const strengthColor =
    strength > 60 ? "bg-success" : strength > 30 ? "bg-warning" : "bg-pressure";
  const strengthLabel =
    strength > 60 ? "STRONG" : strength > 30 ? "WAVERING" : "BREAKING";
  const strengthText =
    strength > 60
      ? "text-success"
      : strength > 30
        ? "text-warning"
        : "text-pressure";

  const toggleTrait = (trait: string) => {
    if (traits.includes(trait)) {
      setTraits(traits.filter((t) => t !== trait));
    } else {
      setTraits([...traits, trait]);
    }
  };

  const addCustomTrait = () => {
    const t = customInput.trim();
    if (!t || traits.includes(t)) return;
    setTraits([...traits, t]);
    setCustomInput("");
  };

  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden"
      data-ocid="identity.card"
    >
      <button
        type="button"
        className="w-full px-5 py-4 border-b border-border flex items-center justify-between"
        onClick={() => setCollapsed((c) => !c)}
        data-ocid="identity.toggle"
      >
        <div>
          <h2 className="font-display font-bold text-base uppercase tracking-widest text-foreground text-left">
            Identity
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 text-left">
            {traits.length === 0
              ? "Define who you are"
              : traits.slice(0, 3).join(" · ")}
          </p>
        </div>
        <div className="text-right">
          <div
            className={`text-sm font-bold uppercase tracking-wider ${strengthText}`}
          >
            {strengthLabel}
          </div>
          <div className="text-xs text-muted-foreground">{strength}/100</div>
        </div>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="identity-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 space-y-4 overflow-hidden"
          >
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Identity Strength
                </span>
                <span className={`text-xs font-bold ${strengthText}`}>
                  {strength}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${strengthColor}`}
                  animate={{ width: `${strength}%` }}
                  transition={{ duration: 0.7 }}
                />
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Your Identity Traits
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_TRAITS.map((trait) => (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => toggleTrait(trait)}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-all duration-200 ${
                      traits.includes(trait)
                        ? "bg-pressure/30 border-pressure text-pressure"
                        : "bg-secondary border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                    data-ocid="identity.toggle"
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTrait()}
                placeholder="Custom trait..."
                className="flex-1 bg-secondary border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground"
                data-ocid="identity.input"
              />
              <button
                type="button"
                onClick={addCustomTrait}
                className="px-3 py-1.5 bg-surface-elevated border border-border text-xs font-bold uppercase text-foreground rounded hover:bg-secondary transition-colors"
                data-ocid="identity.save_button"
              >
                ADD
              </button>
            </div>

            {traits.filter((t) => !QUICK_TRAITS.includes(t)).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {traits
                  .filter((t) => !QUICK_TRAITS.includes(t))
                  .map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => toggleTrait(trait)}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border bg-pressure/30 border-pressure text-pressure"
                      data-ocid="identity.toggle"
                    >
                      {trait} ×
                    </button>
                  ))}
              </div>
            )}

            {lastMessage && (
              <div className="bg-secondary/60 border border-border rounded px-3 py-2">
                <p className="text-xs text-muted-foreground italic">
                  "{lastMessage}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
