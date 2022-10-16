import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface AppState {
  isLogged: boolean
  status: 'idle' | 'loading' | 'failed'
  balanceXdai: string
  balanceXbzz: string
}

const initialState: AppState = {
  isLogged: false,
  status: 'idle',
  balanceXdai: '0',
  balanceXbzz: '0',
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload
    },
    setBalance: (state, action: PayloadAction<{ xdai: string; xbzz: string }>) => {
      state.balanceXdai = action.payload.xdai
      state.balanceXbzz = action.payload.xbzz
    },
  },
})

export const { setIsLogged, setBalance } = appSlice.actions

export const selectStatus = (state: RootState) => state.counter.status
export const selectIsLogged = (state: RootState) => state.counter.isLogged
export const selectBalance = (state: RootState) => ({
  xdai: state.counter.balanceXdai,
  xbzz: state.counter.balanceXbzz,
})

export default appSlice.reducer
