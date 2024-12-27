import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      Cookies.remove('token');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post('/api/auth/login', credentials);
    Cookies.set('token', data.token);
    dispatch(setAuth({ user: data.user, token: data.token }));
  } catch (error) {
    console.error(error.response.data.message);
  }
};

export default authSlice.reducer;
