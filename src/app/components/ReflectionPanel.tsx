'use client';

type ReflectionPanelProps = {
  reflection: string;
  onChange: (value: string) => void;
};

export const ReflectionPanel = ({
  reflection,
  onChange,
}: ReflectionPanelProps) => {
  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6">
      <h2 className="text-lg font-semibold text-slate-100">
        Intencja i podsumowanie
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Ustal mentalny punkt koncentracji na początek dnia lub zapisz wnioski po jego zakończeniu.
      </p>
      <textarea
        value={reflection}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        placeholder="Co dziś będzie najważniejsze? Jak chcesz się czuć po wykonaniu planu?"
        className="mt-4 w-full rounded-2xl border border-slate-700/80 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
      />
    </section>
  );
};
