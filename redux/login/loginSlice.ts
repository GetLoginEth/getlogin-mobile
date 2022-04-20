import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface LoginState {
    username: string;
    password: string;
    invite: string;
    signupStatus: string;
    loginStatus: string;
}

const initialState: LoginState = {
    username: '',
    password: '',
    invite: '',
    signupStatus: '',
    loginStatus: '',
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        // setIsLogged: (state, action: PayloadAction<boolean>) => {
        //     state.isLogged = action.payload;
        // },
        setSigninInfo: (state, action: PayloadAction<{ username: string, password: string }>) => {
            state.username = action.payload.username;
            state.password = action.payload.password;
        },
    },
    extraReducers: (builder) => {
        // builder
        //     .addCase(incrementAsync.pending, (state) => {
        //         state.status = 'loading';
        //     })
        //     .addCase(incrementAsync.fulfilled, (state, action) => {
        //         state.status = 'idle';
        //         // state.value += action.payload;
        //     });
    },
});

export const { setSigninInfo } = loginSlice.actions;

export const selectSigninInfo = (state: RootState) => ({
    username: state.login.username,
    password: state.login.password,
    status: state.login.loginStatus,
});
export const selectSignupInfo = (state: RootState) => ({
    username: state.login.username,
    password: state.login.password,
    status: state.login.signupStatus,
});

export default loginSlice.reducer;
