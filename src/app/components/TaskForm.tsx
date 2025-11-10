'use client';

import { useMemo, useState } from "react";
import { Priority } from "../lib/schedule";

export type TaskDraft = {
  title: string;
  duration: number;
  startTime?: string;
  priority: Priority;
  category: string;
  notes?: string;
  flexible: boolean;
};

type TaskFormProps = {
  onSubmit: (task: TaskDraft) => void;
};

const defaultDraft: TaskDraft = {
  title: "",
  duration: 60,
  priority: "średni",
  category: "praca",
  flexible: true,
};

const categoryOptions = [
  { value: "praca", label: "Praca / Projekty" },
  { value: "nauka", label: "Nauka i rozwój" },
  { value: "zdrowie", label: "Zdrowie i energia" },
  { value: "relacje", label: "Relacje" },
  { value: "regeneracja", label: "Regeneracja" },
  { value: "inne", label: "Inne" },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "wysoki", label: "Wysoki" },
  { value: "średni", label: "Średni" },
  { value: "niski", label: "Niski" },
];

export const TaskForm = ({ onSubmit }: TaskFormProps) => {
  const [draft, setDraft] = useState<TaskDraft>(defaultDraft);

  const startTimeValue = useMemo(
    () => (draft.startTime ? draft.startTime : ""),
    [draft.startTime],
  );

  const handleSubmit = () => {
    if (!draft.title.trim()) return;
    if (draft.duration <= 0) return;

    onSubmit({
      ...draft,
      startTime: draft.startTime?.trim() ? draft.startTime : undefined,
    });

    setDraft(defaultDraft);
  };

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-slate-900/60 p-6 backdrop-blur">
      <h2 className="text-lg font-semibold text-sky-200">Dodaj nowe zadanie</h2>
      <p className="mt-1 text-sm text-slate-400">
        Zdefiniuj najważniejsze aktywności, określ priorytet i czas trwania. Agent zadba o resztę.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Nazwa zadania
          <input
            type="text"
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Np. Strategiczna sesja planowania"
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Czas trwania (min)
          <input
            type="number"
            min={15}
            step={5}
            value={draft.duration}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                duration: Number(event.target.value),
              }))
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Priorytet
          <select
            value={draft.priority}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                priority: event.target.value as Priority,
              }))
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Kategoria
          <select
            value={draft.category}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Godzina (opcjonalnie)
          <input
            type="time"
            value={startTimeValue}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                startTime: event.target.value || undefined,
              }))
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Elastyczne?
          <select
            value={draft.flexible ? "elastyczne" : "sztywne"}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                flexible: event.target.value === "elastyczne",
              }))
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          >
            <option value="elastyczne">Agent dobierze slot</option>
            <option value="sztywne">Przypisane do konkretnej godziny</option>
          </select>
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2 text-sm text-slate-200">
        Notatki / intencja (opcjonalnie)
        <textarea
          rows={2}
          value={draft.notes ?? ""}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          placeholder="Co sprawi, że to zadanie będzie sukcesem?"
          className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-slate-400">
          Tip: zadania elastyczne agent rozłoży pomiędzy sztywne bloki i przerwy.
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Dodaj do planu
        </button>
      </div>
    </div>
  );
};
