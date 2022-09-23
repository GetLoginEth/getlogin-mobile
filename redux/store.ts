import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import appReducer from './app/appSlice'
import loginReducer from './login/loginSlice'

export const store = configureStore({
  reducer: {
    counter: appReducer,
    login: loginReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
