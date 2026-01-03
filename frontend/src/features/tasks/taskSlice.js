import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async () => {
    const res = await api.get("/tasks");
    return res.data;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default taskSlice.reducer;
