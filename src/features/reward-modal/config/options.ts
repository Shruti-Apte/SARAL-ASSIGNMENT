import type {
  EventValueKey,
  FieldErrorKey,
  RewardEventId,
  RewardTypeId,
  RewardValueKey,
} from '@/features/reward-modal/model/types'

export interface OptionFieldConfig<ValueKey extends string> {
  key: ValueKey
  label: string
  placeholder: string
  errorKey: FieldErrorKey
  prefix?: string
}

export interface OptionConfig<OptionId extends string, ValueKey extends string> {
  id: OptionId
  label: string
  fields: OptionFieldConfig<ValueKey>[]
  getSummary: (values: Record<ValueKey, string>) => string
}

export const EVENT_OPTIONS: OptionConfig<RewardEventId, EventValueKey>[] = [
  {
    id: 'CROSS_SALES',
    label: 'Cross $X in sales',
    fields: [
      {
        key: 'amount',
        label: 'Sales amount',
        placeholder: 'e.g. 100',
        errorKey: 'eventAmount',
        prefix: '$',
      },
    ],
    getSummary: (values) =>
      values.amount.trim() ? `Cross $${values.amount.trim()} in sales` : 'Cross $X in sales',
  },
  {
    id: 'POSTS_PER_PERIOD',
    label: 'Posts X times every Y period',
    fields: [
      {
        key: 'postsX',
        label: 'Posts count',
        placeholder: 'e.g. 5',
        errorKey: 'postsX',
      },
      {
        key: 'periodY',
        label: 'Period',
        placeholder: 'e.g. 30',
        errorKey: 'periodY',
      },
    ],
    getSummary: (values) => {
      if (!values.postsX.trim() || !values.periodY.trim()) {
        return 'Posts X times every Y period'
      }

      return `Posts ${values.postsX.trim()} times every ${values.periodY.trim()}`
    },
  },
  {
    id: 'IS_ONBOARDED',
    label: 'Is Onboarded',
    fields: [],
    getSummary: () => 'Is Onboarded',
  },
]

export const REWARD_OPTIONS: OptionConfig<RewardTypeId, RewardValueKey>[] = [
  {
    id: 'FLAT_BONUS',
    label: 'Flat $X bonus',
    fields: [
      {
        key: 'amount',
        label: 'Bonus amount',
        placeholder: 'e.g. 100',
        errorKey: 'rewardAmount',
        prefix: '$',
      },
    ],
    getSummary: (values) =>
      values.amount.trim() ? `Flat $${values.amount.trim()} bonus` : 'Flat $X bonus',
  },
  {
    id: 'UPGRADE_COMMISSION_TIER',
    label: 'Upgrade Commission Tier',
    fields: [],
    getSummary: (values) =>
      values.tierName.trim()
        ? `Upgrade to {${values.tierName.trim()}}`
        : 'Upgrade Commission Tier',
  },
]

export const COMMISSION_TIER_OPTIONS = [
  'Tier 1',
  'Tier 2',
  'Tier 3',
  'Tier 4',
]

export const DURATION_OPTIONS = [
  '14 days',
  '1 month',
  '2 months',
  '3 months',
  '1 year',
]
