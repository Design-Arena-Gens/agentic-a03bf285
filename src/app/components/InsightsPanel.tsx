'use client';

type CategoryMetrics = {
  label: string;
  duration: number;
  count: number;
};

type InsightsPanelProps = {
  totalTasks: number;
  completedTasks: number;
  focusMinutes: number;
  restMinutes: number;
  freeMinutes: number;
  highPriorityCount: number;
  unscheduledCount: number;
  categoryStats: CategoryMetrics[];
};

const metricCard = (label: string, value: string, tone = "default") => {
  const palette: Record<string, string> = {
    default: "bg-slate-900/60 border border-slate-700/80",
    positive: "bg-emerald-500/20 border border-emerald-400/40 text-emerald-100",
    warning: "bg-amber-500/15 border border-amber-400/50 text-amber-100",
    neutral: "bg-slate-900/60 border border-slate-700/80 text-slate-200",
  };
  return (
    <div className={`rounded-3xl p-4 ${palette[tone] ?? palette.default}`}>
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
    </div>
  );
};

export const InsightsPanel = ({
  totalTasks,
  completedTasks,
  focusMinutes,
  restMinutes,
  freeMinutes,
  highPriorityCount,
  unscheduledCount,
  categoryStats,
}: InsightsPanelProps) => {
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const focusHours = (focusMinutes / 60).toFixed(1);
  const restHours = restMinutes > 0 ? (restMinutes / 60).toFixed(1) : "0.0";

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6">
      <header className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-100">
          Inteligencja dnia
        </h2>
        <span className="text-xs uppercase tracking-wider text-slate-500">
          Wskaźniki, które pomagają świadomie prowadzić dzień
        </span>
      </header>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {metricCard("Zadania w planie", `${totalTasks}`)}
        {metricCard("Kompletacja", `${completionRate}%`, completionRate >= 50 ? "positive" : "neutral")}
        {metricCard("Głęboka praca", `${focusHours} h`, focusMinutes >= 180 ? "positive" : "neutral")}
        {metricCard("Wolne okno", `${Math.max(freeMinutes, 0)} min`, freeMinutes < 30 ? "warning" : "neutral")}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200">Priorytety</h3>
          <p className="mt-1 text-xs text-slate-400">
            {highPriorityCount} zadań o wysokim priorytecie. Odznaczaj wykonane, aby agent mógł aktualizować podpowiedzi.
          </p>
          <p className="mt-4 text-sm text-slate-200">
            Przerwy: {restHours} h • Zadania czekające: {unscheduledCount}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200">Balans kategorii</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            {categoryStats.length === 0 ? (
              <li>Brak danych — dodaj zadania, aby zobaczyć rozkład.</li>
            ) : (
              categoryStats.map((category) => (
                <li
                  key={category.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/70 px-3 py-2"
                >
                  <span>{category.label}</span>
                  <span className="font-semibold text-slate-100">
                    {category.duration} min • {category.count} zadań
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};
