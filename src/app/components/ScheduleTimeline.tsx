'use client';

import { ScheduledTask, minutesToTime } from "../lib/schedule";

type ScheduleTimelineProps = {
  timeline: ScheduledTask[];
  dayStart: string;
  dayEnd: string;
};

const categoryAccent: Record<string, string> = {
  praca: "border-l-sky-400",
  nauka: "border-l-indigo-400",
  zdrowie: "border-l-emerald-400",
  relacje: "border-l-fuchsia-400",
  regeneracja: "border-l-cyan-400",
  inne: "border-l-slate-500",
};

export const ScheduleTimeline = ({
  timeline,
  dayStart,
  dayEnd,
}: ScheduleTimelineProps) => {
  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Plan dnia: {dayStart} – {dayEnd}
          </h2>
          <p className="text-sm text-slate-400">Agent optymalizuje blok po bloku.</p>
        </div>
      </header>

      <div className="mt-6 space-y-4">
        {timeline.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700/80 p-6 text-sm text-slate-400">
            Dodaj zadania i wygeneruj plan, aby zobaczyć harmonogram dnia.
          </div>
        ) : (
          timeline.map((task) => {
            const accent =
              categoryAccent[task.category] ?? "border-l-slate-500";
            return (
              <article
                key={`${task.id}-${task.start}`}
                className={`relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition hover:border-sky-400/50 ${accent}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {minutesToTime(task.start)} – {minutesToTime(task.end)}
                    </span>
                    <h3 className="text-base font-semibold text-slate-100">
                      {task.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-slate-700/80 px-3 py-1 text-xs text-slate-300">
                    {task.duration} min
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {task.autoInserted ? (
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-200">
                      Automatyczna przerwa regeneracyjna
                    </span>
                  ) : (
                    <>
                      <span className="rounded-full bg-slate-800/70 px-3 py-1">
                        Priorytet: {task.priority}
                      </span>
                      <span className="rounded-full bg-slate-800/70 px-3 py-1">
                        Kategoria: {task.category}
                      </span>
                      {!task.flexible && !task.startTime && (
                        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-200">
                          Rekomendacja: nadaj konkretną godzinę
                        </span>
                      )}
                    </>
                  )}
                  {task.notes && (
                    <span className="rounded-2xl border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-slate-300">
                      {task.notes}
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
