import type { CalendarEvent } from "./types";

export function toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}

export function formatMonthYear(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Returns exactly 42 dates (6 rows x 7 columns) for a month calendar grid.
 * Pads start to the preceding Sunday and fills remaining cells from the next month.
 */
export function getCalendarDays(year: number, month: number): Date[] {
    const firstOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstOfMonth.getDay(); // 0 = Sunday

    // Go back to the preceding Sunday
    const gridStart = new Date(year, month, 1 - startDayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
        days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
    }

    return days;
}

/**
 * Groups events by their date key (YYYY-MM-DD in local time).
 */
export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
    const map = new Map<string, CalendarEvent[]>();

    for (const event of events) {
        const key = toDateKey(new Date(event.date));
        const existing = map.get(key);
        if (existing) {
            existing.push(event);
        } else {
            map.set(key, [event]);
        }
    }

    return map;
}
