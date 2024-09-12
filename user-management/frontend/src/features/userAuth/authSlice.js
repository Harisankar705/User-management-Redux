import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = (() => {
  const userFromStorage = localStorage.getItem('user');

  try {
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    return null;
  }
})();

const initialState = {
  user: user, 
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ""
};


export const signup = createAsyncThunk("auth/signup", async (user, thunkAPI) => {
  try {
    return await authService.signup(user);
  } catch (error) {
    const message = 
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    console.log("IN AUTHSLICE")
    return await authService.login(user);
  } catch (error) {
    console.error("Error occurred during login", error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
      console.log("MESSAGE",message)
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateProfile=createAsyncThunk('auth/updateProfile',async({formData,token},thunkAPI)=>{
  try {
    console.log("IN UPDATEPROFILE")
    return await authService.updateProfile({formData,token})
  } catch (error) {
    const message =
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();
    console.log('error ocurred',error)
  return thunkAPI.rejectWithValue(message);  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.isError=false
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError=false
        state.user = action.payload; 
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user=null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError=false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError=false
        state.user = action.payload; 
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user=null
      })
      .addCase(updateProfile.pending,(state)=>{
        state.isLoading=true;
        state.isError=false
      })
      .addCase(updateProfile.fulfilled,(state,action)=>{
        state.isLoading=false
        state.isSuccess=true
        state.isError=false
        state.user=action.payload
      })
      .addCase(updateProfile.rejected,(state,action)=>{
        state.isLoading=false
        state.isError=true
        state.message=action.payload
        state.user=null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { reset } = authSlice.actions; 
export default authSlice.reducer;
