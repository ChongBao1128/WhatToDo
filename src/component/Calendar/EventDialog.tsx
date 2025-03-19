import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EventType } from './Calendar'

type EventDialogProps = {
  isOpen: boolean
  event: EventType | null
  onClose: () => void
  onSave: () => void
  onDelete?: () => void
  setEvent: React.Dispatch<React.SetStateAction<EventType | null>>
}

export default function EventDialog({
  isOpen,
  event,
  onClose,
  onSave,
  onDelete,
  setEvent,
}: EventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event?.id ? 'Event Details' : 'Add Event'}</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={event?.title || ''}
              onChange={(e) =>
                setEvent((prev) =>
                  prev ? { ...prev, title: e.target.value } : null,
                )
              }
              className="mt-1 block w-full border rounded p-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={event?.description || ''}
              onChange={(e) =>
                setEvent((prev) =>
                  prev ? { ...prev, description: e.target.value } : null,
                )
              }
              className="mt-1 block w-full border rounded p-1 max-h-40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={event?.date || ''}
              onChange={(e) =>
                setEvent((prev) =>
                  prev ? { ...prev, date: e.target.value } : null,
                )
              }
              className="mt-1 block w-full border rounded p-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              value={event?.category || ''}
              onChange={(e) =>
                setEvent((prev) =>
                  prev ? { ...prev, category: e.target.value } : null,
                )
              }
              className="mt-1 block w-full border rounded p-1"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 pe-4">
          {event && (event.action === 'add' || event.id === '') ? (
            <Button className="w-24 cursor-pointer" onClick={onSave}>
              Add Event
            </Button>
          ) : (
            <>
              <Button className="w-24 cursor-pointer" onClick={onSave}>
                Save
              </Button>
              <Button
                variant="destructive"
                className="w-24 cursor-pointer"
                onClick={onDelete}
              >
                Remove
              </Button>
            </>
          )}

          <Button
            className="w-24 bg-neutral-400  cursor-pointer"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
