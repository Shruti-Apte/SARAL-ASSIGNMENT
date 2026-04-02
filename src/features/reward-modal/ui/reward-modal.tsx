import { useEffect, useMemo, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { validateRewardForm } from '@/features/reward-modal/config/validation'
import {
  clearRewardSelection,
  createReward,
  closeModal,
  setEndDate,
  setEventSelection,
  setRewardSelection,
  setTimeBound,
} from '@/features/reward-modal/model/reward-slice'
import {
  selectCanCreateReward,
  selectIsModalOpen,
  selectRewardFieldErrors,
  selectRewardForm,
  selectRewardSubmitError,
  selectRewardSubmitStatus,
} from '@/features/reward-modal/model/selectors'
import type {
  EventValueKey,
  RewardEventId,
  RewardTypeId,
  RewardValueKey,
} from '@/features/reward-modal/model/types'
import { RewardEventSelector } from '@/features/reward-modal/ui/components/reward-event-selector'
import { RewardModalActions } from '@/features/reward-modal/ui/components/reward-modal-actions'
import { RewardTypeSelector } from '@/features/reward-modal/ui/components/reward-type-selector'
import { TimeBoundSection } from '@/features/reward-modal/ui/components/time-bound-section'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'

type ActiveDropdown = 'event' | 'reward' | null

export function RewardModal() {
  const dispatch = useAppDispatch()

  const isModalOpen = useAppSelector(selectIsModalOpen)
  const form = useAppSelector(selectRewardForm)
  const fieldErrors = useAppSelector(selectRewardFieldErrors)
  const submitStatus = useAppSelector(selectRewardSubmitStatus)
  const submitError = useAppSelector(selectRewardSubmitError)
  const canCreateReward = useAppSelector(selectCanCreateReward)

  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null)
  const [isTierModalOpen, setIsTierModalOpen] = useState(false)

  useEffect(() => {
    const isCommissionDisabledForEvent =
      form.eventId === 'POSTS_PER_PERIOD' || form.eventId === 'IS_ONBOARDED'

    if (isCommissionDisabledForEvent && form.rewardId === 'UPGRADE_COMMISSION_TIER') {
      dispatch(clearRewardSelection())
    }
  }, [dispatch, form.eventId, form.rewardId])

  function handleDropdownOpenChange(
    dropdown: Exclude<ActiveDropdown, null>,
    open: boolean,
    reason?: string
  ) {
    setActiveDropdown((current) => {
      if (open) {
        return dropdown
      }

      if (reason === 'focus-out' || reason === 'none') {
        return current
      }

      return current === dropdown ? null : current
    })
  }

  function handleModalOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      dispatch(closeModal())
      setActiveDropdown(null)
      setIsTierModalOpen(false)
    }
  }

  function handleEventSave(
    eventId: RewardEventId,
    values: Record<EventValueKey, string>
  ) {
    dispatch(
      setEventSelection({
        eventId,
        values,
      })
    )

    setActiveDropdown('reward')
  }

  function handleRewardSave(
    rewardId: RewardTypeId,
    values: Record<RewardValueKey, string>
  ) {
    dispatch(
      setRewardSelection({
        rewardId,
        values,
      })
    )

    setActiveDropdown(null)
  }

  function handleCreateReward() {
    void dispatch(createReward())
  }

  const isSubmitting = submitStatus === 'submitting'
  const createRewardTooltipMessage = useMemo(() => {
    if (isSubmitting) {
      return 'Reward is being created.'
    }

    const errors = validateRewardForm(form)
    if (errors.eventAmount) {
      return 'Enter the sales target amount to continue.'
    }

    return Object.values(errors)[0] ?? ''
  }, [form, isSubmitting])

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'w-[calc(100vw-2rem)] max-w-[400px] max-h-[calc(100dvh-2rem)] overflow-y-auto gap-6 rounded-xl bg-background-primary p-6 shadow-modal ring-1 ring-border-dropdown transition-[opacity,transform] duration-200 ease-out',
          isTierModalOpen
            ? 'pointer-events-none opacity-0 scale-[0.98]'
            : 'opacity-100 scale-100'
        )}
      >
        <DialogHeader className="w-full max-w-[352px] flex-row items-start justify-between gap-4">
          <DialogTitle className="text-[20px] font-medium leading-[140%] text-text-primary">
            Create your reward system
          </DialogTitle>
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 rounded-md border border-transparent text-text-secondary transition-colors duration-200 hover:border-border-dropdown hover:bg-background-tertiary hover:text-text-primary"
              />
            }
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Configure reward event, reward type, and optional time limits.
        </DialogDescription>

        <div className="space-y-3">
          <RewardEventSelector
            selectedOptionId={form.eventId}
            committedValues={form.eventValues}
            open={activeDropdown === 'event'}
            fieldErrors={fieldErrors}
            onOpenChange={(open, reason) => {
              handleDropdownOpenChange('event', open, reason)
            }}
            onSaveSelection={handleEventSave}
          />

          <RewardTypeSelector
            selectedEventId={form.eventId}
            selectedOptionId={form.rewardId}
            committedValues={form.rewardValues}
            open={activeDropdown === 'reward'}
            fieldErrors={fieldErrors}
            onTierModalOpenChange={setIsTierModalOpen}
            onOpenChange={(open, reason) => {
              handleDropdownOpenChange('reward', open, reason)
            }}
            onSaveSelection={handleRewardSave}
          />

          <TimeBoundSection
            isTimeBound={form.isTimeBound}
            endDate={form.endDate}
            error={fieldErrors.endDate}
            onToggle={(checked) => {
              dispatch(setTimeBound(checked))
            }}
            onDateChange={(date) => {
              dispatch(setEndDate(date))
            }}
          />

          {submitError ? (
            <p className="text-xs font-medium text-red-600">{submitError}</p>
          ) : null}
        </div>

        <RewardModalActions
          canCreateReward={canCreateReward}
          isSubmitting={isSubmitting}
          tooltipMessage={createRewardTooltipMessage}
          onSubmit={handleCreateReward}
          onCancel={() => {
            dispatch(closeModal())
            setActiveDropdown(null)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
