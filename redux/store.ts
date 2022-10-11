import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import appReducer from './app/appSlice'
import loginReducer from './login/loginSlice'
import initReducer from './init/initSlice'

export const store = configureStore({
  reducer: {
    counter: appReducer,
    login: loginReducer,
    init: initReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
