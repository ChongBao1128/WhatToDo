import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns'
import type { EventType } from './Calendar'

type CalendarListProps = {
  currentDate: Date
  events: Record<string, EventType[]>
  onAddEvent: (dateStr: string) => void
  onBadgeClick: (event: EventType) => void
}

export default function CalendarList({
  currentDate,
  events,
  onAddEvent,
  onBadgeClick,
}: CalendarListProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const timelineEntries = days
    .map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      return { date: dayStr, events: events[dayStr] || [] }
    })
    .filter((entry) => entry.events.length > 0)

  return (
    <div className="space-y-6">
      {timelineEntries.length > 0 ? (
        timelineEntries.reverse().map((entry) => (
          <div key={entry.date}>
            <div className="mb-2 text-sm font-semibold">
              {format(new Date(entry.date), 'EEEE, MMMM d')}
            </div>
            <div className="space-y-3">
              {entry.events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center p-3 border rounded"
                >
                  <Badge
                    onClick={(e) => {
                      e.stopPropagation()
                      onBadgeClick(event)
                    }}
                    className="cursor-pointer mr-3"
                  >
                    {event.category}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">
                      {event.description}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => onAddEvent(entry.date)}>
                    +
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          No events for this month.
        </div>
      )}
    </div>
  )
}
