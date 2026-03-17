import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Bot, Loader2, Sparkles, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CoachMode = "coach" | "future";

type Message = {
  role: "user" | "ai";
  text: string;
  id: string;
};

const STARTERS: Record<CoachMode, string[]> = {
  coach: [
    "I keep putting this off",
    "I don't know where to start",
    "I feel overwhelmed",
    "I'm making excuses",
  ],
  future: [
    "Am I going to regret this?",
    "What do you wish you had done?",
    "Is the pain worth it?",
    "Tell me what happens if I quit",
  ],
};

// ── Smart response engine ──────────────────────────────────────────────────
type ResponseRule = {
  keywords: string[];
  responses: string[];
};

const COACH_RULES: ResponseRule[] = [
  {
    keywords: ["overwhelm", "too much", "so much", "lot to do", "everything"],
    responses: [
      "Feeling overwhelmed is actually really normal when you have a full plate. Here's the thing — your brain is trying to hold everything at once, which is exhausting. The fix is simple: just pick ONE task, the smallest one that moves something forward, and give it 15 minutes. That's it. Just 15 minutes. The momentum will carry you.",
      "When everything feels urgent, nothing gets done. Let's simplify. Look at your tasks and ask: which one, if done today, would make tomorrow feel lighter? Start there. One focused effort beats scattered worry every time.",
    ],
  },
  {
    keywords: ["start", "begin", "where", "how to", "don't know"],
    responses: [
      "Not knowing where to start is one of the most common blocks — and it's totally fixable. Pick the task that's been on your mind the longest. That mental weight you're carrying? That's a signal. Open it, read the first line, and just begin. You'll figure out the rest as you go.",
      "The best starting point is usually the one you've been avoiding the most. Your brain already knows what needs to happen — it's just looking for permission. Give yourself that permission. Open the task. Take the first tiny step. The clarity will come once you're moving.",
    ],
  },
  {
    keywords: ["procrastinat", "delay", "avoid", "putting off", "later"],
    responses: [
      "Procrastination almost always comes from one of three things: the task feels too big, too unclear, or too uncomfortable. Which one is it for you? Once you name it, it gets easier to work around. If it's too big — break it down. If it's unclear — spend 5 minutes defining what 'done' looks like. If it's uncomfortable — start with just 2 minutes.",
      "Here's something useful to know: the anticipation of a hard task is almost always worse than actually doing it. Your brain is over-predicting how bad it will feel. The moment you start, the anxiety drops. Use that. Just get your hands on the task for 60 seconds — you'll often keep going.",
    ],
  },
  {
    keywords: ["tired", "exhausted", "energy", "no motivation", "can't"],
    responses: [
      "Tiredness is real and it deserves respect. But there's a difference between 'I need rest' and 'I'm avoiding because I'm a bit low-energy.' If it's the second one, a 10-minute focused sprint can actually restore energy — getting things done feels good. Try this: one task, 10 minutes, then reassess.",
      "Low energy days happen. Here's a gentle approach — instead of a full session, aim for 'progress, not perfection.' Even 20% effort is infinitely better than 0%. Pick the easiest item on your list and give it what you have. That small win will shift your energy.",
    ],
  },
  {
    keywords: ["scared", "afraid", "fear", "fail", "failure", "what if"],
    responses: [
      "Fear of failure is incredibly common, especially when something matters to you. But here's the reframe: every time you avoid the thing you're afraid of, the fear grows. Every time you face it — even imperfectly — it shrinks. You don't have to do it perfectly. You just have to do it.",
      "What you're feeling is normal. High stakes create high anxiety. But ask yourself: what's the actual worst case? Usually it's survivable. And the best case — building momentum, finishing something, proving to yourself you can — that's life-changing. Take the risk. It's worth it.",
    ],
  },
  {
    keywords: ["excuse", "distract", "focus", "phone", "social media"],
    responses: [
      "Distractions are designed by some of the smartest engineers in the world to compete for your attention. It's not a willpower problem — it's an environment problem. The solution is friction: put your phone in another room, use one tab, close social media. Make the distraction harder to reach than the task.",
      "You already know the excuses aren't real — that's why you're here. The gap between knowing and doing is closed by one thing: environment design. Remove the easy exits. Make the task the path of least resistance for the next 25 minutes. You can do anything for 25 minutes.",
    ],
  },
  {
    keywords: ["stress", "anxious", "anxiety", "pressure", "nervous"],
    responses: [
      "Stress is often a sign that you care about the outcome — which is actually a good thing. The key is channeling it into action rather than avoidance. Try this: take three slow breaths, then open the first task. Physical action interrupts the stress cycle. Your brain needs to see movement, not planning.",
      "When anxiety spikes, your brain goes into threat mode — which makes everything feel harder. The antidote is small, concrete actions. Don't think about the whole project. Just the next sentence, the next step, the next 5 minutes. Break the abstract fear into tiny concrete moves.",
    ],
  },
  {
    keywords: ["done", "finish", "complete", "accomplished", "proud"],
    responses: [
      "That's genuinely great. Finishing things is harder than most people realize, and you did it. Take a moment to acknowledge that — not to celebrate endlessly, but to register it. Your brain remembers wins. This one becomes evidence for next time when doubt shows up.",
      "Nice work. Seriously. Now here's the move: don't let the momentum die. You have energy from finishing — use it to either start the next task or do a proper, intentional close-out. What's next on your list?",
    ],
  },
  {
    keywords: ["help", "what should", "what do i", "advice", "suggest"],
    responses: [
      "The most effective thing you can do right now is identify your single most important task — the one that will have the biggest impact if completed today — and start a focused session on it. Everything else can wait. What's that one task for you?",
      "My honest suggestion: open your task list, look at what's been sitting there the longest, and spend 25 minutes on it right now. Don't plan, don't organize, don't 'get ready.' Just work. The clarity you're looking for usually comes through action, not before it.",
    ],
  },
  {
    keywords: ["why", "point", "matter", "worth it", "bother"],
    responses: [
      "That's a real question worth sitting with. Here's my take: the tasks in front of you are there because some version of you decided they mattered. That version of you was right. The resistance you feel now is temporary. The results — the progress, the relief, the growth — those are permanent.",
      "When the 'why bother' feeling hits, it's usually because you've been running on empty for too long. The tasks aren't the problem — depletion is. But here's the thing: completing even one task will shift how you feel. Action creates meaning, not the other way around.",
    ],
  },
];

const FUTURE_RULES: ResponseRule[] = [
  {
    keywords: ["regret", "wish", "should have", "if only"],
    responses: [
      "I'll be honest with you — yes, I have regrets. The nights I convinced myself I'd start tomorrow. The projects I left half-done because 'the time wasn't right.' The time was always right. It's right now. I would give anything to go back to where you are and just start.",
      "There's something I need you to understand. The things you're putting off right now — they don't disappear. They become the weight I carry. Every delay compounds. Please, just start. Not for some abstract future. For me. For who we become.",
    ],
  },
  {
    keywords: ["quit", "give up", "stop", "can't do"],
    responses: [
      "I know how tempting it feels to stop. I've been there. But I need you to hear this clearly: the version of me that exists now — the one writing this — came to be because of the times I didn't quit when it felt impossible. If you stop here, I don't exist. Is that the choice you want to make?",
      "Quitting feels like relief in the moment. I remember that feeling. But relief evaporates. What stays is the knowledge that you stopped. And that knowledge changes how you see yourself over time. You don't want that. Keep going. The hard part is almost never as long as the avoid felt.",
    ],
  },
  {
    keywords: ["worth it", "pain", "hard", "struggle", "worth"],
    responses: [
      "Yes. It's worth it. I can tell you that with complete certainty because I lived it. The effort you're putting in right now — even when it's uncomfortable, even when you're tired — it builds something real. Something you can stand on. Every hard session is an investment in who you're becoming.",
      "The struggle is the point. I don't say that to be harsh — I say it because I learned it too late. The discomfort you're feeling right now is literally you growing. It doesn't feel that way in the moment. But from where I'm standing? Those hard days were the ones that shaped everything.",
    ],
  },
  {
    keywords: ["proud", "happy", "good", "better"],
    responses: [
      "Yes. I'm proud of the moments you pushed through. Not the easy wins — those are fine — but the times you were exhausted and did it anyway. That's what I remember most. That's what built the foundation I'm standing on now. Keep adding to it.",
      "There are days I look back on with real gratitude — and they're almost always the days that were hardest to start. The fact that you're asking this question means you already sense that. Trust that instinct. It's right.",
    ],
  },
];

const FALLBACK_COACH = [
  "Tell me more about what's going on. What's the specific task or situation that's blocking you? Once I understand the details, I can give you something concrete to work with.",
  "I hear you. Let's think through this together. What does the task actually require? Sometimes just describing it out loud helps clarify the first step.",
  "That makes sense. Here's what I'd suggest: give me a bit more context about what you're dealing with, and I'll help you find the most direct path through it.",
  "I'm here. What's the situation? The more specific you can be, the more useful I can be. General vague feelings are hard to work with — concrete details are where the solutions live.",
];

const FALLBACK_FUTURE = [
  "I remember this feeling. It's real, and it matters. Tell me more — what's the specific thing weighing on you? I want to give you something real, not just encouragement.",
  "From where I am, I can see things you can't yet. But I need you to be specific. What's the thing you're really struggling with right now?",
];

function getSmartResponse(
  text: string,
  mode: CoachMode,
  history: Message[],
): string {
  const lower = text.toLowerCase();
  const rules = mode === "coach" ? COACH_RULES : FUTURE_RULES;
  const fallbacks = mode === "coach" ? FALLBACK_COACH : FALLBACK_FUTURE;

  // Try to find a matching rule
  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const responses = rule.responses;
      // Pick based on history length to vary
      return responses[history.length % responses.length];
    }
  }

  // Context-aware fallback
  const lastAiMessage = [...history].reverse().find((m) => m.role === "ai");
  if (lastAiMessage && history.length > 2) {
    return `Based on what you've shared — ${text.slice(0, 60)}${text.length > 60 ? "..." : ""} — the clearest next step is to pick the one thing that would move you forward most right now and commit to a 20-minute focused session on it. What would that be?`;
  }

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
// ──────────────────────────────────────────────────────────────────────────

export function AICoach() {
  const [mode, setMode] = useState<CoachMode>("coach");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isFuture = mode === "future";

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll whenever messages or loading changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      role: "user",
      text: trimmed,
      id: crypto.randomUUID(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate a short thinking delay for a natural feel
    const thinkTime = 600 + Math.random() * 900;
    await new Promise((r) => setTimeout(r, thinkTime));

    const currentMessages = [...messages, userMsg];
    const response = getSmartResponse(trimmed, mode, currentMessages);

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: response, id: crypto.randomUUID() },
    ]);
    setIsLoading(false);
  };

  const switchMode = (next: CoachMode) => {
    setMode(next);
    setMessages([]);
    setInput("");
  };

  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden flex flex-col"
      style={{ height: "520px" }}
      data-ocid="coach.card"
      id="ai-coach-section"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-warning/20 border border-warning/40 flex items-center justify-center">
              {isFuture ? (
                <User className="w-4 h-4 text-warning" />
              ) : (
                <Sparkles className="w-4 h-4 text-warning" />
              )}
            </div>
            <div>
              <h2 className="font-display font-bold text-base uppercase tracking-widest text-foreground">
                {isFuture ? "Future You" : "AI Coach"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isFuture
                  ? "Honest perspective from who you become"
                  : "Helpful, direct, always in your corner"}
              </p>
            </div>
          </div>
          <div className="flex rounded overflow-hidden border border-border">
            <button
              type="button"
              onClick={() => switchMode("coach")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border-r border-border ${
                !isFuture
                  ? "bg-warning/20 text-warning"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="coach.tab"
            >
              COACH
            </button>
            <button
              type="button"
              onClick={() => switchMode("future")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                isFuture
                  ? "bg-warning/20 text-warning"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="coach.tab"
            >
              FUTURE SELF
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        data-ocid="coach.messages"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-foreground font-semibold mb-1">
                {isFuture
                  ? "Your future self is listening."
                  : "What's on your mind?"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isFuture
                  ? "Ask anything — get an honest answer from who you become."
                  : "I'll help you cut through the noise and move forward."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTERS[mode].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="text-xs px-3 py-2 rounded border border-border bg-secondary hover:bg-warning/10 hover:border-warning/40 hover:text-warning text-muted-foreground transition-all duration-150"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={`flex gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="w-6 h-6 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {isFuture ? (
                    <User className="w-3 h-3 text-warning" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-warning" />
                  )}
                </div>
              )}
              <div
                className={`max-w-[80%] px-3 py-2.5 rounded-lg text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-pressure/20 border border-pressure/30 text-foreground"
                    : "bg-secondary border border-border text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 justify-start"
          >
            <div className="w-6 h-6 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-warning" />
            </div>
            <div className="bg-secondary border border-border px-3 py-2 rounded-lg flex items-center gap-2">
              <Loader2 className="w-3 h-3 text-warning animate-spin" />
              <span className="text-xs text-muted-foreground">
                {isFuture ? "Reflecting..." : "Thinking..."}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border p-3">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isFuture
                ? "Ask your future self anything..."
                : "What's on your mind? I'm here to help."
            }
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none text-sm min-h-[42px] max-h-[120px] flex-1"
            rows={1}
            data-ocid="coach.textarea"
            enterKeyHint="send"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded bg-warning/20 hover:bg-warning/30 border border-warning/40 text-warning transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            data-ocid="coach.submit_button"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1.5 pl-0.5">
          Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
