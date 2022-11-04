import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { getUIBalance, getUIBalanceBzz } from '../../utils/ui'
import { getActiveAppSessions, getApplication } from '../../api/GetLoginUtils'
import { ApplicationInformation, AppSession } from '../../api/GetLogin'

export interface AppState {
  status: 'idle' | 'loading' | 'failed'
  balanceXdai: string
  balanceXbzz: string
  dappsInfo: { [key: number]: ApplicationInformation }
  dappsSessionsList: AppSession[] | null
}

const initialState: AppState = {
  status: 'idle',
  balanceXdai: '0',
  balanceXbzz: '0',
  dappsInfo: {},
  dappsSessionsList: null,
}

/**
 * Updates user balances
 */
export const updateBalance = createAsyncThunk('app/updateBalance', async (address: string) => {
  const balanceXdai = await getUIBalance(address)
  const balanceXbzz = await getUIBalanceBzz(address)

  return { balanceXdai, balanceXbzz }
})

/**
 * Get information about specific dApp
 */
export const getDappInfo = createAsyncThunk('app/getDappInfo', async (id: number) => {
  console.log('get getDappInfo', id)

  return getApplication(id)
})

/**
 * Updates dApps and session keys list
 */
export const updateDappsSessionsList = createAsyncThunk(
  'app/updateDappsSessionsList',
  async (username: string, { getState, dispatch }) => {
    const state = getState() as RootState
    const sessions = await getActiveAppSessions(username)
    const appIdsSet = new Set()
    sessions.forEach(item => {
      if (!item.isActive) {
        return
      }

      appIdsSet.add(item.applicationId)
    })

    for (const appId of appIdsSet) {
      const id = appId as number

      if (!id) {
        // eslint-disable-next-line no-continue
        continue
      }

      if (!state.counter.dappsInfo[id]) {
        dispatch(getDappInfo(id))
      }
    }

    return { sessions: sessions.filter(item => item.isActive) }
  },
)

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

      .addCase(getDappInfo.pending, state => {
        state.status = 'loading'
      })
      .addCase(getDappInfo.fulfilled, (state, action) => {
        state.status = 'idle'
        state.dappsInfo[action.payload.applicationId] = action.payload
      })
      .addCase(getDappInfo.rejected, state => {
        state.status = 'failed'
      })

      .addCase(updateDappsSessionsList.pending, state => {
        state.status = 'loading'
      })
      .addCase(updateDappsSessionsList.fulfilled, (state, action) => {
        state.status = 'idle'
        const sessions = action.payload?.sessions
        state.dappsSessionsList = sessions ? sessions : null
      })
      .addCase(updateDappsSessionsList.rejected, state => {
        state.status = 'failed'
      })
  },
})

export const { setBalance } = appSlice.actions

export const selectBalance = (state: RootState) => ({
  xdai: state.counter.balanceXdai,
  xbzz: state.counter.balanceXbzz,
})

export const selectDappsSessionsList = (state: RootState) => state.counter.dappsSessionsList

export const selectDappsInfo = (state: RootState) => state.counter.dappsInfo

export default appSlice.reducer
