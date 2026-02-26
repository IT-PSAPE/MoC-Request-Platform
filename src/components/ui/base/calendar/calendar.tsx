'use client';

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/shared/cn";
import { Icon, Text } from "@/components/ui/common";
import { Button, IconButton } from "@/components/ui/common/button";
import { Sheet } from "@/components/ui/base/sheet";
import type { CalendarContextValue, CalendarDayInfo, CalendarEvent, CalendarProps } from "./types";
import {
    formatMonthYear,
    getCalendarDays,
    groupEventsByDate,
    isToday,
    toDateKey,
} from "./calendar-utils";

const DAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

const CalendarContext = createContext<CalendarContextValue | null>(null);

function useCalendarContext() {
    const ctx = useContext(CalendarContext);
    if (!ctx) throw new Error("Calendar components must be used within Calendar.Root");
    return ctx;
}

const chipColorMap: Record<BadgeColor, string> = {
    gray: "bg-utility-gray-100 text-utility-gray-600",
    green: "bg-utility-green-100 text-utility-green-600",
    yellow: "bg-utility-yellow-100 text-utility-yellow-600",
    red: "bg-utility-red-100 text-utility-red-600",
    blue: "bg-utility-blue-100 text-utility-blue-600",
    purple: "bg-utility-purple-100 text-utility-purple-600",
    pink: "bg-utility-pink-100 text-utility-pink-600",
    teal: "bg-utility-teal-100 text-utility-teal-600",
    orange: "bg-utility-orange-100 text-utility-orange-600",
    slate: "bg-utility-slate-100 text-utility-slate-600",
};

// --- Root ---

function Root({ events, onEventClick, onDayClick, renderEvent, initialMonth, maxVisibleEvents = 3, className, children }: CalendarProps & { children: ReactNode }) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (initialMonth) return new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1);
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

    const goToPrevMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const goToToday = () => {
        const now = new Date();
        setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    };

    const value: CalendarContextValue = {
        currentMonth,
        goToPrevMonth,
        goToNextMonth,
        goToToday,
        events,
        eventsByDate,
        onEventClick,
        onDayClick,
        renderEvent,
        maxVisibleEvents,
    };

    return (
        <CalendarContext.Provider value={value}>
            <div className={cn("w-full", className)}>
                {children}
            </div>
        </CalendarContext.Provider>
    );
}

// --- Header ---

function Header({ className }: { className?: string }) {
    const { currentMonth, goToPrevMonth, goToNextMonth, goToToday } = useCalendarContext();

    return (
        <div className={cn("flex items-center justify-between pb-4", className)}>
            <Text as="h3" style="label-lg">{formatMonthYear(currentMonth)}</Text>
            <div className="flex items-center gap-1">
                <Button variant="secondary" size="sm" onClick={goToToday}>
                    Today
                </Button>
                <IconButton variant="ghost" size="sm" onClick={goToPrevMonth} aria-label="Previous month">
                    <Icon.chevron_up size={18} className="-rotate-90" />
                </IconButton>
                <IconButton variant="ghost" size="sm" onClick={goToNextMonth} aria-label="Next month">
                    <Icon.chevron_up size={18} className="rotate-90" />
                </IconButton>
            </div>
        </div>
    );
}

// --- Event Chip ---

function EventChip({ event, onEventClick }: { event: CalendarEvent; onEventClick?: (event: CalendarEvent) => void }) {
    const color = event.color || "gray";

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(event);
            }}
            className={cn(
                "w-full text-left truncate rounded px-1.5 py-0.5 paragraph-xs cursor-pointer transition-opacity hover:opacity-80",
                chipColorMap[color],
                // Mobile: show as colored dot (tapping the cell opens the day sheet instead)
                "mobile:px-0 mobile:py-0 mobile:w-2 mobile:h-2 mobile:rounded-full mobile:min-w-2 mobile:pointer-events-none",
            )}
        >
            <span className="mobile:hidden">{event.label}</span>
        </button>
    );
}

// --- Day Cell ---

function DayCell({ date, dayEvents, isCurrentMonth }: { date: Date; dayEvents: CalendarEvent[]; isCurrentMonth: boolean }) {
    const { onEventClick, onDayClick, renderEvent, maxVisibleEvents } = useCalendarContext();
    const today = isToday(date);
    const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
    const overflowCount = dayEvents.length - maxVisibleEvents;

    const handleCellClick = () => {
        if (dayEvents.length > 0 && onDayClick) {
            onDayClick({ date, events: dayEvents });
        }
    };

    return (
        <div
            onClick={handleCellClick}
            className={cn(
                "min-h-[120px] mobile:min-h-[48px] p-1.5 mobile:p-1 border-b border-r border-secondary",
                !isCurrentMonth && "bg-quaternary/30",
                dayEvents.length > 0 && onDayClick && "mobile:cursor-pointer mobile:active:bg-quaternary/50",
            )}
        >
            {/* Day number */}
            <div className="flex items-start mb-1">
                <span
                    className={cn(
                        "paragraph-xs inline-flex items-center justify-center w-6 h-6 rounded-full",
                        today && "bg-foreground-brand-primary text-white label-xs",
                        !today && isCurrentMonth && "text-secondary",
                        !today && !isCurrentMonth && "text-quaternary",
                    )}
                >
                    {date.getDate()}
                </span>
            </div>

            {/* Events - stacked vertically on desktop, dots on mobile */}
            <div className="flex flex-col gap-0.5 mobile:flex-row mobile:flex-wrap mobile:gap-1">
                {visibleEvents.map((event) => (
                    renderEvent ? (
                        <div key={event.id} onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }} className="cursor-pointer">
                            {renderEvent(event)}
                        </div>
                    ) : (
                        <EventChip key={event.id} event={event} onEventClick={onEventClick} />
                    )
                ))}
                {overflowCount > 0 && (
                    <span className="paragraph-xs text-quaternary px-1.5 mobile:hidden">
                        +{overflowCount} more
                    </span>
                )}
            </div>
        </div>
    );
}

// --- Day Events Sheet (mobile bottom sheet for viewing a day's events) ---

function DayEventsSheet({ day, open, onOpenChange, onEventClick, renderEvent }: {
    day: CalendarDayInfo | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEventClick?: (event: CalendarEvent) => void;
    renderEvent?: (event: CalendarEvent) => ReactNode;
}) {
    if (!day) return null;

    const dateLabel = day.date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <Sheet.Root open={open} onOpenChange={onOpenChange}>
            <Sheet.Content className="mobile:min-h-[50vh] mobile:max-h-[95vh]">
                <Sheet.Header>
                    <Text style="label-md">{dateLabel}</Text>
                    <Text style="paragraph-xs" className="text-quaternary">
                        {day.events.length} request{day.events.length !== 1 ? "s" : ""}
                    </Text>
                </Sheet.Header>
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                    {day.events.map((event) => (
                        renderEvent ? (
                            <div
                                key={event.id}
                                onClick={() => {
                                    onOpenChange(false);
                                    onEventClick?.(event);
                                }}
                                className="cursor-pointer"
                            >
                                {renderEvent(event)}
                            </div>
                        ) : (
                            <button
                                key={event.id}
                                type="button"
                                onClick={() => {
                                    onOpenChange(false);
                                    onEventClick?.(event);
                                }}
                                className={cn(
                                    "w-full text-left rounded-lg px-3 py-2.5 paragraph-sm cursor-pointer transition-colors hover:bg-quaternary/50 active:bg-quaternary/50",
                                    chipColorMap[event.color || "gray"],
                                )}
                            >
                                {event.label}
                            </button>
                        )
                    ))}
                </div>
            </Sheet.Content>
        </Sheet.Root>
    );
}

// --- Grid ---

function Grid({ className }: { className?: string }) {
    const { currentMonth, eventsByDate } = useCalendarContext();

    const days = useMemo(
        () => getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()),
        [currentMonth],
    );

    return (
        <div className={cn("border-t border-l border-secondary rounded-lg overflow-hidden", className)}>
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7">
                {DAYS_FULL.map((day, i) => (
                    <div
                        key={day + i}
                        className="text-center paragraph-xs text-quaternary py-2 border-b border-r border-secondary bg-secondary/50"
                    >
                        <span className="mobile:hidden">{day}</span>
                        <span className="hidden mobile:inline">{DAYS_SHORT[i]}</span>
                    </div>
                ))}
            </div>

            {/* Day cells - 6 rows of 7 */}
            <div className="grid grid-cols-7">
                {days.map((date) => {
                    const key = toDateKey(date);
                    const dayEvents = eventsByDate.get(key) || [];
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

                    return (
                        <DayCell
                            key={key}
                            date={date}
                            dayEvents={dayEvents}
                            isCurrentMonth={isCurrentMonth}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// --- Exports ---

export const Calendar = {
    Root,
    Header,
    Grid,
    DayEventsSheet,
    useContext: useCalendarContext,
};
