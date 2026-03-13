import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import {
  Brain,
  Database,
  Server,
  Code2,
  Zap,
  Globe,
  Shield,
  GitBranch,
  Star,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  MessageSquare,
  BarChart3,
  Lock,
  Github,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Users,
  Heart,
} from "lucide-react";

// ── Shadcn-style primitives (inline, no build step needed) ──────────────────

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${className}`}
  >
    {children}
  </span>
);

const Button = ({ children, className = "", variant = "primary", href, onClick }) => {
  const base =
    "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer";
  const variants = {
    primary:
      "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 hover:-translate-y-0.5",
    outline:
      "border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:-translate-y-0.5",
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800/60",
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} target={href ? "_blank" : undefined} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Tag>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const Separator = ({ className = "" }) => (
  <div className={`h-px bg-zinc-800 ${className}`} />
);

// ── Data ────────────────────────────────────────────────────────────────────

const TECH_STACK = [
  {
    name: "MongoDB",
    role: "Database",
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    desc: "Flexible document storage for AI-generated content and user data at scale.",
  },
  {
    name: "Express.js",
    role: "Backend",
    icon: Server,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    desc: "Fast, unopinionated REST API layer handling AI model orchestration.",
  },
  {
    name: "React.js",
    role: "Frontend",
    icon: Code2,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    desc: "Component-driven UI delivering real-time AI interactions seamlessly.",
  },
  {
    name: "Node.js",
    role: "Runtime",
    icon: Terminal,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    desc: "Event-driven runtime powering concurrent AI processing pipelines.",
  },
  {
    name: "AI / LLMs",
    role: "Intelligence",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    desc: "Integrated large language models and ML inference for core features.",
  },
  {
    name: "REST / WS",
    role: "APIs",
    icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    desc: "RESTful endpoints and WebSocket streams for real-time AI responses.",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Contextual AI Reasoning",
    desc: "Multi-turn conversations with persistent memory and deep contextual understanding across sessions.",
    color: "text-purple-400",
    accent: "group-hover:bg-purple-400/10",
  },
  {
    icon: Zap,
    title: "Real-Time Inference",
    desc: "Sub-second AI responses powered by streaming architecture and optimized model pipelines.",
    color: "text-yellow-400",
    accent: "group-hover:bg-yellow-400/10",
  },
  {
    icon: Layers,
    title: "Modular AI Pipeline",
    desc: "Swap and compose AI models like building blocks. RAG, embeddings, and agents in one framework.",
    color: "text-blue-400",
    accent: "group-hover:bg-blue-400/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track usage, model performance, token consumption, and accuracy metrics in real time.",
    color: "text-emerald-400",
    accent: "group-hover:bg-emerald-400/10",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "JWT auth, role-based access control, rate limiting, and encrypted AI prompt logging.",
    color: "text-red-400",
    accent: "group-hover:bg-red-400/10",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Interface",
    desc: "Intuitive chat interface with markdown rendering, code highlighting, and file context.",
    color: "text-cyan-400",
    accent: "group-hover:bg-cyan-400/10",
  },
  {
    icon: Cpu,
    title: "Autonomous Agents",
    desc: "AI agents that plan, execute tool calls, browse the web, and solve multi-step tasks.",
    color: "text-orange-400",
    accent: "group-hover:bg-orange-400/10",
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "On-premise deployment option. Your data never trains external models without consent.",
    color: "text-green-400",
    accent: "group-hover:bg-green-400/10",
  },
];

const TEAM = [
  {
    name: "Alex Rivera",
    role: "Founder & Full-Stack Engineer",
    avatar: "AR",
    bio: "10+ years building scalable systems. Passionate about democratizing AI for developers worldwide.",
    links: { github: "#", twitter: "#" },
    gradient: "from-purple-500 to-blue-500",
  },
  {
    name: "Sam Chen",
    role: "AI/ML Engineer",
    avatar: "SC",
    bio: "Former research engineer at a top AI lab. Specializes in LLM fine-tuning and agent architectures.",
    links: { github: "#", twitter: "#" },
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    name: "Jordan Kim",
    role: "Frontend & UX Lead",
    avatar: "JK",
    bio: "Crafts interfaces that make complex AI feel approachable. Open-source contributor since 2016.",
    links: { github: "#", twitter: "#" },
    gradient: "from-orange-500 to-pink-500",
  },
];

const STATS = [
  { value: "50K+", label: "API Requests / Day" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "12ms", label: "Avg. Latency" },
  { value: "200+", label: "GitHub Stars" },
];

// ── Animated counter ────────────────────────────────────────────────────────
const useCounter = (end, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseInt(end.replace(/\D/g, ""));
    if (!num) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function AboutUs() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById("stats-section");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.25s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.4s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.55s ease both; }
        .glow-pulse { animation: glow 3s ease-in-out infinite; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .card-hover { transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); }
      `}</style>

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white bg-white backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
              <Brain size={14} className="text-black" />
            </div>
            <span className="display-font font-bold text-sm tracking-tight">NexusAI</span>
            <Badge className="border-emerald-500/30 text-emerald-400 bg-emerald-400/5 ml-2 hidden sm:inline-flex">
              v2.0 Beta
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-xs">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <Button variant="ghost" className="text-xs hidden sm:inline-flex">Demo</Button>
            <Button variant="ghost" className="text-xs hidden sm:inline-flex">Docs</Button>
            <Button variant="ghost" className="text-xs hidden sm:inline-flex">Blog</Button>
            <Button variant="outline" href="https://github.com/ramesh1234-ai/HeartSync" className="text-xs py-2 px-4">
              <Github size={14} /> GitHub
            </Button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-60" />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/8 blur-[120px] glow-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/6 blur-[80px] glow-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] rounded-full bg-blue-500/6 blur-[80px] glow-pulse" style={{ animationDelay: "2s" }} />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="fade-up-1">
            <Badge className="border-emerald-500/40 text-emerald-400 bg-emerald-400/5 mb-8">
              <Sparkles size={10} /> AI-Powered · MERN Stack · Open Source
            </Badge>
          </div>
          <Separator />
          <h1 className="display-font leading-none mb-6 fade-up-2">
            <span className="block text-6xl sm:text-8xl lg:text-9xl text-black">Nexus</span>
            <span
              className="block text-6xl sm:text-8xl lg:text-9xl"
              style={{
                background: "linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI
            </span>
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4 fade-up-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            The full-stack AI application platform that{" "}
            <span className="text-black font-semibold">developers actually love</span> to build on.
          </p>
          <p className="text-zinc-600 text-sm max-w-xl mx-auto mb-10 fade-up-3">
            Built with MongoDB · Express.js · React.js · Node.js and integrated with cutting-edge LLMs.
            Ship AI features in days, not months.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 fade-up-4">
            <Button href="https://github.com/ramesh1234-ai/HeartSync" className="text-sm">
              <Github size={16} /> Star on GitHub
              <ArrowRight size={14} />
            </Button>
            <Button variant="outline" className="text-sm">
              <Terminal size={16} /> View Docs
            </Button>
          </div>
        </div>
      </section>
      <Separator />
      {/* ── MISSION & VISION ── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="border-purple-500/30 text-purple-400 bg-purple-400/5 mb-6">
              Our Foundation
            </Badge>
            <h2 className="display-font font-bold text-4xl sm:text-5xl text-black mb-6 leading-tight">
              Built with purpose,<br />
              <span className="text-zinc-500">not just possibility.</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              NexusAI started from a simple frustration: integrating AI into real applications shouldn't require
              a PhD or a $2M infrastructure budget. We built the platform we wished existed.
            </p>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Every design decision prioritizes developer experience, production reliability, and
              ethical AI deployment. We believe the best AI tools are the ones that get out of your way.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Star,
                label: "Mission",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10 border-yellow-400/20",
                text: "Empower every developer — regardless of ML expertise — to build production-grade AI applications using familiar MERN-stack patterns.",
              },
              {
                icon: Sparkles,
                label: "Vision",
                color: "text-purple-400",
                bg: "bg-purple-400/10 border-purple-400/20",
                text: "A world where AI is a standard layer of the web stack, as accessible as a database call — open, composable, and developer-owned.",
              },
              {
                icon: Heart,
                label: "Values",
                color: "text-red-400",
                bg: "bg-red-400/10 border-red-400/20",
                text: "Radical transparency, open-source collaboration, privacy by default, and genuine care for the developer community we serve.",
              },
            ].map((item) => (
              <Card key={item.label} className={`p-5 border ${item.bg} card-hover`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${item.bg} border flex-shrink-0`}>
                    <item.icon size={16} className={item.color} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold tracking-widest uppercase ${item.color} mb-1.5`}>{item.label}</div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* ── TECH STACK ── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <Badge className="border-blue-500/30 text-blue-400 bg-blue-400/5 mb-6">Technology</Badge>
          <h2 className="display-font font-bold text-4xl sm:text-5xl text-white mb-4">
            The Stack Behind the Magic
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto">
            Every technology chosen for a reason. Battle-tested at scale, beloved by developers.
          </p>
        </div>

        {/* Interactive tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TECH_STACK.map((tech, i) => (
            <button
              key={tech.name}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${activeTab === i
                ? `${tech.bg} ${tech.border} ${tech.color}`
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                }`}
            >
              {tech.name}
            </button>
          ))}
        </div>

        {/* Active tech detail */}
        <Card className="p-6 mb-10 border-zinc-700/50">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${TECH_STACK[activeTab].bg} border ${TECH_STACK[activeTab].border}`}>
              {(() => { const Icon = TECH_STACK[activeTab].icon; return <Icon size={24} className={TECH_STACK[activeTab].color} />; })()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="display-font font-bold text-lg text-black">{TECH_STACK[activeTab].name}</span>
                <Badge className={`border ${TECH_STACK[activeTab].border} ${TECH_STACK[activeTab].color} ${TECH_STACK[activeTab].bg} text-[10px]`}>
                  {TECH_STACK[activeTab].role}
                </Badge>
              </div>
              <p className="text-zinc-400 text-sm">{TECH_STACK[activeTab].desc}</p>
            </div>
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_STACK.map((tech) => (
            <Card key={tech.name} className={`p-5 border ${tech.border} card-hover group cursor-pointer`} onClick={() => setActiveTab(TECH_STACK.indexOf(tech))}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${tech.bg} border ${tech.border}`}>
                  <tech.icon size={16} className={tech.color} />
                </div>
                <span className={`font-semibold text-sm ${tech.color}`}>{tech.name}</span>
                <span className="text-zinc-600 text-xs ml-auto">{tech.role}</span>
              </div>
              <p className="text-black-500 text-xs leading-relaxed">{tech.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <Badge className="border-emerald-500/30 text-emerald-400 bg-emerald-400/5 mb-6">Features</Badge>
          <h2 className="display-font font italic text-2xl sm:text-5xl text-black mb-4">
            All You Need to Ship AI
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto">
            From authentication to autonomous agents. NexusAI handles the hard parts so you can focus on your product.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className={`p-5 group card-hover cursor-default transition-colors duration-200 ${f.accent}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-zinc-800 group-hover:scale-110 transition-transform duration-200`}>
                <f.icon size={18} className={f.color} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 display-font">{f.title}</h3>
              <p className="text-black text-xs leading-relaxed">{f.desc}</p>
              <div className={`mt-4 flex items-center gap-1 text-xs ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                Learn more <ChevronRight size={12} />
              </div>
            </Card>
          ))}
        </div>
      </section>
      <Separator />
      {/* ── WHY THIS PROJECT EXISTS ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Badge className="border-green-500/30 text-green-400 bg-green-400/5 mb-6">
            Why We Built This
          </Badge>
          <h2 className="display-font font-bold text-4xl sm:text-5xl text-black mb-8 leading-tight">
            AI shouldn't be a black box<br />
            <span className="text-zinc-500">reserved for big tech.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                num: "01",
                title: "The Gap Was Real",
                text: "Developers wanted to integrate AI but faced a wall of Python notebooks, cloud lock-in, and opaque APIs. We bridged that gap with familiar JS tooling.",
              },
              {
                num: "02",
                title: "Open Source Philosophy",
                text: "AI is too important to be proprietary. Every line of NexusAI is open, auditable, and community-driven. No vendor lock-in. Ever.",
              },
              {
                num: "03",
                title: "Built in Public",
                text: "We shipped v1 with 3 contributors and zero funding. Proof that great tools come from necessity, not investor decks.",
              },
            ].map((item) => (
              <Card key={item.num} className="p-6 card-hover">
                <div className="text-4xl font-bold text-white-800 display-font mb-4">{item.num}</div>
                <h3 className="text-white font-semibold text-sm mb-3 display-font">{item.title}</h3>
                <p className="text-black-500 text-xs leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Separator />
      {/* ── FOOTER ── */}
      <footer className="border-t border-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
              <Brain size={10} className="text-black" />
            </div>
            <span className="display-font font-bold text-sm text-zinc-400">NexusAI</span>
          </div>
          <p className="text-zinc-600 text-xs">
            MIT License · Built with ♥ by the Rishit
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Privacy</a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Terms</a>
            <a href="https://github.com/ramesh1234-ai/HeartSync" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors flex items-center gap-1">
              <Github size={12} /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}