export type RewardEventId = 'CROSS_SALES' | 'POSTS_PER_PERIOD' | 'IS_ONBOARDED'
export type RewardTypeId = 'FLAT_BONUS' | 'UPGRADE_COMMISSION_TIER'

export type EventValueKey = 'amount' | 'postsX' | 'periodY'
export type RewardValueKey = 'amount' | 'tierName'

export type FieldErrorKey =
  | 'eventId'
  | 'eventAmount'
  | 'postsX'
  | 'periodY'
  | 'rewardId'
  | 'rewardAmount'
  | 'rewardTier'
  | 'endDate'
  | 'form'

export type FieldErrors = Partial<Record<FieldErrorKey, string>>
export type SubmitStatus = 'idle' | 'submitting' | 'succeeded' | 'failed'

export interface RewardForm {
  eventId: RewardEventId | null
  eventValues: Record<EventValueKey, string>
  rewardId: RewardTypeId | null
  rewardValues: Record<RewardValueKey, string>
  isTimeBound: boolean
  endDate: string | null
}

export interface RewardPayload {
  event: {
    id: RewardEventId
    amount?: number
    postsX?: number
    periodY?: string
  }
  reward: {
    id: RewardTypeId
    amount?: number
    tierName?: string
  }
  isTimeBound: boolean
  endDate?: string
}

export interface CreateRewardError {
  message: string
  fieldErrors?: FieldErrors
}

export interface RewardModalState {
  isOpen: boolean
  form: RewardForm
  status: SubmitStatus
  fieldErrors: FieldErrors
  submitError: string | null
  lastCreatedReward: RewardPayload | null
}
