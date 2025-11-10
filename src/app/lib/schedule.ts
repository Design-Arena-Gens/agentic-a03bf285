export type Priority = "wysoki" | "średni" | "niski";

export type Task = {
  id: string;
  title: string;
  duration: number; // minutes
  startTime?: string; // HH:mm
  priority: Priority;
  category: string;
  notes?: string;
  flexible: boolean;
  completed: boolean;
};

export type DaySettings = {
  dayStart: string; // HH:mm
  dayEnd: string; // HH:mm
  breakEvery: number; // minutes
  breakDuration: number; // minutes
  focusBlock: number; // minutes
};

export type ScheduledTask = Task & {
  start: number;
  end: number;
  autoInserted?: boolean;
};

export type ScheduleResult = {
  timeline: ScheduledTask[];
  unscheduled: Task[];
  suggestions: string[];
  focusMinutes: number;
  restMinutes: number;
  freeMinutes: number;
};

const MINUTES_IN_DAY = 24 * 60;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return clamp(hours * 60 + minutes, 0, MINUTES_IN_DAY);
};

export const minutesToTime = (minutes: number) => {
  const clamped = clamp(minutes, 0, MINUTES_IN_DAY);
  const h = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(clamped % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
};

const priorityWeight: Record<Priority, number> = {
  wysoki: 3,
  średni: 2,
  niski: 1,
};

const sortByPriority = (tasks: Task[]) =>
  [...tasks].sort((a, b) => {
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }

    return a.duration === b.duration ? a.title.localeCompare(b.title) : b.duration - a.duration;
  });

const createBreak = (
  baseId: string,
  start: number,
  duration: number,
): ScheduledTask => ({
  id: `${baseId}-break-${start}`,
  title: "Świadoma przerwa",
  duration,
  start,
  end: start + duration,
  priority: "średni",
  category: "regeneracja",
  flexible: false,
  completed: false,
  autoInserted: true,
});

export function generateSchedule(tasks: Task[], settings: DaySettings): ScheduleResult {
  const startDay = timeToMinutes(settings.dayStart);
  const endDay = timeToMinutes(settings.dayEnd);
  const dayWindow = Math.max(endDay - startDay, 0);

  const anchored = tasks
    .filter((task) => Boolean(task.startTime) && !task.flexible)
    .map((task) => {
      const start = timeToMinutes(task.startTime!);
      return {
        ...task,
        start,
        end: start + task.duration,
      };
    })
    .filter((task) => task.end > task.start);

  anchored.sort((a, b) => a.start - b.start);

  const anchoredWithinDay = anchored.filter(
    (task) => task.start >= startDay && task.end <= endDay,
  );

  const flexible = sortByPriority(tasks.filter((task) => !task.startTime || task.flexible));

  const timeline: ScheduledTask[] = [];
  const unscheduled = new Set(flexible.map((task) => task.id));

  let cursor = startDay;
  let minutesSinceBreak = 0;
  let focusMinutes = 0;
  let restMinutes = 0;

  const consumeFlexible = (gapEnd: number) => {
    while (cursor < gapEnd && flexible.length > 0) {
      const nextCandidate = flexible.find((task) => unscheduled.has(task.id));
      if (!nextCandidate) break;

      const remainingGap = gapEnd - cursor;
      const fitsInGap = nextCandidate.duration <= remainingGap;

      if (!fitsInGap) {
        // Try next candidate that fits
        const fittingTask = flexible.find(
          (task) => unscheduled.has(task.id) && task.duration <= remainingGap,
        );
        if (!fittingTask) break;
        scheduleTask(fittingTask);
      } else {
        scheduleTask(nextCandidate);
      }
    }
  };

  const scheduleTask = (task: Task) => {
    const scheduled: ScheduledTask = {
      ...task,
      start: cursor,
      end: cursor + task.duration,
    };

    timeline.push(scheduled);
    cursor += task.duration;
    minutesSinceBreak += task.duration;
    if (task.category === "regeneracja") {
      restMinutes += task.duration;
    } else {
      focusMinutes += task.duration;
    }

    unscheduled.delete(task.id);
  };

  const insertBreakIfNeeded = () => {
    if (settings.breakEvery <= 0 || settings.breakDuration <= 0) return;
    if (minutesSinceBreak < settings.breakEvery) return;
    if (cursor + settings.breakDuration > endDay) return;

    const breakBlock = createBreak("auto", cursor, settings.breakDuration);
    timeline.push(breakBlock);
    cursor += settings.breakDuration;
    minutesSinceBreak = 0;
    restMinutes += breakBlock.duration;
  };

  for (const current of anchoredWithinDay) {
    if (cursor + settings.breakDuration <= current.start) {
      insertBreakIfNeeded();
    }

    if (cursor < current.start) {
      consumeFlexible(current.start);
    }

    const overlap = timeline.at(-1);
    if (overlap && overlap.end > current.start) {
      // Shift cursor to avoid collision
      cursor = overlap.end;
    }

    const anchoredTask: ScheduledTask = {
      ...current,
      autoInserted: false,
    };

    timeline.push(anchoredTask);
    cursor = anchoredTask.end;
    minutesSinceBreak += anchoredTask.duration;
    if (anchoredTask.category === "regeneracja") {
      restMinutes += anchoredTask.duration;
    } else {
      focusMinutes += anchoredTask.duration;
    }
    insertBreakIfNeeded();
  }

  if (cursor < endDay) {
    consumeFlexible(endDay);
  }

  // Add remaining break if there is still time
  insertBreakIfNeeded();

  const remainingFlexible = flexible.filter((task) => unscheduled.has(task.id));
  const freeMinutes = Math.max(endDay - cursor, 0);

  const suggestions = buildSuggestions({
    tasks,
    timeline,
    settings,
    remainingFlexible,
    freeMinutes,
    dayWindow,
  });

  return {
    timeline: timeline.sort((a, b) => a.start - b.start),
    unscheduled: remainingFlexible,
    suggestions,
    focusMinutes,
    restMinutes,
    freeMinutes,
  };
}

type SuggestionParams = {
  tasks: Task[];
  timeline: ScheduledTask[];
  settings: DaySettings;
  remainingFlexible: Task[];
  freeMinutes: number;
  dayWindow: number;
};

const buildSuggestions = ({
  tasks,
  timeline,
  settings,
  remainingFlexible,
  freeMinutes,
  dayWindow,
}: SuggestionParams) => {
  const suggestions: string[] = [];

  const totalPlanned = timeline.reduce((sum, task) => sum + task.duration, 0);
  const totalHighPriority = tasks.filter((task) => task.priority === "wysoki").length;
  const highPriorityCompleted = timeline.filter(
    (task) => task.priority === "wysoki" && !task.autoInserted,
  ).length;

  if (remainingFlexible.length > 0) {
    suggestions.push(
      `Brakuje czasu na ${remainingFlexible.length} zad. — rozważ skrócenie ich lub przesunięcie na inny dzień.`,
    );
  }

  if (freeMinutes > settings.breakDuration) {
    suggestions.push(
      `Masz ${freeMinutes} min wolnego czasu. Wykorzystaj go na regenerację lub cele strategiczne.`,
    );
  }

  if (!timeline.some((task) => task.category === "regeneracja")) {
    suggestions.push(
      "Dodaj blok regeneracji (spacer, ruch, oddychanie) — organizm potrzebuje chwili wytchnienia.",
    );
  }

  if (totalHighPriority > 0 && highPriorityCompleted / totalHighPriority < 0.6) {
    suggestions.push(
      "Zbyt dużo zadań o wysokim priorytecie pozostało nieprzypisanych — przemyśl priorytety.",
    );
  }

  if (settings.focusBlock > 0) {
    const longBlocks = timeline.filter(
      (task) => !task.autoInserted && task.duration >= settings.focusBlock,
    ).length;
    if (longBlocks === 0) {
      suggestions.push(
        `Brakuje bloków głębokiej pracy (≥${settings.focusBlock} min). Zaplanuj choć jeden, aby zrobić postęp w najważniejszym zadaniu.`,
      );
    }
  }

  if (dayWindow > 0 && totalPlanned > dayWindow) {
    suggestions.push(
      "Zaplanowano więcej niż mieści się w dniu — pamiętaj o realnych możliwościach i zostaw miejsce na nieprzewidziane sprawy.",
    );
  }

  if (suggestions.length === 0) {
    suggestions.push("Plan wygląda świetnie! Pamiętaj o świadomych przerwach i regularnym oddychaniu.");
  }

  return suggestions;
};
