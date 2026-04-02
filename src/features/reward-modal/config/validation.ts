import {
  EVENT_OPTIONS,
  REWARD_OPTIONS,
} from '@/features/reward-modal/config/options'
import { toNumber } from '@/features/reward-modal/lib/validators'
import type { FieldErrors, RewardForm } from '@/features/reward-modal/model/types'

export function validateRewardForm(form: RewardForm): FieldErrors {
  const errors: FieldErrors = {}

  if (!form.eventId) {
    errors.eventId = 'Reward event is required.'
  }

  const selectedEvent = EVENT_OPTIONS.find((option) => option.id === form.eventId)
  if (selectedEvent) {
    validateOptionFields(selectedEvent.fields, form.eventValues, errors)
  }

  if (!form.rewardId) {
    errors.rewardId = 'Reward with is required.'
  }

  const selectedReward = REWARD_OPTIONS.find((option) => option.id === form.rewardId)
  if (selectedReward) {
    validateOptionFields(selectedReward.fields, form.rewardValues, errors)
  }

  const isCommissionDisabledForEvent =
    form.eventId === 'POSTS_PER_PERIOD' || form.eventId === 'IS_ONBOARDED'
  if (isCommissionDisabledForEvent && form.rewardId === 'UPGRADE_COMMISSION_TIER') {
    errors.rewardId = 'Commission tier is not available for this reward event.'
  }

  if (form.rewardId === 'UPGRADE_COMMISSION_TIER' && !form.rewardValues.tierName.trim()) {
    errors.rewardTier = 'Commission tier is required.'
  }

  if (form.isTimeBound && !form.endDate) {
    errors.endDate = 'End date is required when time bound is enabled.'
  }

  return errors
}

function validateOptionFields<ValueKey extends string>(
  fields: {
    key: ValueKey
    errorKey: keyof FieldErrors
    label: string
  }[],
  values: Record<ValueKey, string>,
  errors: FieldErrors
) {
  fields.forEach((field) => {
    const rawValue = values[field.key].trim()

    if (!rawValue) {
      errors[field.errorKey] = `${field.label} is required.`
      return
    }

    if (field.key === 'periodY') {
      return
    }

    const parsed = toNumber(rawValue)
    if (parsed === null || parsed <= 0) {
      errors[field.errorKey] = `${field.label} must be greater than 0.`
    }
  })
}
