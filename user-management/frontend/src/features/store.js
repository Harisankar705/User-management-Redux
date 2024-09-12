import { configureStore } from "@reduxjs/toolkit";
import authReducer from './userAuth/authSlice'
import adminReducer from './adminAuth/adminSlice'
export const store=configureStore({
    reducer:{
        auth:authReducer,
        admin:adminReducer
    }
})