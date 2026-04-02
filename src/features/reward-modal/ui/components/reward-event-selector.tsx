import { useEffect, useMemo, useState } from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DURATION_OPTIONS, EVENT_OPTIONS } from '@/features/reward-modal/config/options'
import {
  sanitizeNumericInput,
  toNumber,
} from '@/features/reward-modal/lib/validators'
import type {
  EventValueKey,
  FieldErrors,
  RewardEventId,
} from '@/features/reward-modal/model/types'
import { CurrencyInputField } from '@/features/reward-modal/ui/components/shared/currency-input-field'
import { InlineEditorActions } from '@/features/reward-modal/ui/components/shared/inline-editor-actions'
import { cn } from '@/lib/utils'
import { FormField } from '@/shared/ui/form-field'

interface RewardEventSelectorProps {
  selectedOptionId: RewardEventId | null
  committedValues: Record<EventValueKey, string>
  fieldErrors: FieldErrors
  open: boolean
  onOpenChange: (open: boolean, reason?: string) => void
  onSaveSelection: (
    eventId: RewardEventId,
    values: Record<EventValueKey, string>
  ) => void
}

const EMPTY_EVENT_VALUES: Record<EventValueKey, string> = {
  amount: '',
  postsX: '',
  periodY: '',
}

export function RewardEventSelector({
  selectedOptionId,
  committedValues,
  fieldErrors,
  open,
  onOpenChange,
  onSaveSelection,
}: RewardEventSelectorProps) {
  const [draftOptionId, setDraftOptionId] = useState<RewardEventId | null>(
    selectedOptionId
  )
  const [draftAmount, setDraftAmount] = useState(committedValues.amount)
  const [draftPostsX, setDraftPostsX] = useState(committedValues.postsX)
  const [draftPeriodY, setDraftPeriodY] = useState(committedValues.periodY)
  const [localErrors, setLocalErrors] = useState<
    Partial<Record<'amount' | 'postsX' | 'periodY', string>>
  >({})

  useEffect(() => {
    if (!open) {
      return
    }

    setDraftOptionId(selectedOptionId)
    setDraftAmount(committedValues.amount)
    setDraftPostsX(committedValues.postsX)
    setDraftPeriodY(committedValues.periodY)
    setLocalErrors({})
  }, [
    committedValues.amount,
    committedValues.periodY,
    committedValues.postsX,
    open,
    selectedOptionId,
  ])

  const triggerText = useMemo(() => {
    const activeOptionId = open ? draftOptionId : selectedOptionId

    if (!activeOptionId) {
      return 'Select an event'
    }

    if (activeOptionId === 'CROSS_SALES') {
      const amount = (open ? draftAmount : committedValues.amount).trim()
      return amount ? `Cross $${amount} in sales` : 'Cross $X in sales'
    }

    if (activeOptionId === 'POSTS_PER_PERIOD') {
      const postsX = (open ? draftPostsX : committedValues.postsX).trim()
      const periodY = (open ? draftPeriodY : committedValues.periodY).trim()
      return postsX && periodY
        ? `Posts ${postsX} times every ${periodY}`
        : 'Posts X times every Y period'
    }

    return 'Is Onboarded'
  }, [
    committedValues.amount,
    committedValues.periodY,
    committedValues.postsX,
    draftAmount,
    draftOptionId,
    draftPeriodY,
    draftPostsX,
    open,
    selectedOptionId,
  ])

  const activeOptionId = open ? draftOptionId : selectedOptionId
  const hasActiveSelection = Boolean(activeOptionId)

  const saveTooltipMessage = useMemo(() => {
    if (!draftOptionId) {
      return 'Select an event to continue.'
    }

    if (draftOptionId === 'IS_ONBOARDED') {
      return null
    }

    if (draftOptionId === 'CROSS_SALES') {
      if (!draftAmount.trim()) {
        return 'Enter the sales target amount to continue.'
      }

      const parsed = toNumber(draftAmount.trim())
      if (parsed === null || parsed <= 0) {
        return 'Sales amount must be greater than 0.'
      }

      return null
    }

    if (!draftPostsX.trim()) {
      return 'Enter posts count to continue.'
    }

    const parsedPosts = toNumber(draftPostsX.trim())
    if (parsedPosts === null || parsedPosts <= 0) {
      return 'Posts count must be greater than 0.'
    }

    if (!draftPeriodY.trim()) {
      return 'Select duration to continue.'
    }

    return null
  }, [draftAmount, draftOptionId, draftPeriodY, draftPostsX])

  const isSaveDisabled =
    draftOptionId !== null &&
    draftOptionId !== 'IS_ONBOARDED' &&
    Boolean(saveTooltipMessage)

  function resetDraftState() {
    setDraftOptionId(selectedOptionId)
    setDraftAmount(committedValues.amount)
    setDraftPostsX(committedValues.postsX)
    setDraftPeriodY(committedValues.periodY)
    setLocalErrors({})
  }

  function handleOptionClick(optionId: RewardEventId) {
    if (optionId === 'IS_ONBOARDED') {
      onSaveSelection('IS_ONBOARDED', { ...EMPTY_EVENT_VALUES })
      onOpenChange(false, 'close-press')
      return
    }

    setDraftOptionId(optionId)
    setLocalErrors({})
  }

  function handleCancel() {
    resetDraftState()
    onOpenChange(false, 'close-press')
  }

  function handleSave() {
    if (!draftOptionId || draftOptionId === 'IS_ONBOARDED' || isSaveDisabled) {
      return
    }

    if (draftOptionId === 'CROSS_SALES') {
      const parsed = toNumber(draftAmount.trim())
      if (parsed === null || parsed <= 0) {
        setLocalErrors({ amount: 'Sales amount must be greater than 0.' })
        return
      }

      onSaveSelection('CROSS_SALES', {
        ...EMPTY_EVENT_VALUES,
        amount: draftAmount.trim(),
      })
      onOpenChange(false, 'close-press')
      return
    }

    const parsedPosts = toNumber(draftPostsX.trim())
    if (parsedPosts === null || parsedPosts <= 0) {
      setLocalErrors((previous) => ({
        ...previous,
        postsX: 'Posts count must be greater than 0.',
      }))
      return
    }

    if (!draftPeriodY.trim()) {
      setLocalErrors((previous) => ({
        ...previous,
        periodY: 'Duration is required.',
      }))
      return
    }

    onSaveSelection('POSTS_PER_PERIOD', {
      ...EMPTY_EVENT_VALUES,
      postsX: draftPostsX.trim(),
      periodY: draftPeriodY.trim(),
    })
    onOpenChange(false, 'close-press')
  }

  return (
    <FormField label="Reward event" required error={fieldErrors.eventId}>
      <Popover
        open={open}
        onOpenChange={(nextOpen, eventDetails) => {
          const reason = eventDetails.reason

          if (!nextOpen && reason === 'outside-press') {
            resetDraftState()
          }

          onOpenChange(nextOpen, reason)
        }}
      >
        <PopoverTrigger
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border px-2.5 text-left text-base font-normal leading-[140%] text-text-primary transition-colors duration-100 ease-out focus-visible:border-action-primary focus-visible:ring-action-primary/25',
            fieldErrors.eventId
              ? 'border-red-500'
              : open
                ? 'border-action-primary'
                : 'border-border-dropdown'
          )}
        >
          <span
            className={cn(
              'truncate',
              hasActiveSelection ? 'text-text-primary' : 'text-text-placeholder'
            )}
          >
            {triggerText}
          </span>
          <ChevronDownIcon className="size-4 text-neutral-500" />
        </PopoverTrigger>

        <PopoverContent className="!w-[--anchor-width] !gap-1 !rounded-[4px] !p-1 data-open:zoom-in-100 data-closed:zoom-out-100 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 duration-150 ease-out">
          <div className="max-h-52 space-y-0.5 overflow-y-auto">
            {EVENT_OPTIONS.map((option) => {
              const isSelected = option.id === draftOptionId

              return (
                <div key={option.id} className="space-y-1">
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between rounded-[4px] px-2 py-1.5 text-left text-sm transition',
                      isSelected
                        ? 'bg-background-tertiary text-action-primary'
                        : 'text-text-primary hover:bg-neutral-100'
                    )}
                    onClick={() => {
                      handleOptionClick(option.id)
                    }}
                  >
                    <span>{option.label}</span>
                    {isSelected ? <CheckIcon className="size-4" /> : null}
                  </button>

                  {isSelected && option.id === 'CROSS_SALES' ? (
                    <div className="space-y-1 px-1">
                      <CurrencyInputField
                        value={draftAmount}
                        placeholder="eg: 100"
                        error={localErrors.amount ?? fieldErrors.eventAmount}
                        onChange={(nextValue) => {
                          setDraftAmount(sanitizeNumericInput(nextValue))
                          setLocalErrors((previous) => ({
                            ...previous,
                            amount: undefined,
                          }))
                        }}
                      />
                    </div>
                  ) : null}

                  {isSelected && option.id === 'POSTS_PER_PERIOD' ? (
                    <div className="grid grid-cols-2 gap-2 px-1">
                      <div className="space-y-1">
                        <Input
                          value={draftPostsX}
                          onChange={(event) => {
                            setDraftPostsX(sanitizeNumericInput(event.target.value))
                            setLocalErrors((previous) => ({
                              ...previous,
                              postsX: undefined,
                            }))
                          }}
                          placeholder="eg: 4"
                          className="h-10 rounded-lg border-border-dropdown text-base font-normal leading-[140%] focus-visible:border-action-primary focus-visible:ring-action-primary/25"
                        />
                        {(localErrors.postsX ?? fieldErrors.postsX) ? (
                          <p className="text-xs font-medium text-red-600">
                            {localErrors.postsX ?? fieldErrors.postsX}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <Select
                          value={draftPeriodY || null}
                          onValueChange={(nextValue) => {
                            setDraftPeriodY(String(nextValue ?? ''))
                            setLocalErrors((previous) => ({
                              ...previous,
                              periodY: undefined,
                            }))
                          }}
                        >
                          <SelectTrigger className="h-10 w-full rounded-lg border-border-dropdown text-base font-normal leading-[140%] text-text-primary data-placeholder:text-text-placeholder transition-colors duration-100 ease-out focus-visible:border-action-primary focus-visible:ring-action-primary/25">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            className="!rounded-[4px] !p-1"
                            alignItemWithTrigger={false}
                          >
                            {DURATION_OPTIONS.map((duration) => (
                              <SelectItem key={duration} value={duration}>
                                {duration}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {(localErrors.periodY ?? fieldErrors.periodY) ? (
                          <p className="text-xs font-medium text-red-600">
                            {localErrors.periodY ?? fieldErrors.periodY}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          {draftOptionId && draftOptionId !== 'IS_ONBOARDED' ? (
            <div className="pt-2">
              <InlineEditorActions
                onCancel={handleCancel}
                onSave={handleSave}
                isSaveDisabled={isSaveDisabled}
                saveTooltipMessage={saveTooltipMessage}
              />
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </FormField>
  )
}
