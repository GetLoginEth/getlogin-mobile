import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface InitState {
  mnemonic: string | null
  address: string | null
  username: string | null
  isLogged: boolean
}

const initialState: InitState = {
  mnemonic: '',
  address: '',
  username: '',
  isLogged: false,
}

export const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    setInitInfo: (
      state,
      action: PayloadAction<{
        mnemonic: string | null
        address: string | null
        username: string | null
        isLogged: boolean
      }>,
    ) => {
      state.mnemonic = action.payload.mnemonic
      state.address = action.payload.address
      state.username = action.payload.username
      state.isLogged = action.payload.isLogged
    },
    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload
    },
  },
})

export const { setInitInfo, setIsLogged } = initSlice.actions

export const selectInitInfo = (state: RootState) => ({
  mnemonic: state.init.mnemonic,
  address: state.init.address,
  username: state.init.username,
  isLogged: state.init.isLogged,
})

export const selectIsLogged = (state: RootState) => state.init.isLogged

export default initSlice.reducer
