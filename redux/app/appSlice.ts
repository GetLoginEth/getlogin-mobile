import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { getUIBalance, getUIBalanceBzz } from '../../utils/ui'

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

export const updateBalance = createAsyncThunk('app/updateBalance', async (address: string) => {
  const balanceXdai = await getUIBalance(address)
  const balanceXbzz = await getUIBalanceBzz(address)

  return { balanceXdai, balanceXbzz }
})

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<{ xdai: string; xbzz: string }>) => {
      state.balanceXdai = action.payload.xdai
      state.balanceXbzz = action.payload.xbzz
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateBalance.pending, state => {
        state.status = 'loading'
      })
      .addCase(updateBalance.fulfilled, (state, action) => {
        state.status = 'idle'
        state.balanceXdai = action.payload.balanceXdai
        state.balanceXbzz = action.payload.balanceXbzz
      })
      .addCase(updateBalance.rejected, state => {
        state.status = 'failed'
      })
  },
})

export const { setBalance } = appSlice.actions

export const selectBalance = (state: RootState) => ({
  xdai: state.counter.balanceXdai,
  xbzz: state.counter.balanceXbzz,
})

export default appSlice.reducer
