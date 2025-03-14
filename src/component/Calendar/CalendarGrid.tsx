import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { EventType } from "./Calendar";

type CalendarGridProps = {
  currentDate: Date;
  events: Record<string, EventType[]>;
  onAddEvent: (dateStr: string) => void;
  onBadgeClick: (event: EventType) => void;
};

export default function CalendarGrid({ currentDate, events, onAddEvent, onBadgeClick }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        return (
          <div key={dayStr} className="border p-2 relative h-28 overflow-y-auto">
            <div className="text-sm font-medium">{format(day, "d")}</div>
            <div className="mt-1 space-y-1">
              {(events[dayStr] || []).map((event) => (
                <Badge
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBadgeClick(event);
                  }}
                  className="cursor-pointer z-10 relative w-full py-1"
                >
                  {event.title}
                </Badge>
              ))}
            </div>

            <div
              onClick={() => onAddEvent(dayStr)}
              className="absolute inset-0 z-0 opacity-0 hover:opacity-20 bg-gray-200 rounded cursor-pointer"
            ></div>
          </div>
        );
      })}
    </div>
  );
}
