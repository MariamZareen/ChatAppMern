import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  sidebarData: [{ name: "mariam" }],
  isLoading: false,
  error: null,
};

export const refreshSidebar = createAsyncThunk(
  'sidebar/refreshSidebar',
  async (_, { rejectWithValue }) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.data || !userData.data.token) {
      return rejectWithValue('User data or token is missing');
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    try {
      const response = await axios.get('http://localhost:5000/chat/', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.sidebarData.push(action.payload);
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setData: (state, action) => {
      state.sidebarData = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshSidebar.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(refreshSidebar.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sidebarData = action.payload;
    });
    builder.addCase(refreshSidebar.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload; 
    });
  },
});

export const {
  addUser,
  startLoading,
  stopLoading,
  setData,
  setError,
  clearError,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
