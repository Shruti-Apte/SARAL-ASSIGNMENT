import type { RewardForm, RewardPayload } from '@/features/reward-modal/model/types'

export function sanitizeNumericInput(value: string): string {
  const sanitized = value.replace(/[^0-9.]/g, '')
  const firstDecimalIndex = sanitized.indexOf('.')

  if (firstDecimalIndex === -1) {
    return sanitized
  }

  const integerPart = sanitized.slice(0, firstDecimalIndex + 1)
  const decimalPart = sanitized.slice(firstDecimalIndex + 1).replace(/\./g, '')

  return `${integerPart}${decimalPart}`
}

export function toNumber(value: string): number | null {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return null
  }

  return parsed
}

export function toPayload(form: RewardForm): RewardPayload {
  const event = {
    id: form.eventId!,
    amount: toOptionalNumber(form.eventValues.amount),
    postsX: toOptionalNumber(form.eventValues.postsX),
    periodY: form.eventValues.periodY.trim() || undefined,
  }

  const reward = {
    id: form.rewardId!,
    amount: toOptionalNumber(form.rewardValues.amount),
    tierName: form.rewardValues.tierName.trim() || undefined,
  }

  return {
    event,
    reward,
    isTimeBound: form.isTimeBound,
    endDate: form.endDate ?? undefined,
  }
}

function toOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = toNumber(trimmed)
  return parsed === null ? undefined : parsed
}
