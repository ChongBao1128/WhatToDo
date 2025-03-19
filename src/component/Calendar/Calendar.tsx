'use client'

import { addTodo, deleteTodo, editTodo } from '@/actions/todos/actions'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { Todo } from '@/lib/interface'
import { addMonths, format, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CalendarGrid from './CalendarGrid'
import CalendarList from './CalendarList'
import EventDialog from './EventDialog'

// For rendering we use a simplified EventType (used by CalendarGrid and CalendarList)
export type EventType = {
  id: string
  title: string
  description: string
  date: string // formatted as "yyyy-MM-dd"
  category: string
  action?: 'add' | 'edit'
}

export default function Calendar() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentDate, setCurrentDate] = useState(new Date())
  // Events are now fetched from the database rather than being mocked.
  const [events, setEvents] = useState<Record<string, EventType[]>>({})
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)

  // Fetch events from the database when the component mounts.
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/todos')
        if (res.ok) {
          const todos: Todo[] = await res.json()
          // Group todos by date (formatted as "yyyy-MM-dd") and map to EventType
          const grouped: Record<string, EventType[]> = {}
          todos.forEach((todo) => {
            const dateStr = format(new Date(todo.date), 'yyyy-MM-dd')
            if (!grouped[dateStr]) grouped[dateStr] = []
            grouped[dateStr].push({
              id: todo.id.toString(),
              title: todo.task,
              description: todo.description,
              date: dateStr,
              category: todo.category,
            })
          })
          setEvents(grouped)
        } else {
          console.error('Failed to fetch todos')
        }
      } catch (error) {
        console.error('Error fetching todos', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Handlers for month navigation
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  // Open dialog to add a new event
  const handleAddEvent = (dateStr: string) => {
    setSelectedEvent({
      id: uuidv4(), // 🔥 Ensure UUID is generated properly
      title: '',
      description: '',
      date: dateStr,
      category: '',
      action: 'add',
    })
    setIsDialogOpen(true)
  }

  // Open dialog to edit an existing event
  const handleBadgeClick = (event: EventType) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  // Convert a local EventType into a full Todo object.
  // (In a real app, user_id would come from the session.)
  const toTodo = (e: EventType): Todo => ({
    id: e.id || uuidv4(), // ✅ Keep `id` as a valid UUID
    user_id: 'dummy-user-id',
    task: e.title,
    description: e.description,
    date: new Date(e.date).toISOString(),
    is_complete: false,
    category: e.category,
  })

  // Save handler for both adding and editing events.
  async function handleSave() {
    if (!selectedEvent) return
    if (selectedEvent.action === 'add' || selectedEvent.id === '') {
      // Build FormData for adding a new todo.
      const formData = new FormData()
      formData.append('task', selectedEvent.title)
      formData.append('description', selectedEvent.description)
      formData.append('date', selectedEvent.date)
      formData.append('category', selectedEvent.category)
      try {
        await addTodo(formData)
        // Update local state with the new event.
        setEvents((prev) => {
          const dayEvents = prev[selectedEvent.date] || []
          const newEvent: EventType = {
            id: uuidv4(), // Generate a UUID instead of Date.now()
            title: selectedEvent.title,
            description: selectedEvent.description,
            date: selectedEvent.date,
            category: selectedEvent.category,
          }
          return { ...prev, [selectedEvent.date]: [...dayEvents, newEvent] }
        })
        setIsDialogOpen(false)
        setSelectedEvent(null)
      } catch (error) {
        console.error(error)
      }
    } else {
      // Editing an existing event.
      const updatedTodo = toTodo(selectedEvent)
      try {
        await editTodo(updatedTodo)
        // Update local state by replacing the event.
        setEvents((prev) => {
          const dayEvents = prev[selectedEvent.date] || []
          const updatedEvents = dayEvents.map((e) =>
            e.id === selectedEvent.id
              ? { ...selectedEvent, action: undefined }
              : e,
          )
          return { ...prev, [selectedEvent.date]: updatedEvents }
        })
        setIsDialogOpen(false)
        setSelectedEvent(null)
      } catch (error) {
        console.error(error)
      }
    }
  }

  // Delete handler for removing an event.
  async function handleDelete() {
    if (!selectedEvent) return
    try {
      await deleteTodo(selectedEvent.id)

      setEvents((prev) => {
        const dayEvents = prev[selectedEvent.date] || []
        return {
          ...prev,
          [selectedEvent.date]: dayEvents.filter(
            (e) => e.id !== selectedEvent.id,
          ),
        }
      })
      setIsDialogOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error(error)
    }
  }

  // Show a simple loading message while data is being fetched.
  if (loading) return <div className="p-4">Loading events...</div>

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <Switch
            checked={viewMode === 'grid'}
            className="cursor-pointer"
            onCheckedChange={(checked) =>
              setViewMode(checked ? 'grid' : 'list')
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={handlePrevMonth}
          >
            <ChevronLeft />
          </Button>

          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={handleNextMonth}
          >
            <ChevronRight />
          </Button>

          <Button
            className="cursor-pointer"
            onClick={() => handleAddEvent(format(new Date(), 'yyyy-MM-dd'))}
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* Render either grid or list view */}
      {viewMode === 'grid' ? (
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onAddEvent={handleAddEvent}
          onBadgeClick={handleBadgeClick}
        />
      ) : (
        <CalendarList
          currentDate={currentDate}
          events={events}
          onAddEvent={handleAddEvent}
          onBadgeClick={handleBadgeClick}
        />
      )}

      {/* Dialog for adding/editing events */}
      <EventDialog
        isOpen={isDialogOpen}
        event={selectedEvent}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        setEvent={setSelectedEvent}
      />
    </div>
  )
}
