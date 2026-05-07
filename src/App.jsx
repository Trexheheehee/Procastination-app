import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME & CONSTANTS ─────────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0a0f",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderActive: "rgba(139,92,246,0.6)",
  accent: "#8b5cf6",
  accentGlow: "rgba(139,92,246,0.3)",
  accentAlt: "#06b6d4",
  danger: "#f43f5e",
  success: "#10b981",
  warning: "#f59e0b",
  textPrimary: "#f0f0f5",
  textSecondary: "rgba(240,240,245,0.55)",
  textMuted: "rgba(240,240,245,0.3)",
};

// ─── MODULE DATA ─────────────────────────────────────────────────────────────
const MODULES = [
  {
    id: "monkey",
    title: "The Instant Gratification Monkey",
    icon: "🐒",
    color: "#f59e0b",
    glyph: "IGM",
    tagline: "He lives only in the now",
    concept: `Meet the Monkey. He is not evil. He is simply a creature of the present — no memory of the past, no concept of the future, no awareness of consequences.

The Monkey has two operating principles:
1. Is it **easy**?
2. Is it **fun**?

If yes to both: do it. If no: absolutely not.

The Monkey evolved perfectly for simple cave-dwelling. He is spectacularly unfit for deadlines, taxes, and life goals.

When the Monkey grabs the wheel, you end up in what Urban calls the Dark Playground — doing fun things at the wrong time, for the wrong reasons.`,
    scenario: {
      prompt: "You sit down to write a difficult email. The Monkey taps your shoulder. Which of these activities does he suggest instead?",
      choices: [
        { text: "Write a rough draft — just get words on the page", outcome: "🧠 The RDM approves. The Monkey sulks.", correct: true },
        { text: "Watch 'one quick video' about productivity", outcome: "🐒 +47 minutes later, you've learned nothing and done nothing.", correct: false },
        { text: "Reorganise your entire desktop", outcome: "🐒 Feels like work. Is not work. Classic monkey move.", correct: false },
        { text: "Scroll through your phone 'for inspiration'", outcome: "🐒 Inspiration not found. Two hours lost.", correct: false },
      ]
    },
    reflection: "List your top 3 Monkey distractions. When do they typically strike — and what task are you always trying to avoid when they appear?",
    quiz: [
      {
        q: "What are the Monkey's two primary motivations?",
        options: ["Fear and ambition", "Easy and fun", "Speed and efficiency", "Praise and reward"],
        answer: 1
      },
      {
        q: "Why is the Monkey poorly suited for modern life?",
        options: ["It is too intelligent", "It lives only in the present with no sense of past or future", "It is always angry", "It makes too many plans"],
        answer: 1
      },
      {
        q: "What happens when the Monkey 'grabs the wheel'?",
        options: ["Work gets done faster", "The Panic Monster wakes up", "The person is diverted to easy, fun activities instead of productive ones", "The Rational Decision-Maker takes control"],
        answer: 2
      }
    ]
  },
  {
    id: "rational-thinker",
    title: "The Rational Decision-Maker",
    icon: "🧠",
    color: "#8b5cf6",
    glyph: "RDM",
    tagline: "The voice of reason — often ignored",
    concept: `Every human brain has a part that can see the big picture. It visualises the future, weighs consequences, and knows exactly what needs to be done. This is the Rational Decision-Maker (RDM).

The RDM makes plans. It sets alarms, writes to-do lists, and commits to change every Sunday night. It is wise, forward-thinking, and completely right about everything.

There's just one problem: it doesn't always drive.`,
    scenario: {
      prompt: "It's Sunday evening. You have a major project due Friday. The Rational Decision-Maker hands you a plan. What do you do?",
      choices: [
        { text: "Start tonight — even 30 minutes of momentum helps", outcome: "✅ The RDM is pleased. You've earned tomorrow's leisure.", correct: true },
        { text: "Plan everything in a detailed spreadsheet", outcome: "🤔 Planning isn't doing. The monkey is already eyeing YouTube.", correct: false },
        { text: "Decide to start first thing Monday morning", outcome: "⚠️ Classic delay tactic. Monday you will say 'Tuesday'.", correct: false },
        { text: "Check social media 'just for a minute'", outcome: "🐒 The monkey has seized the wheel. Goodbye, Sunday.", correct: false },
      ]
    },
    reflection: "When was the last time your Rational Decision-Maker made a plan that you actually followed? What made the difference?",
    quiz: [
      {
        q: "What is the primary ability of the Rational Decision-Maker?",
        options: ["Seeking immediate fun", "Visualising the future and making long-term plans", "Triggering panic near deadlines", "Living only in the present"],
        answer: 1
      },
      {
        q: "Why is the Rational Decision-Maker often ineffective in procrastinators?",
        options: ["It is too emotional", "It lacks the ability to plan", "It gets overridden by the Instant Gratification Monkey", "It only activates at deadlines"],
        answer: 2
      },
      {
        q: "What does the Rational Decision-Maker do that the Monkey cannot?",
        options: ["Feel emotions", "See the big picture and weigh future consequences", "Cause panic", "Enjoy leisure time"],
        answer: 1
      }
    ]
  },
  {
    id: "dark-playground",
    title: "The Dark Playground",
    icon: "🎭",
    color: "#f43f5e",
    glyph: "DP",
    tagline: "Fun that doesn't feel fun",
    concept: `The Dark Playground is a place you know well.

It's where you watch Netflix when a report is due. Where you scroll endlessly while your inbox fills up. Where you play games when you promised yourself you'd work.

The leisure here is **unearned** — and your brain knows it. So instead of genuine rest and joy, the Dark Playground is saturated with:
- 😰 Guilt
- 😖 Anxiety  
- 😤 Dread
- 😞 Self-hatred

You're not relaxing. You're hiding. And the thing you're hiding from keeps growing.

True leisure — earned, guilt-free rest — is the opposite of this. You cannot access it from the Dark Playground.`,
    scenario: {
      prompt: "It's 11 PM. You have an assignment due tomorrow. You've spent 3 hours in the Dark Playground. What do you do?",
      choices: [
        { text: "Close everything and start — even imperfect work beats none", outcome: "💡 This is the only escape route. The Panic Monster may help.", correct: true },
        { text: "Watch one more episode — you need to 'decompress' first", outcome: "🎭 You're already in the Dark Playground. Deeper you go.", correct: false },
        { text: "Message a friend to complain about your situation", outcome: "🎭 Venting is not doing. Tomorrow will be worse.", correct: false },
        { text: "Make a very detailed plan for tomorrow instead of starting", outcome: "🎭 Planning about doing is still not doing.", correct: false },
      ]
    },
    reflection: "Describe your last Dark Playground session. How did it feel — honestly? Did the leisure actually feel leisurely?",
    quiz: [
      {
        q: "What makes the Dark Playground 'dark'?",
        options: ["It happens at night", "The leisure is unearned, causing guilt and anxiety", "It involves dangerous activities", "It is a physical location"],
        answer: 1
      },
      {
        q: "Which emotion is NOT typically experienced in the Dark Playground?",
        options: ["Guilt", "Dread", "Genuine joy", "Anxiety"],
        answer: 2
      },
      {
        q: "How does Dark Playground leisure differ from true leisure?",
        options: ["Dark Playground leisure is healthier", "True leisure is also anxiety-filled", "Dark Playground leisure is unearned, while true leisure is guilt-free", "They are essentially the same thing"],
        answer: 2
      }
    ]
  },
  {
    id: "panic-monster",
    title: "The Panic Monster",
    icon: "👹",
    color: "#ef4444",
    glyph: "PM",
    tagline: "The only thing the Monkey fears",
    concept: `Most of the time, the Panic Monster sleeps.

He is dormant — irrelevant — while the Monkey runs wild. But he wakes up when something truly threatening looms:

- A deadline **hours** away
- The risk of **public embarrassment**
- A career-threatening **disaster**

When he wakes, the Monkey doesn't argue. The Monkey **flees up a tree**.

Suddenly the Rational Decision-Maker can work. The all-nighter begins. The paper gets written. The presentation gets built.

This is how procrastinators survive — not through discipline, but through the **nuclear option of panic**.

The cost? Chronic stress. Poor quality output. A life lived crisis to crisis.`,
    scenario: {
      prompt: "The Panic Monster just woke up — your deadline is in 8 hours. You enter a hyperfocus state. What's your strategy?",
      choices: [
        { text: "Prioritise the most critical components — done imperfectly beats not done", outcome: "✅ Smart. The Panic Monster gives you power. Use it wisely.", correct: true },
        { text: "Try to do everything perfectly since you're finally focused", outcome: "⚠️ Perfectionism under panic leads to zero completed work.", correct: false },
        { text: "Spend an hour organising your workspace first", outcome: "🐒 The Monkey is nearby. Don't give him an opening.", correct: false },
        { text: "Ask for an extension and take the pressure off", outcome: "💭 Sometimes valid — but if this is habitual, the Monkey wins.", correct: false },
      ]
    },
    reflection: "Has the Panic Monster ever saved you? Describe the experience. And what was the hidden cost — stress, quality, relationships?",
    quiz: [
      {
        q: "When does the Panic Monster wake up?",
        options: ["At the start of every morning", "When deadlines are dangerously close or public failure looms", "Whenever the Rational Decision-Maker speaks", "When the Monkey takes control"],
        answer: 1
      },
      {
        q: "What does the Panic Monster do to the Instant Gratification Monkey?",
        options: ["Joins it in play", "Teaches it discipline", "Terrifies it, causing it to retreat", "Ignores it completely"],
        answer: 2
      },
      {
        q: "What is the main problem with relying on the Panic Monster to get work done?",
        options: ["It works too slowly", "It leads to chronic stress and often poor-quality output", "It never actually produces results", "It conflicts with the Rational Decision-Maker"],
        answer: 1
      }
    ]
  },
  {
    id: "long-term",
    title: "Long-Term Procrastination",
    icon: "⏳",
    color: "#06b6d4",
    glyph: "LTP",
    tagline: "When the Panic Monster never comes",
    concept: `Short-term procrastination has a safety net: deadlines.

The Panic Monster wakes up. Things (barely) get done. Life continues.

But what about the things with **no deadline**?

- Starting a business
- Having an honest conversation
- Getting fit
- Pursuing a creative passion
- Fixing a relationship

These have no due date. No external pressure. No Panic Monster.

So the Monkey runs **forever**. Days become months become years.

This is long-term procrastination — and it's silent. No dramatic all-nighter. No crisis. Just a quiet, growing awareness that you are a **spectator in your own life**.

Tim Urban received thousands of emails from people who weren't upset about the bad papers they'd written — they were devastated by the **lives they'd never started**.`,
    scenario: {
      prompt: "You've wanted to start a creative project for 2 years. There's no deadline. No one is watching. The Monkey says 'someday'. What do you actually do?",
      choices: [
        { text: "Set a self-imposed deadline and tell someone about it for accountability", outcome: "✅ Creating artificial deadlines summons a weaker Panic Monster. It helps.", correct: true },
        { text: "Wait until you feel 'inspired' or have 'more time'", outcome: "⏳ Inspiration is a myth. More time never arrives. The Monkey wins.", correct: false },
        { text: "Research and plan the project extensively before starting", outcome: "🐒 Preparation as procrastination. Years of plans, zero output.", correct: false },
        { text: "Start for just 10 minutes today — no pressure, no goals", outcome: "✅ The 10-minute trick bypasses the Monkey. Often you'll continue.", correct: true },
      ]
    },
    reflection: "Name one thing you've been 'meaning to do' for more than a year. What has the Monkey told you to justify not starting?",
    quiz: [
      {
        q: "What makes long-term procrastination more dangerous than short-term?",
        options: ["It causes more stress", "The Panic Monster never wakes up to force action", "It involves more complex tasks", "It is always noticed by others"],
        answer: 1
      },
      {
        q: "According to Urban, what was the main source of unhappiness in thousands of reader emails?",
        options: ["Failing to achieve goals after trying", "Never being able to start pursuing their goals", "Stress from last-minute work", "Poor work quality from rushing"],
        answer: 1
      },
      {
        q: "What feeling does long-term procrastination most often create?",
        options: ["Excitement", "Temporary relief", "Being a spectator in one's own life", "Productive momentum"],
        answer: 2
      }
    ]
  },
  {
    id: "life-calendar",
    title: "The Life Calendar",
    icon: "📅",
    color: "#10b981",
    glyph: "LC",
    tagline: "90 years. 4,680 weeks. Count them.",
    concept: `Tim Urban's most visceral insight takes the form of a simple grid.

**One box for every week of a 90-year life.**

That's 4,680 boxes. Look at how many you've already filled.

Now look at how many remain.

This isn't meant to terrify you — though it might. It's meant to make abstract time **tangible**. To make "someday" feel real.

Procrastination assumes infinite time. The Life Calendar destroys that assumption.

It asks one question:

> *What are you procrastinating on — and how many boxes do you have left to fix it?*

Urban's conclusion: procrastination is a "job for all of us." Non-procrastinators don't exist. The Monkey lives in every brain. The question is not whether you procrastinate — it's **what you choose to do about it**.`,
    scenario: {
      prompt: "You're looking at your Life Calendar. Roughly a third of your boxes are filled. The ones remaining stretch out before you. What shift do you feel?",
      choices: [
        { text: "Motivation — finite time means every week matters", outcome: "🎯 This is the intended awakening. Time is real. Use it.", correct: true },
        { text: "Anxiety — this is just depressing", outcome: "💭 Valid feeling. But anxiety without action changes nothing.", correct: false },
        { text: "Nothing — it's too abstract to feel real", outcome: "🤔 Try counting your actual age in weeks. Makes it concrete.", correct: false },
        { text: "Relief — I still have so many boxes left!", outcome: "⚠️ That's the Monkey's voice. 'Plenty of time' is how it always starts.", correct: false },
      ]
    },
    reflection: "If you had only 10 boxes (weeks) left, what would you stop procrastinating on immediately? Why aren't you doing that now?",
    quiz: [
      {
        q: "What does the Life Calendar represent?",
        options: ["A scheduling tool for daily tasks", "One box for every week of a 90-year life", "A countdown to retirement", "The number of tasks completed per year"],
        answer: 1
      },
      {
        q: "What central message does the Life Calendar convey?",
        options: ["Life is unpredictable", "Time is limited and action should be taken now", "Deadlines are harmful", "Planning is more important than doing"],
        answer: 1
      },
      {
        q: "What does Urban conclude about the universality of procrastination?",
        options: ["Only creative people procrastinate", "Procrastination only affects the young", "Non-procrastinators don't exist — the Monkey lives in every brain", "Technology causes procrastination"],
        answer: 2
      }
    ]
  }
];

// ─── UTILITY HOOKS ────────────────────────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.15 + 0.05,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,190,255,${s.opacity})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function GlassCard({ children, style = {}, onClick, hover = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && hover ? COLORS.bgCardHover : COLORS.bgCard,
        border: `1px solid ${hov && hover ? "rgba(139,92,246,0.3)" : COLORS.border}`,
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "all 0.25s ease",
        cursor: onClick ? "pointer" : "default",
        transform: hov && hover ? "translateY(-2px)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ children, color = COLORS.accent }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background: `${color}22`,
      color,
      border: `1px solid ${color}44`,
    }}>{children}</span>
  );
}

function ProgressBar({ value, color = COLORS.accent, height = 6 }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 100, height, overflow: "hidden" }}>
      <div style={{
        width: `${value}%`, height: "100%", borderRadius: 100,
        background: `linear-gradient(90deg, ${color}, ${color}bb)`,
        transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: `0 0 8px ${color}66`,
      }} />
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", position: "relative", zIndex: 1 }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)", maxWidth: 680 }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <Badge color={COLORS.accentAlt}>Interactive Learning Experience</Badge>
        </div>

        <h1 style={{
          fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          marginBottom: "1.2rem",
          background: `linear-gradient(135deg, #f0f0f5 0%, ${COLORS.accent} 50%, ${COLORS.accentAlt} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Why We Procrastinate:<br />Journey Inside the Mind
        </h1>

        {/* Creator Details */}
        <div style={{ marginBottom: "2.5rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all 0.6s ease 0.3s", color: COLORS.textMuted, fontSize: "0.95rem", letterSpacing: "0.02em", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: `1px solid ${COLORS.border}`, display: "inline-block" }}>
          <p style={{ margin: "0 0 6px", fontWeight: 600, color: COLORS.textPrimary, fontSize: "1.05rem" }}>Created by Rtr. Gokul</p>
          <p style={{ margin: 0, color: COLORS.textSecondary, fontSize: "0.85rem" }}>District Trainer Designate,<br />Rotaract club of SNS College of Technology</p>
        </div>

        <p style={{ fontSize: "1.15rem", color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 520, margin: "0 auto 2.5rem" }}>
          An immersive psychological journey through the science of why we delay, distract, and self-sabotage — and what we can actually do about it.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          {[
            { icon: "🧠", label: "6 Core Concepts" },
            { icon: "🎮", label: "Interactive Scenarios" },
            { icon: "📝", label: "Reflection Prompts" },
            { icon: "🏆", label: "Certificate of Completion" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textSecondary }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" }}>
          <button
            onClick={onStart}
            style={{
              padding: "14px 36px", borderRadius: 12, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentAlt})`,
              color: "#fff", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.02em",
              boxShadow: `0 8px 32px ${COLORS.accentGlow}`,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Begin the Journey →
          </button>
        </div>

        {/* Module preview row */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {MODULES.map((m, i) => (
            <div key={m.id} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
              borderRadius: 100, background: `${m.color}18`, border: `1px solid ${m.color}33`,
              fontSize: 12, color: m.color, opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: `all 0.5s ease ${0.2 + i * 0.08}s`,
            }}>
              <span>{m.icon}</span><span>{m.title}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !name.trim()) { setError("Please enter your name."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth({ name: name || email.split("@")[0], email });
    }, 900);
  }

  const inputStyle = {
    width: "100%", boxSizing: "border-box", padding: "12px 16px",
    background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`,
    borderRadius: 10, color: COLORS.textPrimary, fontSize: "0.95rem",
    outline: "none", transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", zIndex: 1 }}>
      <GlassCard style={{ padding: "2.5rem", width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🧠</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>
            {mode === "login" ? "Welcome Back" : "Begin Your Journey"}
          </h2>
          <p style={{ color: COLORS.textSecondary, fontSize: "0.9rem", marginTop: 6 }}>
            {mode === "login" ? "Continue where you left off" : "Create your learning profile"}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border} />
          )}
          <input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = COLORS.accent}
            onBlur={e => e.target.style.borderColor = COLORS.border} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = COLORS.accent}
            onBlur={e => e.target.style.borderColor = COLORS.border}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />

          {error && <p style={{ color: COLORS.danger, fontSize: "0.85rem", margin: 0 }}>{error}</p>}

          <button onClick={handleSubmit} disabled={loading} style={{
            padding: "13px", borderRadius: 10, border: "none", cursor: loading ? "default" : "pointer",
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentAlt})`,
            color: "#fff", fontSize: "0.95rem", fontWeight: 700, opacity: loading ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}>
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <p style={{ textAlign: "center", color: COLORS.textSecondary, fontSize: "0.85rem" }}>
            {mode === "login" ? "New here? " : "Already have an account? "}
            <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600 }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, progress, onStartModule, onLogout }) {
  const completedCount = Object.keys(progress).filter(k => progress[k]?.completed).length;
  const totalModules = MODULES.length;
  const overallPct = Math.round((completedCount / totalModules) * 100);

  // Find next unlocked module
  const nextIdx = MODULES.findIndex((m, i) => !progress[m.id]?.completed);

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ color: COLORS.textSecondary, fontSize: "0.85rem", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Welcome back</p>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{user.name} 👋</h1>
        </div>
        <button onClick={onLogout} style={{ padding: "8px 18px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, cursor: "pointer", fontSize: "0.85rem" }}>
          Sign Out
        </button>
      </div>

      {/* Progress overview */}
      <GlassCard style={{ padding: "1.5rem 2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <p style={{ color: COLORS.textSecondary, fontSize: "0.85rem", margin: "0 0 4px" }}>Overall Progress</p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: COLORS.textPrimary, margin: 0 }}>{overallPct}%</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: COLORS.textSecondary, fontSize: "0.85rem", margin: "0 0 4px" }}>Modules Completed</p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: COLORS.accent, margin: 0 }}>{completedCount}<span style={{ fontSize: "1rem", color: COLORS.textMuted }}>/{totalModules}</span></p>
          </div>
        </div>
        <ProgressBar value={overallPct} height={8} />
        {completedCount > 0 && completedCount < totalModules && (
          <p style={{ color: COLORS.textSecondary, fontSize: "0.82rem", marginTop: 10 }}>
            🔥 Keep going! You're on a roll.
          </p>
        )}
      </GlassCard>

      {/* Module grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {MODULES.map((mod, idx) => {
          const modProgress = progress[mod.id] || {};
          const isCompleted = modProgress.completed;
          const isUnlocked = idx === 0 || progress[MODULES[idx - 1]?.id]?.completed;
          const isCurrent = !isCompleted && isUnlocked;

          return (
            <GlassCard
              key={mod.id}
              hover={isUnlocked}
              onClick={isUnlocked ? () => onStartModule(idx) : undefined}
              style={{
                padding: "1.4rem",
                opacity: isUnlocked ? 1 : 0.4,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Color accent top bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: isCompleted ? COLORS.success : isCurrent ? mod.color : "rgba(255,255,255,0.1)", borderRadius: "16px 16px 0 0", transition: "background 0.3s" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.8rem" }}>{mod.icon}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: isCompleted ? COLORS.success : isCurrent ? mod.color : COLORS.textMuted }}>
                  {isCompleted ? "✓ DONE" : isCurrent ? "NEXT UP" : "🔒 LOCKED"}
                </span>
              </div>

              <p style={{ fontSize: "0.7rem", color: COLORS.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Module {idx + 1}</p>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 6px", lineHeight: 1.3 }}>{mod.title}</h3>
              <p style={{ fontSize: "0.82rem", color: COLORS.textSecondary, margin: "0 0 1rem", lineHeight: 1.4 }}>{mod.tagline}</p>

              {isCompleted && modProgress.score !== undefined && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ProgressBar value={Math.round((modProgress.score / 3) * 100)} color={COLORS.success} height={4} />
                  <span style={{ fontSize: "0.75rem", color: COLORS.success, whiteSpace: "nowrap" }}>{modProgress.score}/3</span>
                </div>
              )}

              {!isUnlocked && (
                <p style={{ fontSize: "0.78rem", color: COLORS.textMuted }}>Complete previous module to unlock</p>
              )}
            </GlassCard>
          );
        })}
      </div>

      {completedCount === totalModules && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button onClick={() => onStartModule("certificate")} style={{
            padding: "14px 36px", borderRadius: 12, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${COLORS.success}, #06b6d4)`,
            color: "#fff", fontSize: "1rem", fontWeight: 700,
            boxShadow: "0 8px 32px rgba(16,185,129,0.35)",
          }}>
            🏆 Claim Your Certificate →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── LIFE CALENDAR VISUALIZER ─────────────────────────────────────────────────
function LifeCalendarViz({ age }) {
  const totalWeeks = 90 * 52;
  const filledWeeks = Math.min(age * 52, totalWeeks);
  const COLS = 52;
  const rows = Math.ceil(totalWeeks / COLS);

  return (
    <div style={{ overflowX: "auto", padding: "1rem 0" }}>
      <p style={{ color: COLORS.textSecondary, fontSize: "0.8rem", marginBottom: "0.75rem", textAlign: "center" }}>
        Each square = 1 week of a 90-year life
      </p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 2, maxWidth: 600, margin: "0 auto" }}>
        {Array.from({ length: Math.min(totalWeeks, 4680) }).map((_, i) => (
          <div key={i} style={{
            aspectRatio: "1", borderRadius: 1,
            background: i < filledWeeks ? COLORS.accent : "rgba(255,255,255,0.07)",
            transition: "background 0.1s",
          }} />
        ))}
      </div>
      <p style={{ textAlign: "center", color: COLORS.textSecondary, fontSize: "0.78rem", marginTop: "0.75rem" }}>
        {filledWeeks} weeks lived · {totalWeeks - filledWeeks} weeks remaining
      </p>
    </div>
  );
}

// ─── MODULE VIEWER ────────────────────────────────────────────────────────────
function ModuleView({ moduleIdx, progress, onComplete, onBack }) {
  const mod = MODULES[moduleIdx];
  const [step, setStep] = useState(0); // 0=concept, 1=scenario, 2=reflection, 3=quiz, 4=complete
  const [choiceIdx, setChoiceIdx] = useState(null);
  const [reflection, setReflection] = useState("");
  const [quizAnswers, setQuizAnswers] = useState([null, null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [age, setAge] = useState(28);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(false); setTimeout(() => setVisible(true), 50); }, [step]);

  const quizScore = quizSubmitted ? quizAnswers.filter((a, i) => a === mod.quiz[i].answer).length : 0;

  function submitQuiz() {
    if (quizAnswers.includes(null)) return;
    setQuizSubmitted(true);
    setTimeout(() => setStep(4), 1500);
    onComplete(mod.id, quizScore);
  }

  const steps = ["Concept", "Scenario", "Reflection", "Quiz"];

  return (
    <div style={{ minHeight: "100vh", padding: "1.5rem", position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={onBack} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, cursor: "pointer", fontSize: "0.85rem" }}>
          ← Dashboard
        </button>
        <div style={{ flex: 1 }}>
          <ProgressBar value={((step) / 4) * 100} color={mod.color} />
        </div>
        <span style={{ color: COLORS.textMuted, fontSize: "0.82rem", whiteSpace: "nowrap" }}>{step}/4</span>
      </div>

      {/* Step tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: "2rem", flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <div key={s} style={{
            padding: "5px 14px", borderRadius: 100,
            background: i === step ? `${mod.color}22` : "rgba(255,255,255,0.04)",
            border: `1px solid ${i === step ? mod.color + "66" : COLORS.border}`,
            color: i === step ? mod.color : COLORS.textMuted,
            fontSize: "0.78rem", fontWeight: i === step ? 700 : 400,
            transition: "all 0.2s",
          }}>
            {i < step ? "✓ " : ""}{s}
          </div>
        ))}
      </div>

      <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "all 0.4s ease" }}>

        {/* ── STEP 0: CONCEPT ── */}
        {step === 0 && (
          <div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "3.5rem", lineHeight: 1 }}>{mod.icon}</div>
              <div>
                <Badge color={mod.color}>{`Module ${moduleIdx + 1}`}</Badge>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: COLORS.textPrimary, margin: "0.4rem 0 0.3rem", lineHeight: 1.15 }}>{mod.title}</h2>
                <p style={{ color: COLORS.textSecondary, margin: 0, fontStyle: "italic" }}>{mod.tagline}</p>
              </div>
            </div>

            <GlassCard style={{ padding: "1.5rem 1.8rem", marginBottom: "1.5rem" }}>
              {mod.concept.split("\n\n").map((para, i) => (
                <p key={i} style={{ color: COLORS.textSecondary, lineHeight: 1.75, margin: i === 0 ? 0 : "1rem 0 0", fontSize: "0.95rem" }}
                  dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${COLORS.textPrimary}">$1</strong>`) }} />
              ))}
            </GlassCard>

            {/* Life Calendar for final module */}
            {mod.id === "life-calendar" && (
              <GlassCard style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  <label style={{ color: COLORS.textSecondary, fontSize: "0.9rem" }}>Your approximate age:</label>
                  <input type="range" min={15} max={80} value={age} onChange={e => setAge(+e.target.value)}
                    style={{ flex: 1, minWidth: 140, accentColor: mod.color }} />
                  <span style={{ color: mod.color, fontWeight: 700, minWidth: 40 }}>{age}</span>
                </div>
                <LifeCalendarViz age={age} />
              </GlassCard>
            )}

            <button onClick={() => setStep(1)} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${mod.color}, ${mod.color}bb)`,
              color: "#fff", fontSize: "1rem", fontWeight: 700,
              boxShadow: `0 6px 24px ${mod.color}44`,
            }}>
              Continue to Scenario →
            </button>
          </div>
        )}

        {/* ── STEP 1: SCENARIO ── */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <Badge color={mod.color}>Decision Scenario</Badge>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: COLORS.textPrimary, margin: "0.75rem 0 0" }}>What would you do?</h2>
            </div>

            <GlassCard style={{ padding: "1.5rem", marginBottom: "1.5rem", borderLeft: `3px solid ${mod.color}` }}>
              <p style={{ color: COLORS.textPrimary, lineHeight: 1.7, margin: 0, fontSize: "1rem" }}>{mod.scenario.prompt}</p>
            </GlassCard>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {mod.scenario.choices.map((c, i) => {
                const chosen = choiceIdx === i;
                const revealed = choiceIdx !== null;
                return (
                  <GlassCard
                    key={i}
                    hover={!revealed}
                    onClick={() => !revealed && setChoiceIdx(i)}
                    style={{
                      padding: "1rem 1.25rem",
                      border: `1px solid ${chosen ? (c.correct ? COLORS.success : COLORS.danger) + "88" : COLORS.border}`,
                      background: chosen ? (c.correct ? "rgba(16,185,129,0.08)" : "rgba(244,63,94,0.08)") : COLORS.bgCard,
                    }}
                  >
                    <p style={{ margin: 0, color: COLORS.textPrimary, fontSize: "0.95rem" }}>{c.text}</p>
                    {chosen && (
                      <p style={{ margin: "0.5rem 0 0", color: c.correct ? COLORS.success : COLORS.warning, fontSize: "0.85rem" }}>{c.outcome}</p>
                    )}
                  </GlassCard>
                );
              })}
            </div>

            {choiceIdx !== null && (
              <button onClick={() => setStep(2)} style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${mod.color}, ${mod.color}bb)`,
                color: "#fff", fontSize: "1rem", fontWeight: 700,
              }}>
                Continue to Reflection →
              </button>
            )}
          </div>
        )}

        {/* ── STEP 2: REFLECTION ── */}
        {step === 2 && (
          <div>
            <Badge color={mod.color}>Reflection</Badge>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: COLORS.textPrimary, margin: "0.75rem 0 1.25rem" }}>Look inward</h2>

            <GlassCard style={{ padding: "1.5rem", marginBottom: "1.5rem", borderLeft: `3px solid ${mod.color}` }}>
              <p style={{ color: COLORS.textPrimary, lineHeight: 1.7, margin: 0, fontSize: "1rem" }}>{mod.reflection}</p>
            </GlassCard>

            <textarea
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Write your honest reflection here... (This stays private)"
              rows={6}
              style={{
                width: "100%", boxSizing: "border-box", padding: "1rem",
                background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`,
                borderRadius: 12, color: COLORS.textPrimary, fontSize: "0.95rem",
                resize: "vertical", fontFamily: "inherit", lineHeight: 1.6,
                outline: "none", transition: "border-color 0.2s", marginBottom: "1.5rem",
              }}
              onFocus={e => e.target.style.borderColor = mod.color}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />

            <button onClick={() => setStep(3)} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${mod.color}, ${mod.color}bb)`,
              color: "#fff", fontSize: "1rem", fontWeight: 700,
            }}>
              {reflection.trim() ? "Save & Continue to Quiz →" : "Skip to Quiz →"}
            </button>
          </div>
        )}

        {/* ── STEP 3: QUIZ ── */}
        {step === 3 && (
          <div>
            <Badge color={mod.color}>Knowledge Check</Badge>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: COLORS.textPrimary, margin: "0.75rem 0 1.5rem" }}>3 Quick Questions</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
              {mod.quiz.map((q, qi) => (
                <GlassCard key={qi} style={{ padding: "1.25rem" }}>
                  <p style={{ color: COLORS.textPrimary, fontWeight: 600, margin: "0 0 0.75rem", fontSize: "0.95rem" }}>
                    {qi + 1}. {q.q}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.options.map((opt, oi) => {
                      const selected = quizAnswers[qi] === oi;
                      const correct = quizSubmitted && oi === q.answer;
                      const wrong = quizSubmitted && selected && oi !== q.answer;
                      return (
                        <div
                          key={oi}
                          onClick={() => !quizSubmitted && setQuizAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; })}
                          style={{
                            padding: "10px 14px", borderRadius: 8, cursor: quizSubmitted ? "default" : "pointer",
                            background: correct ? "rgba(16,185,129,0.12)" : wrong ? "rgba(244,63,94,0.12)" : selected ? `${mod.color}15` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${correct ? COLORS.success + "66" : wrong ? COLORS.danger + "66" : selected ? mod.color + "55" : COLORS.border}`,
                            color: correct ? COLORS.success : wrong ? COLORS.danger : selected ? COLORS.textPrimary : COLORS.textSecondary,
                            fontSize: "0.9rem", transition: "all 0.15s",
                          }}
                        >
                          {correct ? "✓ " : wrong ? "✗ " : ""}{opt}
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={submitQuiz}
                disabled={quizAnswers.includes(null)}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  cursor: quizAnswers.includes(null) ? "default" : "pointer",
                  background: quizAnswers.includes(null) ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${mod.color}, ${mod.color}bb)`,
                  color: quizAnswers.includes(null) ? COLORS.textMuted : "#fff",
                  fontSize: "1rem", fontWeight: 700, transition: "all 0.2s",
                }}
              >
                Submit Answers
              </button>
            ) : (
              <GlassCard style={{ padding: "1.25rem", textAlign: "center" }}>
                <p style={{ fontSize: "2rem", margin: "0 0 0.5rem" }}>{quizScore === 3 ? "🎯" : quizScore === 2 ? "✅" : "📚"}</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 0.25rem" }}>
                  {quizScore}/3 Correct
                </p>
                <p style={{ color: COLORS.textSecondary, fontSize: "0.85rem", margin: 0 }}>
                  {quizScore === 3 ? "Perfect score! Module complete." : quizScore === 2 ? "Great work! Moving on..." : "Good effort — keep learning!"}
                </p>
              </GlassCard>
            )}
          </div>
        )}

        {/* ── STEP 4: COMPLETE ── */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
              {quizScore === 3 ? "🏅" : "✅"}
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "0.5rem" }}>
              Module Complete!
            </h2>
            <p style={{ color: COLORS.textSecondary, marginBottom: "0.75rem" }}>
              You've mastered: <strong style={{ color: mod.color }}>{mod.title}</strong>
            </p>
            <p style={{ color: COLORS.textSecondary, fontSize: "0.9rem", marginBottom: "2rem" }}>
              Quiz score: <strong style={{ color: COLORS.textPrimary }}>{quizScore}/3</strong>
            </p>

            {moduleIdx < MODULES.length - 1 ? (
              <button onClick={onBack} style={{
                padding: "14px 36px", borderRadius: 12, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentAlt})`,
                color: "#fff", fontSize: "1rem", fontWeight: 700,
                boxShadow: `0 6px 24px ${COLORS.accentGlow}`,
              }}>
                Continue to Dashboard →
              </button>
            ) : (
              <button onClick={onBack} style={{
                padding: "14px 36px", borderRadius: 12, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${COLORS.success}, #06b6d4)`,
                color: "#fff", fontSize: "1rem", fontWeight: 700,
                boxShadow: "0 6px 24px rgba(16,185,129,0.35)",
              }}>
                🏆 Claim Certificate →
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── CERTIFICATE ──────────────────────────────────────────────────────────────
function CertificatePage({ user, progress, onBack }) {
  const completedCount = Object.keys(progress).filter(k => progress[k]?.completed).length;
  const totalModules = MODULES.length;
  const completionPct = Math.round((completedCount / totalModules) * 100);
  
  const totalScore = MODULES.reduce((sum, m) => sum + (progress[m.id]?.score || 0), 0);
  const maxScore = MODULES.length * 3;
  const scorePct = Math.round((totalScore / maxScore) * 100);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <button onClick={onBack} style={{ alignSelf: "flex-start", marginBottom: "2rem", padding: "10px 20px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, cursor: "pointer", transition: "all 0.2s", fontWeight: 600 }}>
        ← Back to Dashboard
      </button>

      <div style={{ position: "relative", width: "100%", maxWidth: 700 }}>
        {/* Glow effect behind certificate */}
        <div style={{ position: "absolute", inset: -20, background: `linear-gradient(135deg, ${COLORS.accent}44, ${COLORS.accentAlt}44)`, filter: "blur(40px)", borderRadius: 30, zIndex: -1, animation: "pulse 4s ease-in-out infinite" }} />
        
        <GlassCard style={{ padding: "4rem 3rem", textAlign: "center", position: "relative", overflow: "hidden", border: `1px solid rgba(255,255,255,0.15)`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
          
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentAlt}, ${COLORS.success})` }} />

          {/* Decorative corner accents */}
          {["0 0", "100% 0", "0 100%", "100% 100%"].map((pos, i) => (
            <div key={i} style={{
              position: "absolute",
              top: pos.includes("100%") && pos.split(" ")[1] === "100%" ? "auto" : pos.split(" ")[1] === "0" ? 0 : "auto",
              bottom: pos.split(" ")[1] === "100%" ? 0 : "auto",
              left: pos.split(" ")[0] === "0" ? 0 : "auto",
              right: pos.split(" ")[0] === "100%" ? 0 : "auto",
              width: 80, height: 80,
              border: `2px solid ${COLORS.accent}33`,
              borderRadius: ["0 0 16px 0", "0 0 0 16px", "0 16px 0 0", "16px 0 0 0"][i],
            }} />
          ))}

          {/* Certificate Header */}
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accentAlt}22)`, border: `1px solid ${COLORS.accent}55`, marginBottom: "1.5rem", boxShadow: `0 0 30px ${COLORS.accent}33` }}>
            <span style={{ fontSize: "2.8rem" }}>🏆</span>
          </div>
          
          <p style={{ color: COLORS.accentAlt, fontSize: "0.85rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 800 }}>Certificate of Mastery</p>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 900, color: "#fff", marginBottom: "1.5rem", lineHeight: 1.15, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
            Inside the Mind of a<br />Master Procrastinator
          </h1>

          <p style={{ color: COLORS.textSecondary, margin: "0 0 0.5rem", fontSize: "1.1rem" }}>This certifies that</p>
          <p style={{ fontSize: "2.8rem", fontWeight: 800, color: COLORS.textPrimary, margin: "0 0 2rem", fontStyle: "italic", background: `linear-gradient(90deg, #fff, ${COLORS.textSecondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {user.name}
          </p>

          <p style={{ color: COLORS.textSecondary, margin: "0 auto 2.5rem", lineHeight: 1.7, maxWidth: 540, fontSize: "1.05rem" }}>
            has successfully conquered the Dark Playground, outsmarted the Instant Gratification Monkey, and completed all modules of the procrastination psychology learning experience.
          </p>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", maxWidth: 520, margin: "0 auto 3rem" }}>
            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: `1px solid rgba(16,185,129,0.2)` }}>
              <p style={{ fontSize: "0.8rem", color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 600 }}>Modules Completed</p>
              <p style={{ fontSize: "3rem", fontWeight: 900, color: COLORS.success, margin: 0, lineHeight: 1 }}>{completionPct}%</p>
              <p style={{ fontSize: "0.85rem", color: COLORS.textMuted, marginTop: "0.5rem", margin: 0 }}>{completedCount} / {totalModules} Modules</p>
            </div>
            
            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: `1px solid ${COLORS.accent}33` }}>
              <p style={{ fontSize: "0.8rem", color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 600 }}>Final Quiz Score</p>
              <p style={{ fontSize: "3rem", fontWeight: 900, color: COLORS.accent, margin: 0, lineHeight: 1 }}>{scorePct}%</p>
              <p style={{ fontSize: "0.85rem", color: COLORS.textMuted, marginTop: "0.5rem", margin: 0 }}>{totalScore} / {maxScore} Points</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: "3rem" }}>
            {MODULES.map((m, i) => (
              <div key={m.id} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                animation: `float 3s ease-in-out infinite ${i * 0.2}s`
              }} title={m.title}>
                <div style={{
                  fontSize: 24, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${m.color}15`, borderRadius: "50%", border: `1px solid ${m.color}44`,
                  boxShadow: `0 0 20px ${m.color}22`
                }}>{m.icon}</div>
              </div>
            ))}
          </div>

          <div style={{ width: 100, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`, margin: "0 auto 1.5rem" }} />
          <p style={{ color: COLORS.textMuted, fontSize: "0.85rem", margin: 0, letterSpacing: "0.1em", fontWeight: 600 }}>ISSUED ON {date.toUpperCase()}</p>
        </GlassCard>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | auth | dashboard | module | certificate
  const [user, setUser] = useLocalStorage("procr_user", null);
  const [progress, setProgress] = useLocalStorage("procr_progress", {});
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    if (user && screen === "landing") setScreen("dashboard");
  }, []);

  function handleStart() { setScreen(user ? "dashboard" : "auth"); }
  function handleAuth(u) { setUser(u); setScreen("dashboard"); }
  function handleLogout() { setUser(null); setProgress({}); setScreen("landing"); }

  function handleStartModule(idx) {
    if (idx === "certificate") { setScreen("certificate"); return; }
    setActiveModule(idx);
    setScreen("module");
  }

  function handleModuleComplete(modId, score) {
    setProgress(prev => ({ ...prev, [modId]: { completed: true, score, completedAt: Date.now() } }));
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.textPrimary, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", position: "relative" }}>
      <Starfield />

      {screen === "landing" && <LandingPage onStart={handleStart} />}
      {screen === "auth" && <AuthPage onAuth={handleAuth} />}
      {screen === "dashboard" && user && (
        <Dashboard user={user} progress={progress} onStartModule={handleStartModule} onLogout={handleLogout} />
      )}
      {screen === "module" && activeModule !== null && (
        <ModuleView
          moduleIdx={activeModule}
          progress={progress}
          onComplete={handleModuleComplete}
          onBack={() => setScreen("dashboard")}
        />
      )}
      {screen === "certificate" && user && (
        <CertificatePage user={user} progress={progress} onBack={() => setScreen("dashboard")} />
      )}
    </div>
  );
}
