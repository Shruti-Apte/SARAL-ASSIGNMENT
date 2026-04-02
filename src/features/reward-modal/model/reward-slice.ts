import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

import type { RootState } from '@/app/store/store'
import { validateRewardForm } from '@/features/reward-modal/config/validation'
import { toPayload } from '@/features/reward-modal/lib/validators'
import type {
  CreateRewardError,
  EventValueKey,
  RewardEventId,
  RewardModalState,
  RewardPayload,
  RewardTypeId,
  RewardValueKey,
} from '@/features/reward-modal/model/types'

const EMPTY_EVENT_VALUES: Record<EventValueKey, string> = {
  amount: '',
  postsX: '',
  periodY: '',
}

const EMPTY_REWARD_VALUES: Record<RewardValueKey, string> = {
  amount: '',
  tierName: '',
}

const createInitialState = (): RewardModalState => ({
  isOpen: false,
  form: {
    eventId: null,
    eventValues: { ...EMPTY_EVENT_VALUES },
    rewardId: null,
    rewardValues: { ...EMPTY_REWARD_VALUES },
    isTimeBound: false,
    endDate: null,
  },
  status: 'idle',
  fieldErrors: {},
  submitError: null,
  lastCreatedReward: null,
})

const initialState = createInitialState()

export const createReward = createAsyncThunk<
  RewardPayload,
  void,
  {
    state: RootState
    rejectValue: CreateRewardError
  }
>('rewardModal/createReward', async (_, { getState, rejectWithValue }) => {
  const form = getState().rewardModal.form
  const validationErrors = validateRewardForm(form)

  if (Object.keys(validationErrors).length > 0) {
    return rejectWithValue({
      message: 'Please fix the highlighted fields.',
      fieldErrors: validationErrors,
    })
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 900)
  })

  return toPayload(form)
})

const rewardSlice = createSlice({
  name: 'rewardModal',
  initialState,
  reducers: {
    openModal(state) {
      state.isOpen = true
      state.status = 'idle'
      state.fieldErrors = {}
      state.submitError = null
    },
    closeModal() {
      return createInitialState()
    },
    setEventSelection(
      state,
      action: PayloadAction<{
        eventId: RewardEventId
        values: Partial<Record<EventValueKey, string>>
      }>
    ) {
      state.form.eventId = action.payload.eventId
      state.form.eventValues = {
        ...EMPTY_EVENT_VALUES,
        ...action.payload.values,
      }
      state.fieldErrors.eventId = undefined
      state.fieldErrors.eventAmount = undefined
      state.fieldErrors.postsX = undefined
      state.fieldErrors.periodY = undefined
      state.submitError = null
    },
    setRewardSelection(
      state,
      action: PayloadAction<{
        rewardId: RewardTypeId
        values: Partial<Record<RewardValueKey, string>>
      }>
    ) {
      state.form.rewardId = action.payload.rewardId
      state.form.rewardValues = {
        ...EMPTY_REWARD_VALUES,
        ...action.payload.values,
      }
      state.fieldErrors.rewardId = undefined
      state.fieldErrors.rewardAmount = undefined
      state.fieldErrors.rewardTier = undefined
      state.submitError = null
    },
    clearRewardSelection(state) {
      state.form.rewardId = null
      state.form.rewardValues = { ...EMPTY_REWARD_VALUES }
      state.fieldErrors.rewardId = undefined
      state.fieldErrors.rewardAmount = undefined
      state.fieldErrors.rewardTier = undefined
      state.submitError = null
    },
    setTimeBound(state, action: PayloadAction<boolean>) {
      state.form.isTimeBound = action.payload
      if (!action.payload) {
        state.form.endDate = null
        state.fieldErrors.endDate = undefined
      }
    },
    setEndDate(state, action: PayloadAction<string | null>) {
      state.form.endDate = action.payload
      state.fieldErrors.endDate = undefined
      state.submitError = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createReward.pending, (state) => {
      state.status = 'submitting'
      state.fieldErrors = {}
      state.submitError = null
    })

    builder.addCase(createReward.fulfilled, (_state, action) => {
      return {
        ...createInitialState(),
        status: 'succeeded',
        lastCreatedReward: action.payload,
      }
    })

    builder.addCase(createReward.rejected, (state, action) => {
      state.status = 'failed'

      if (action.payload) {
        state.fieldErrors = action.payload.fieldErrors ?? {}
        state.submitError = action.payload.message
        return
      }

      state.submitError = action.error.message ?? 'Unable to create reward.'
    })
  },
})

export const {
  clearRewardSelection,
  closeModal,
  openModal,
  setEndDate,
  setEventSelection,
  setRewardSelection,
  setTimeBound,
} = rewardSlice.actions

export default rewardSlice.reducer
