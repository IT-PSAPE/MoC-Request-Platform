import type { ReactNode } from "react";

export type CalendarEvent = {
    id: string;
    date: string;
    label: string;
    color?: BadgeColor;
    data?: unknown;
};

export type CalendarDayInfo = {
    date: Date;
    events: CalendarEvent[];
};

export type CalendarProps = {
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
    onDayClick?: (day: CalendarDayInfo) => void;
    renderEvent?: (event: CalendarEvent) => ReactNode;
    initialMonth?: Date;
    maxVisibleEvents?: number;
    className?: string;
};

export type CalendarContextValue = {
    currentMonth: Date;
    goToPrevMonth: () => void;
    goToNextMonth: () => void;
    goToToday: () => void;
    events: CalendarEvent[];
    eventsByDate: Map<string, CalendarEvent[]>;
    onEventClick?: (event: CalendarEvent) => void;
    onDayClick?: (day: CalendarDayInfo) => void;
    renderEvent?: (event: CalendarEvent) => ReactNode;
    maxVisibleEvents: number;
};
