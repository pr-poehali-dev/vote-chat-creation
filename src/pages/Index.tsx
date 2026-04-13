import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const VOTES_DATA = [
  {
    id: 1,
    title: "Утверждение бюджета на 2026 год",
    category: "Финансы",
    status: "active",
    deadline: "15 апр 2026",
    totalVoters: 142,
    voted: 98,
    options: [
      { label: "Принять бюджет", votes: 61, color: "#0ea5e9" },
      { label: "Отклонить", votes: 21, color: "#f43f5e" },
      { label: "Отложить рассмотрение", votes: 16, color: "#f59e0b" },
    ],
  },
  {
    id: 2,
    title: "Выбор нового директора по развитию",
    category: "Кадры",
    status: "active",
    deadline: "18 апр 2026",
    totalVoters: 142,
    voted: 74,
    options: [
      { label: "Иванов А.С.", votes: 38, color: "#0ea5e9" },
      { label: "Петрова Н.В.", votes: 22, color: "#8b5cf6" },
      { label: "Сидоров К.М.", votes: 14, color: "#10b981" },
    ],
  },
  {
    id: 3,
    title: "Переход на четырёхдневную рабочую неделю",
    category: "Корпоративная политика",
    status: "active",
    deadline: "20 апр 2026",
    totalVoters: 142,
    voted: 113,
    options: [
      { label: "За", votes: 79, color: "#10b981" },
      { label: "Против", votes: 28, color: "#f43f5e" },
      { label: "Воздержался", votes: 6, color: "#6b7280" },
    ],
  },
  {
    id: 4,
    title: "Расширение офиса в Санкт-Петербурге",
    category: "Инфраструктура",
    status: "closed",
    deadline: "01 апр 2026",
    totalVoters: 142,
    voted: 142,
    options: [
      { label: "Одобрить", votes: 89, color: "#0ea5e9" },
      { label: "Отклонить", votes: 53, color: "#f43f5e" },
    ],
  },
];

const STATS = [
  { label: "Активных голосований", value: "3", icon: "Vote" },
  { label: "Участников", value: "142", icon: "Users" },
  { label: "Завершено в квартале", value: "12", icon: "CheckCircle" },
  { label: "Средняя явка", value: "79%", icon: "TrendingUp" },
];

function AnimatedBar({ percent, color, delay = 0 }: { percent: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percent), 200 + delay);
    return () => clearTimeout(timer);
  }, [percent, delay]);

  return (
    <div className="h-1.5 bg-white/5 rounded-sm overflow-hidden">
      <div
        className="h-full rounded-sm"
        style={{ width: `${width}%`, backgroundColor: color, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </div>
  );
}

function DonutChart({ options, total }: { options: typeof VOTES_DATA[0]["options"]; total: number }) {
  const size = 80;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  let accOffset = 0;

  const segments = options.map((opt) => {
    const pct = total > 0 ? opt.votes / total : 0;
    const dash = pct * circumference;
    const currentOffset = accOffset;
    accOffset += dash;
    return { ...opt, dash, gap: circumference - dash, offset: currentOffset };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={seg.color}
          strokeWidth="8"
          strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
          strokeDashoffset={-seg.offset}
        />
      ))}
      <text
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontFamily="IBM Plex Mono"
        fontWeight="500"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {total}
      </text>
    </svg>
  );
}

function VoteCard({ vote, index }: { vote: typeof VOTES_DATA[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const totalVotes = vote.options.reduce((s, o) => s + o.votes, 0);
  const participation = Math.round((vote.voted / vote.totalVoters) * 100);
  const isActive = vote.status === "active";

  return (
    <div
      className="border border-border bg-card rounded-sm overflow-hidden hover:border-primary/40 transition-colors duration-300 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{vote.category}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-sm font-mono font-medium ${
                  isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {isActive ? "● АКТИВНО" : "○ ЗАВЕРШЕНО"}
              </span>
            </div>
            <h3 className="text-base font-semibold text-foreground leading-tight">{vote.title}</h3>
          </div>
          <div className="flex-shrink-0">
            <DonutChart options={vote.options} total={totalVotes} />
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {vote.options.map((opt, i) => {
            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">{opt.label}</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: opt.color }}>
                    {pct}%
                  </span>
                </div>
                <AnimatedBar percent={pct} color={opt.color} delay={i * 150} />
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-mono">
              <span className="text-foreground font-medium">{vote.voted}</span>/{vote.totalVoters}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-14 h-0.5 bg-white/5 rounded-sm overflow-hidden">
                <div className="h-full bg-primary/60 transition-all duration-1000" style={{ width: `${participation}%` }} />
              </div>
              <span className="font-mono text-primary">{participation}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Calendar" size={11} />
            <span>{vote.deadline}</span>
            <Icon
              name={expanded ? "ChevronUp" : "ChevronDown"}
              size={12}
              className="ml-1 text-muted-foreground/50"
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-secondary/40 px-5 py-4">
          <div className="text-xs text-muted-foreground mb-3 font-mono uppercase tracking-wider">
            Детальные результаты
          </div>
          <div className="space-y-2.5">
            {vote.options.map((opt, i) => {
              const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: opt.color }} />
                  <span className="text-sm text-foreground flex-1">{opt.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{opt.votes} гол.</span>
                  <span className="font-mono text-xs font-bold w-9 text-right" style={{ color: opt.color }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
          {isActive && (
            <button
              className="mt-4 w-full py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:bg-primary/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Проголосовать
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = VOTES_DATA.filter((v) => filter === "all" || v.status === filter);
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-primary flex items-center justify-center rounded-sm">
              <Icon name="Vote" size={13} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-tight">VOTECORP</span>
            <span className="hidden sm:block text-muted-foreground/50 text-xs">/ Корпоративное голосование</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              <span className="text-green-500 font-medium">LIVE</span>
            </div>
            <span className="tabular-nums text-foreground">{timeStr}</span>
            <span className="hidden md:block text-muted-foreground/40">{dateStr}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="border border-border bg-card p-4 rounded-sm animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-muted-foreground leading-tight">{s.label}</span>
                <Icon name={s.icon} size={14} className="text-primary/50 flex-shrink-0 mt-0.5" />
              </div>
              <div className="text-2xl font-mono font-semibold text-foreground">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Голосования</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Нажмите на карточку для просмотра деталей</p>
          </div>
          <div className="flex items-center border border-border rounded-sm overflow-hidden">
            {(["all", "active", "closed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {f === "all" ? "Все" : f === "active" ? "Активные" : "Завершённые"}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((vote, i) => (
            <VoteCard key={vote.id} vote={vote} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-5 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>VOTECORP © 2026</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-green-500 inline-block" />
            <span>Данные обновляются в реальном времени</span>
          </div>
        </div>
      </main>
    </div>
  );
}