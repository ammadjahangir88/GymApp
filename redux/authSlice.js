import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    userId: null,
    email: null,
    userName: null,
    token: null,
    userType: null,


}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SET_ACTIVE_USER(state,action){
        console.log(action.payload)
        state.isAuthenticated= true,
        state.email=action.payload.email,
        state.userName=action.payload.userName,
        state.token=action.payload.token,
        state.userType=action.payload.userType
        state.userId=action.payload.userId

    },
    LOGOUT(state) {
      state.isAuthenticated = false;
      state.email = null;
      state.userName = null;
      state.token = null;
      state.userType = null;
    },
  }
});

export const { SET_ACTIVE_USER, LOGOUT } = authSlice.actions;

export const selectIsAuthenticated=(state)=>state.auth.isAuthenticated
export const selectEmail=(state)=>state.auth.email
export const selectUserName=(state)=>state.auth.userName
export const selectToken=(state)=>state.auth.token
export const selectUserType=(state)=>state.auth.userType
export const selectUserId=(state)=>state.auth.userId

export default authSlice.reducer