import { useEffect, useMemo, useState } from 'react'
import { CheckIcon, ChevronDownIcon, PencilIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  REWARD_OPTIONS,
} from '@/features/reward-modal/config/options'
import {
  sanitizeNumericInput,
  toNumber,
} from '@/features/reward-modal/lib/validators'
import type {
  FieldErrors,
  RewardEventId,
  RewardTypeId,
  RewardValueKey,
} from '@/features/reward-modal/model/types'
import { CommissionTierModal } from '@/features/reward-modal/ui/components/commission-tier-modal'
import { CurrencyInputField } from '@/features/reward-modal/ui/components/shared/currency-input-field'
import { InlineEditorActions } from '@/features/reward-modal/ui/components/shared/inline-editor-actions'
import { cn } from '@/lib/utils'
import { FormField } from '@/shared/ui/form-field'

interface RewardTypeSelectorProps {
  selectedEventId: RewardEventId | null
  selectedOptionId: RewardTypeId | null
  committedValues: Record<RewardValueKey, string>
  fieldErrors: FieldErrors
  open: boolean
  onTierModalOpenChange: (open: boolean) => void
  onOpenChange: (open: boolean, reason?: string) => void
  onSaveSelection: (
    rewardId: RewardTypeId,
    values: Record<RewardValueKey, string>
  ) => void
}

const EMPTY_REWARD_VALUES: Record<RewardValueKey, string> = {
  amount: '',
  tierName: '',
}

export function RewardTypeSelector({
  selectedEventId,
  selectedOptionId,
  committedValues,
  fieldErrors,
  open,
  onTierModalOpenChange,
  onOpenChange,
  onSaveSelection,
}: RewardTypeSelectorProps) {
  const [draftOptionId, setDraftOptionId] = useState<RewardTypeId | null>(
    selectedOptionId
  )
  const [draftAmount, setDraftAmount] = useState(committedValues.amount)
  const [draftTierName, setDraftTierName] = useState(committedValues.tierName)
  const [localAmountError, setLocalAmountError] = useState<string | null>(null)
  const [isTierModalOpen, setIsTierModalOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setDraftOptionId(selectedOptionId)
      setDraftAmount(committedValues.amount)
      setDraftTierName(committedValues.tierName)
      setLocalAmountError(null)
    }
  }, [committedValues.amount, committedValues.tierName, open, selectedOptionId])

  useEffect(() => {
    onTierModalOpenChange(isTierModalOpen)
  }, [isTierModalOpen, onTierModalOpenChange])

  const triggerText = useMemo(() => {
    const activeOptionId = open ? draftOptionId : selectedOptionId

    if (!activeOptionId) {
      return 'Select a reward'
    }

    if (activeOptionId === 'FLAT_BONUS') {
      const amount = (open ? draftAmount : committedValues.amount).trim()
      return amount
        ? `Flat $${amount} bonus`
        : 'Flat $X bonus'
    }

    const tierName = (open ? draftTierName : committedValues.tierName).trim()
    return tierName
      ? `Upgrade to {${tierName}}`
      : 'Upgrade Commission Tier'
  }, [
    committedValues.amount,
    committedValues.tierName,
    draftAmount,
    draftOptionId,
    draftTierName,
    open,
    selectedOptionId,
  ])

  const isCommissionDisabled =
    selectedEventId === 'POSTS_PER_PERIOD' || selectedEventId === 'IS_ONBOARDED'

  const amountTooltipMessage = useMemo(() => {
    const parsed = toNumber(draftAmount.trim())

    if (!draftAmount.trim()) {
      return 'Enter reward amount to continue.'
    }

    if (parsed === null || parsed <= 0) {
      return 'Reward amount must be greater than 0.'
    }

    return null
  }, [draftAmount])

  const isFlatSaveDisabled = Boolean(amountTooltipMessage)
  const triggerError = fieldErrors.rewardId ?? fieldErrors.rewardTier
  const amountError = localAmountError ?? fieldErrors.rewardAmount
  const activeOptionId = open ? draftOptionId : selectedOptionId
  const hasActiveSelection = Boolean(activeOptionId)

  function resetDraftState() {
    setDraftOptionId(selectedOptionId)
    setDraftAmount(committedValues.amount)
    setDraftTierName(committedValues.tierName)
    setLocalAmountError(null)
  }

  function handleOpenTierModal() {
    setDraftOptionId('UPGRADE_COMMISSION_TIER')
    setDraftTierName(committedValues.tierName)
    setIsTierModalOpen(true)
    onOpenChange(false, 'close-press')
  }

  function handleRewardOptionClick(optionId: RewardTypeId) {
    if (optionId === 'UPGRADE_COMMISSION_TIER' && isCommissionDisabled) {
      return
    }

    if (optionId === 'UPGRADE_COMMISSION_TIER') {
      handleOpenTierModal()
      return
    }

    setDraftOptionId('FLAT_BONUS')
    setLocalAmountError(null)
  }

  function handleFlatAmountSave() {
    const parsed = toNumber(draftAmount.trim())
    if (parsed === null || parsed <= 0) {
      setLocalAmountError('Reward amount must be greater than 0.')
      return
    }

    onSaveSelection('FLAT_BONUS', {
      ...EMPTY_REWARD_VALUES,
      amount: draftAmount.trim(),
    })
    onOpenChange(false, 'close-press')
  }

  function handleTierSave() {
    if (!draftTierName.trim()) {
      return
    }

    onSaveSelection('UPGRADE_COMMISSION_TIER', {
      ...EMPTY_REWARD_VALUES,
      tierName: draftTierName.trim(),
    })
    setIsTierModalOpen(false)
  }

  return (
    <>
      <FormField label="Reward with" required error={triggerError}>
        <Popover
          open={open}
          onOpenChange={(nextOpen, eventDetails) => {
            const reason = eventDetails.reason

            if (!nextOpen && reason !== 'focus-out' && reason !== 'none') {
              resetDraftState()
            }

            onOpenChange(nextOpen, reason)
          }}
        >
          <PopoverTrigger
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-lg border px-2.5 text-left text-base font-normal leading-[140%] text-text-primary transition-colors duration-100 ease-out focus-visible:border-action-primary focus-visible:ring-action-primary/25',
              triggerError
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
            <div className="space-y-0.5">
              {REWARD_OPTIONS.map((option) => {
                const isSelected = option.id === draftOptionId
                const isUpgradeOption = option.id === 'UPGRADE_COMMISSION_TIER'
                const isOptionDisabled = isUpgradeOption && isCommissionDisabled
                const hasSavedTier =
                  isUpgradeOption &&
                  selectedOptionId === 'UPGRADE_COMMISSION_TIER' &&
                  Boolean(committedValues.tierName.trim())

                const optionText = hasSavedTier
                  ? `Upgrade to {${committedValues.tierName.trim()}}`
                  : option.label

                return (
                  <div key={option.id} className="space-y-1">
                    <button
                      type="button"
                      disabled={isOptionDisabled}
                      className={cn(
                        'group flex w-full items-center justify-between rounded-[4px] px-2 py-1.5 text-left text-sm transition',
                        isOptionDisabled
                          ? 'cursor-not-allowed text-neutral-300 hover:bg-transparent'
                          : isSelected
                          ? 'bg-background-tertiary text-action-primary'
                          : 'text-text-primary hover:bg-neutral-100'
                      )}
                      onClick={() => {
                        handleRewardOptionClick(option.id)
                      }}
                    >
                      <span className="truncate">{optionText}</span>
                      <span className="flex items-center gap-2">
                        {isSelected ? (
                          <span className="relative size-4">
                            <CheckIcon
                              className={cn(
                                'absolute inset-0 size-4 transition-opacity',
                                hasSavedTier ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'
                              )}
                            />
                            {hasSavedTier ? (
                              <PencilIcon className="absolute inset-0 size-4 text-action-primary opacity-0 transition-opacity group-hover:opacity-100" />
                            ) : null}
                          </span>
                        ) : null}
                      </span>
                    </button>

                    {isSelected && option.id === 'FLAT_BONUS' ? (
                      <div className="space-y-1 px-1">
                        <CurrencyInputField
                          value={draftAmount}
                          placeholder="e.g. 100"
                          error={amountError}
                          onChange={(nextValue) => {
                            setDraftAmount(sanitizeNumericInput(nextValue))
                            setLocalAmountError(null)
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>

            {draftOptionId === 'FLAT_BONUS' ? (
              <div className="pt-1">
                <InlineEditorActions
                  onCancel={() => {
                    resetDraftState()
                    onOpenChange(false, 'close-press')
                  }}
                  onSave={handleFlatAmountSave}
                  isSaveDisabled={isFlatSaveDisabled}
                  saveTooltipMessage={amountTooltipMessage}
                />
              </div>
            ) : null}
          </PopoverContent>
        </Popover>
      </FormField>

      <CommissionTierModal
        open={isTierModalOpen}
        selectedTier={draftTierName}
        onSelectTier={setDraftTierName}
        onSave={handleTierSave}
        onGoBack={() => {
          setDraftTierName(committedValues.tierName)
          setIsTierModalOpen(false)
        }}
      />
    </>
  )
}
