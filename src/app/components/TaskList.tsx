'use client';

import { Task, minutesToTime, timeToMinutes } from "../lib/schedule";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

const priorityBadge: Record<Task["priority"], string> = {
  wysoki: "bg-rose-500/20 text-rose-200 border border-rose-400/50",
  średni: "bg-amber-500/20 text-amber-100 border border-amber-400/50",
  niski: "bg-emerald-500/20 text-emerald-100 border border-emerald-400/50",
};

const categoryPalette: Record<string, string> = {
  praca: "bg-sky-500/15 text-sky-200",
  nauka: "bg-indigo-500/20 text-indigo-200",
  zdrowie: "bg-emerald-500/20 text-emerald-200",
  relacje: "bg-fuchsia-500/20 text-fuchsia-200",
  regeneracja: "bg-cyan-500/20 text-cyan-200",
  inne: "bg-slate-500/20 text-slate-200",
};

export const TaskList = ({ tasks, onToggle, onRemove }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/50 p-6 text-sm text-slate-400">
        Nie masz jeszcze żadnych zadań. Zacznij od najważniejszego celu na dziś.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => {
        const categoryClass =
          categoryPalette[task.category] ?? "bg-slate-500/20 text-slate-200";

        return (
          <li
            key={task.id}
            className="group flex items-start justify-between gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/70 p-4 transition hover:border-sky-500/40"
          >
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggle(task.id)}
                  className={`h-5 w-5 rounded-full border-2 ${
                    task.completed
                      ? "border-emerald-400 bg-emerald-500/40"
                      : "border-slate-600/80"
                  } transition`}
                  aria-label={`Oznacz zadanie ${task.title} jako wykonane`}
                />
                <span
                  className={`text-base font-medium ${
                    task.completed ? "text-slate-500 line-through" : "text-slate-100"
                  }`}
                >
                  {task.title}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs ${categoryClass}`}>
                  {task.category}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge[task.priority]}`}
                >
                  Priorytet: {task.priority}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span>{task.duration} min</span>
                {task.startTime ? (
                  <span>
                    {task.startTime} → {minutesToTime(timeToMinutes(task.startTime) + task.duration)}
                  </span>
                ) : (
                  <span>Elastyczne okno czasowe</span>
                )}
                {!task.flexible && !task.startTime && (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-200">
                    Zarezerwuj konkretną godzinę
                  </span>
                )}
                {task.notes && (
                  <span className="rounded-2xl border border-slate-600/60 bg-slate-900/60 px-3 py-1 text-slate-300">
                    {task.notes}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(task.id)}
              className="rounded-full border border-slate-700/80 px-3 py-1 text-xs text-slate-400 transition hover:border-rose-500/60 hover:text-rose-200"
            >
              Usuń
            </button>
          </li>
        );
      })}
    </ul>
  );
};
