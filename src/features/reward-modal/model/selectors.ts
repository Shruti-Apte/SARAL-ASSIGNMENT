import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store/store'
import { validateRewardForm } from '@/features/reward-modal/config/validation'

export const selectRewardModalState = (state: RootState) => state.rewardModal

export const selectIsModalOpen = (state: RootState) => state.rewardModal.isOpen
export const selectRewardForm = (state: RootState) => state.rewardModal.form
export const selectRewardFieldErrors = (state: RootState) =>
  state.rewardModal.fieldErrors
export const selectRewardSubmitStatus = (state: RootState) =>
  state.rewardModal.status
export const selectRewardSubmitError = (state: RootState) =>
  state.rewardModal.submitError

export const selectCanCreateReward = createSelector(selectRewardForm, (form) => {
  return Object.keys(validateRewardForm(form)).length === 0
})
