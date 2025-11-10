'use client';

import { DaySettings } from "../lib/schedule";

type DaySettingsPanelProps = {
  settings: DaySettings;
  onUpdate: (settings: DaySettings) => void;
};

export const DaySettingsPanel = ({
  settings,
  onUpdate,
}: DaySettingsPanelProps) => {
  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-100">
          Ramy dnia
        </h2>
        <span className="text-xs text-slate-400">
          Doprecyzuj okno aktywności i tempo regeneracji.
        </span>
      </header>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Start dnia
          <input
            type="time"
            value={settings.dayStart}
            onChange={(event) =>
              onUpdate({ ...settings, dayStart: event.target.value })
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Koniec dostępności
          <input
            type="time"
            value={settings.dayEnd}
            onChange={(event) =>
              onUpdate({ ...settings, dayEnd: event.target.value })
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Przerwa co (min)
          <input
            type="number"
            min={30}
            step={15}
            value={settings.breakEvery}
            onChange={(event) =>
              onUpdate({ ...settings, breakEvery: Number(event.target.value) })
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Długość przerwy (min)
          <input
            type="number"
            min={5}
            step={5}
            value={settings.breakDuration}
            onChange={(event) =>
              onUpdate({
                ...settings,
                breakDuration: Number(event.target.value),
              })
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Minimalny blok głębokiej pracy (min)
          <input
            type="number"
            min={30}
            step={15}
            value={settings.focusBlock}
            onChange={(event) =>
              onUpdate({
                ...settings,
                focusBlock: Number(event.target.value),
              })
            }
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
      </div>
    </section>
  );
};
