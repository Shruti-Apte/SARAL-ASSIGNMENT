import { configureStore } from '@reduxjs/toolkit'

import rewardModalReducer from '@/features/reward-modal/model/reward-slice'

export const store = configureStore({
  reducer: {
    rewardModal: rewardModalReducer,
  },
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
