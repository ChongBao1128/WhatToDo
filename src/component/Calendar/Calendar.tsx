'use client';

import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import CalendarGrid from "./CalendarGrid";
import CalendarList from "./CalendarList";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type EventType = {
  id: string;
  title: string;
  description: string;
  date: string; // "yyyy-MM-dd"
  category: string;
  action?: 'add' | 'edit'
};

export default function Calendar() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Record<string, EventType[]>>({
    [format(new Date(), "yyyy-MM-dd")]: [
      {
        id: "1",
        title: "Meeting",
        description: "Project discussion",
        date: format(new Date(), "yyyy-MM-dd"),
        category: "Work",
      },
      {
        id: "2",
        title: "Meeting2",
        description: "Project discussion",
        date: format(new Date(), "yyyy-MM-dd"),
        category: "Work",
      }
    ],
    "2025-03-11": [
      {
        id: "1",
        title: "Team Meeting",
        description: "Discuss project milestones",
        date: "2025-03-11",
        category: "Work",
      },
      {
        id: "2",
        title: "Coffee Break",
        description: "Catch up with colleagues",
        date: "2025-03-11",
        category: "Casual",
      },
    ],
    "2025-03-13": [
      {
        id: "4",
        title: "Doctor Appointment",
        description: "Regular checkup",
        date: "2025-03-13",
        category: "Health",
      },
      {
        id: "5",
        title: "Lunch with Friend",
        description: "Catch up with an old friend",
        date: "2025-03-13",
        category: "Social",
      },
      {
        id: "8",
        title: "Lunch with Friend",
        description: "Catch up with an old friend",
        date: "2025-03-13",
        category: "Social",
      },
    ],
    "2025-03-15": [
      {
        id: "6",
        title: "Code Review",
        description: "Review the latest PRs",
        date: "2025-03-15",
        category: "Work",
      },
    ],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleAddEvent = (dateStr: string) => {
    setSelectedEvent({ id: "", title: "", description: "", date: dateStr, category: "", action: "add" });
    setIsDialogOpen(true);
  };

  const handleBadgeClick = (event: EventType) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">{format(currentDate, "MMMM yyyy")}</div>

          <Switch
            checked={viewMode === "grid"}
            className="cursor-pointer"
            onCheckedChange={(checked) => setViewMode(checked ? "grid" : "list")}
          />

        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant='ghost' 
            className="cursor-pointer"
            onClick={handlePrevMonth}>
              <ChevronLeft />
          </Button>

          <Button 
            variant='ghost' 
            className="cursor-pointer"
            onClick={handleNextMonth}>
              <ChevronRight />
          </Button>

          <Button 
            className='cursor-pointer'
            onClick={() => handleAddEvent(format(new Date(), "yyyy-MM-dd"))}>
            Add Event
          </Button>
        </div>
      </div>

      {/* Conditionally render CalendarGrid or CalendarList */}
      {viewMode === "grid" ? (
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

      {/* Dialog for event details / add-edit form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.id ? "Event Details" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={selectedEvent?.title || ""}
                onChange={(e) =>
                  setSelectedEvent((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                className="mt-1 block w-full border rounded p-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={selectedEvent?.description || ""}
                
                onChange={(e) =>
                  setSelectedEvent((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="mt-1 block w-full border rounded p-1 max-h-40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                value={selectedEvent?.date || ""}
                onChange={(e) =>
                  setSelectedEvent((prev) =>
                    prev ? { ...prev, date: e.target.value } : null
                  )
                }
                className="mt-1 block w-full border rounded p-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                value={selectedEvent?.category || ""}
                onChange={(e) =>
                  setSelectedEvent((prev) =>
                    prev ? { ...prev, category: e.target.value } : null
                  )
                }
                className="mt-1 block w-full border rounded p-1"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pe-4">
            {selectedEvent?.id && selectedEvent.action !== "add" ? (
              <>
                <Button className="cursor-pointer w-24" onClick={() => {/* implement edit event logic */}}>Edit</Button>
                <Button variant="destructive" className="cursor-pointe w-24r" onClick={() => {/* implement remove event logic */}}>
                  Remove
                </Button>
              </>
            ): <Button className="cursor-pointer w-24" onClick={() => setIsDialogOpen(false)}>Add Event</Button>}
            
            <Button className="cursor-pointer bg-neutral-400 w-24" onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
