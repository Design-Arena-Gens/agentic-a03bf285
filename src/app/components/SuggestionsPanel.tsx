'use client';

type SuggestionsPanelProps = {
  suggestions: string[];
};

export const SuggestionsPanel = ({ suggestions }: SuggestionsPanelProps) => {
  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6">
      <h2 className="text-lg font-semibold text-slate-100">
        Inteligentne podpowiedzi
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Agent analizuje plan i wskazuje mikro-usprawnienia, które poprawią energię i wykonanie.
      </p>

      <ul className="mt-4 space-y-3">
        {suggestions.map((suggestion, index) => (
          <li
            key={`${suggestion}-${index}`}
            className="flex items-start gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm text-sky-100"
          >
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/30 text-xs font-semibold text-sky-50">
              {index + 1}
            </span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
