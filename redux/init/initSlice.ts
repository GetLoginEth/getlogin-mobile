import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface InitState {
  mnemonic: string | null
  username: string | null
  isLogged: boolean
}

const initialState: InitState = {
  mnemonic: '',
  username: '',
  isLogged: false,
}

export const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    setInitInfo: (
      state,
      action: PayloadAction<{ mnemonic: string | null; username: string | null; isLogged: boolean }>,
    ) => {
      state.mnemonic = action.payload.mnemonic
      state.username = action.payload.username
      state.isLogged = action.payload.isLogged
    },
  },
  extraReducers: builder => {
    // builder
    //     .addCase(incrementAsync.pending, (state) => {
    //         state.status = 'loading';
    //     })
    //     .addCase(incrementAsync.fulfilled, (state, action) => {
    //         state.status = 'idle';
    //         // state.value += action.payload;
    //     });
  },
})

export const { setInitInfo } = initSlice.actions

export const selectInitInfo = (state: RootState) => ({
  mnemonic: state.init.mnemonic,
  username: state.init.username,
  isLogged: state.init.isLogged,
})

export default initSlice.reducer