import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { getState }) => {
  const { auth } = getState();
  const { data } = await axios.get('/api/tasks', {
    headers: { Authorization: `Bearer ${auth.token}` },
  });
  return data;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      });
  },
});

export default taskSlice.reducer;
