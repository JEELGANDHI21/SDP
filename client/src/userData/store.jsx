import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  name: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
    },
  },
});

export const { setLogin } = authSlice.actions;
export default authSlice.reducer;
