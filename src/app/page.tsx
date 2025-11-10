/**
 * Inteligentny agent dnia — główna strona aplikacji.
 *
 * Implementacja wykorzystuje App Router, lokalne przechowywanie danych
 * oraz heurystyczne budowanie harmonogramu.
 */
"use client";

import { useMemo } from "react";
import { DaySettingsPanel } from "./components/DaySettingsPanel";
import { InsightsPanel } from "./components/InsightsPanel";
import { ReflectionPanel } from "./components/ReflectionPanel";
import { ScheduleTimeline } from "./components/ScheduleTimeline";
import { SuggestionsPanel } from "./components/SuggestionsPanel";
import { TaskForm, TaskDraft } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { usePersistentState } from "./hooks/usePersistentState";
import {
  DaySettings,
  Task,
  generateSchedule,
} from "./lib/schedule";

const defaultSettings: DaySettings = {
  dayStart: "07:30",
  dayEnd: "22:00",
  breakEvery: 90,
  breakDuration: 10,
  focusBlock: 90,
};

const seedTasks: Task[] = [
  {
    id: "seed-1",
    title: "Poranny rytuał energii",
    duration: 30,
    startTime: "07:30",
    priority: "średni",
    category: "zdrowie",
    notes: "Nawodnienie + oddech + krótkie rozciąganie",
    flexible: false,
    completed: false,
  },
  {
    id: "seed-2",
    title: "Sesja głębokiej pracy nad priorytetem",
    duration: 120,
    startTime: "09:00",
    priority: "wysoki",
    category: "praca",
    notes: "Zakończ najważniejszy projekt tygodnia",
    flexible: false,
    completed: false,
  },
  {
    id: "seed-3",
    title: "Inteligentna przerwa oddechowa",
    duration: 15,
    priority: "niski",
    category: "regeneracja",
    flexible: true,
    completed: false,
  },
];

const categoryLabel: Record<string, string> = {
  praca: "Praca / Projekty",
  nauka: "Nauka",
  zdrowie: "Zdrowie",
  relacje: "Relacje",
  regeneracja: "Regeneracja",
  inne: "Inne",
};

const getGreeting = () => {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 9) return "Świadome wejście w dzień";
  if (hour < 13) return "Pora na strategiczną energię";
  if (hour < 18) return "Utrzymaj rytm działania";
  return "Zamykamy dzień z uważnością";
};

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;
};

export default function Home() {
  const [tasks, setTasks] = usePersistentState<Task[]>("agent:tasks", seedTasks);
  const [settings, setSettings] = usePersistentState<DaySettings>(
    "agent:settings",
    defaultSettings,
  );
  const [reflection, setReflection] = usePersistentState<string>("agent:reflection", "");

  const schedule = useMemo(
    () => generateSchedule(tasks, settings),
    [tasks, settings],
  );

  const categoryStats = useMemo(() => {
    const aggregated = new Map<string, { duration: number; count: number }>();
    schedule.timeline.forEach((task) => {
      if (task.autoInserted) return;
      const current = aggregated.get(task.category) ?? { duration: 0, count: 0 };
      aggregated.set(task.category, {
        duration: current.duration + task.duration,
        count: current.count + 1,
      });
    });
    return Array.from(aggregated.entries()).map(([key, value]) => ({
      label: categoryLabel[key] ?? key,
      duration: value.duration,
      count: value.count,
    }));
  }, [schedule.timeline]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  const highPriorityCount = useMemo(
    () => tasks.filter((task) => task.priority === "wysoki").length,
    [tasks],
  );

  const handleAddTask = (draft: TaskDraft) => {
    const newTask: Task = {
      ...draft,
      id: generateId(),
      completed: false,
    };
    setTasks((current) => [...current, newTask]);
  };

  const handleToggleTask = (id: string) =>
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );

  const handleRemoveTask = (id: string) =>
    setTasks((current) => current.filter((task) => task.id !== id));

  const polishDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("pl-PL", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    return formatter.format(new Date());
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 lg:py-14">
      <header className="flex flex-col gap-4 rounded-3xl border border-sky-500/30 bg-slate-900/60 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-sky-400">
            {getGreeting()}
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-slate-50 md:text-4xl">
            Agent dziennego prowadzenia
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Planer, który łączy priorytety, energię i regenerację. Wpisz cele,
            a agent ułoży harmonogram z mikro-podpowiedziami i miejscem na
            przerwy.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 px-5 py-4 text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">Dziś</p>
          <p className="text-lg font-semibold text-slate-100">{polishDate}</p>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-8">
          <TaskForm onSubmit={handleAddTask} />
          <DaySettingsPanel settings={settings} onUpdate={setSettings} />
          <ReflectionPanel reflection={reflection} onChange={setReflection} />
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6">
            <h2 className="text-lg font-semibold text-slate-100">
              Zadania źródłowe
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Utrzymuj listę aktualną — agent korzysta z niej przy każdym
              przeliczeniu planu.
            </p>
            <div className="mt-4">
              <TaskList
                tasks={tasks}
                onToggle={handleToggleTask}
                onRemove={handleRemoveTask}
              />
            </div>
          </div>

          {schedule.unscheduled.length > 0 && (
            <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm text-amber-100">
              <h3 className="text-base font-semibold">
                Zadania wymagające atencji ({schedule.unscheduled.length})
              </h3>
              <ul className="mt-3 space-y-2">
                {schedule.unscheduled.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between rounded-2xl border border-amber-400/40 bg-amber-500/10 px-3 py-2"
                  >
                    <span>{task.title}</span>
                    <span className="text-xs uppercase tracking-wide">
                      {task.duration} min • {task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <ScheduleTimeline
        timeline={schedule.timeline}
        dayStart={settings.dayStart}
        dayEnd={settings.dayEnd}
      />

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightsPanel
          totalTasks={tasks.length}
          completedTasks={completedTasks}
          focusMinutes={schedule.focusMinutes}
          restMinutes={schedule.restMinutes}
          freeMinutes={schedule.freeMinutes}
          highPriorityCount={highPriorityCount}
          unscheduledCount={schedule.unscheduled.length}
          categoryStats={categoryStats}
        />
        <SuggestionsPanel suggestions={schedule.suggestions} />
      </section>
    </main>
  );
}
