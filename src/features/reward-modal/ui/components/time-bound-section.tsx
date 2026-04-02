import { useEffect, useMemo, useState } from 'react'
import { addDays, format, startOfDay } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface TimeBoundSectionProps {
  isTimeBound: boolean
  endDate: string | null
  error?: string
  onToggle: (checked: boolean) => void
  onDateChange: (date: string | null) => void
}

export function TimeBoundSection({
  isTimeBound,
  endDate,
  error,
  onToggle,
  onDateChange,
}: TimeBoundSectionProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const minSelectableDate = useMemo(
    () => addDays(startOfDay(new Date()), 1),
    []
  )

  const parsedDate = endDate ? startOfDay(new Date(endDate)) : undefined
  const selectedDate =
    parsedDate && parsedDate >= minSelectableDate ? parsedDate : undefined

  useEffect(() => {
    if (endDate && !selectedDate) {
      onDateChange(null)
    }
  }, [endDate, onDateChange, selectedDate])

  function handleCheckedChange(nextValue: boolean) {
    onToggle(nextValue)

    if (!nextValue) {
      setIsCalendarOpen(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium leading-[140%] text-text-primary">
            Make the reward time bound
          </p>
          <p className="text-xs leading-[150%] text-text-secondary">
            Choose an end date to stop this reward automatically.
          </p>
        </div>
        <Switch
          checked={isTimeBound}
          onCheckedChange={handleCheckedChange}
        />
      </div>

      {isTimeBound ? (
        <div className="space-y-1">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
              className={cn(
                'flex h-10 w-full items-center rounded-lg border px-2.5 text-left text-base font-normal leading-[140%] text-text-primary transition-colors duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary/20',
                error ? 'border-red-500' : 'border-border-dropdown'
              )}
            >
              <CalendarIcon className="mr-2 size-4 text-neutral-500" />
              <span
                className={cn(
                  selectedDate ? 'text-text-primary' : 'text-text-placeholder'
                )}
              >
                {selectedDate ? format(selectedDate, 'dd MMM, yyyy') : 'Select end date'}
              </span>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto rounded-xl border border-neutral-200 bg-background-primary p-2 shadow-xl"
              align="start"
              side="bottom"
              sideOffset={8}
            >
              <Calendar
                mode="single"
                fixedWeeks
                showOutsideDays
                selected={selectedDate}
                disabled={{ before: minSelectableDate }}
                buttonVariant="outline"
                className="p-1 [--cell-size:2.35rem]"
                classNames={{
                  month_caption:
                    'mb-2 flex h-9 w-full items-center justify-center px-14',
                  caption_label: 'text-xl font-semibold text-neutral-800',
                  nav: 'absolute inset-x-0 top-0 flex w-full items-center justify-between px-2',
                  button_previous:
                    'h-9 w-9 rounded-lg border border-neutral-200 bg-white p-0 text-neutral-700 shadow-none hover:bg-neutral-50',
                  button_next:
                    'h-9 w-9 rounded-lg border border-neutral-200 bg-white p-0 text-neutral-700 shadow-none hover:bg-neutral-50',
                  weekdays: 'mt-2 flex',
                  weekday:
                    'flex-1 text-center text-sm font-medium text-neutral-500',
                  day: 'relative flex h-10 w-10 items-center justify-center p-0',
                  outside: 'text-neutral-300',
                  disabled: 'text-neutral-300 opacity-100',
                  today: 'text-neutral-800',
                }}
                onSelect={(date) => {
                  if (!date) {
                    onDateChange(null)
                    return
                  }

                  const normalizedDate = startOfDay(date)
                  if (normalizedDate < minSelectableDate) {
                    return
                  }

                  onDateChange(normalizedDate.toISOString())
                  setIsCalendarOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
          {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
