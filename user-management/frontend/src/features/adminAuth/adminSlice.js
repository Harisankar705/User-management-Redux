import { createSlice, createAsyncThunk   } from "@reduxjs/toolkit";
import adminService from "./adminService";

const admin=(()=>{
    const adminFromStorage=localStorage.getItem('admin')
    try {
        return adminFromStorage ?JSON.parse(adminFromStorage):null
    } catch (error) {
        console.log("error occured during adminFromStorage",error)
        return null
        
    }
})()



export const adminLogin = createAsyncThunk('admin/login', async (adminData, thunkAPI) => {
    try {
        return await adminService.adminLogin(adminData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const createUser=createAsyncThunk('admin/create-user',async(userData,thunkAPI)=>{
try {
        return await adminService.createUser(userData)
} catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    
}
})

export const userDetails = createAsyncThunk('admin/userDetails', async (_, thunkAPI) => {
    console.log("IN USERDETAILs")
    try {
        return await adminService.userDetails()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const viewUser = createAsyncThunk('admin/view-user', async (_, thunkAPI) => {
    try {
        return await adminService.viewUser()

    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const editUser = createAsyncThunk('admin/edit-user', async ({ formData, userId }, thunkAPI) => {
    try {
        return await adminService.editUser({ formData, userId })
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);

    }
})

export const blockUser = createAsyncThunk('admin/block-user', async (id, thunkAPI) => {
    try {
        console.log('in blockuse')
        return await adminService.blockUser(id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const adminLogout = createAsyncThunk('admin/logout', async () => {
    await adminService.logout()
    return 
})

const initialState={
    admin:admin ? admin :null,
    userData:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:''
}
const adminSlice=createSlice({
    name:'admin',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isError=false
            state.isSuccess=false
            state.isLoading=false
            state.message=''
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(adminLogin.pending,(state)=>{
            state.isLoading=true
            state.isError=false
        })
        .addCase(adminLogin.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isError=false
            state.admin=action.payload
        })
        .addCase(adminLogin.rejected,(state,action)=>{
            state.isLoading=false
            state.isSuccess=false
            state.isError=true
            state.admin=null
            state.message = action.payload;

        })
        .addCase(userDetails.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(userDetails.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isError=false
            state.userData=action.payload
        })
        .addCase(userDetails.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })
        .addCase(editUser.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(editUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.userData=action.payload
        })
        .addCase(editUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })
        .addCase(createUser.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(createUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isError=false
            state.userData=action.payload
        }).addCase(createUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })
        .addCase(blockUser.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(blockUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isError=false
            state.userData=action.payload
        })
        .addCase(blockUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })

    }
})

export const {reset} =adminSlice.actions
export default adminSlice.reducer