import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface AppState {
  status: 'idle' | 'loading' | 'failed'
  balanceXdai: string
  balanceXbzz: string
}

const initialState: AppState = {
  status: 'idle',
  balanceXdai: '0',
  balanceXbzz: '0',
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<{ xdai: string; xbzz: string }>) => {
      state.balanceXdai = action.payload.xdai
      state.balanceXbzz = action.payload.xbzz
    },
  },
})

export const { setBalance } = appSlice.actions

export const selectBalance = (state: RootState) => ({
  xdai: state.counter.balanceXdai,
  xbzz: state.counter.balanceXbzz,
})

export default appSlice.reducer
