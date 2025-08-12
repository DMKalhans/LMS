import { authApi } from "@/features/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { courseApi } from "@/features/api/courseApi";

const rootReducer = combineReducers({
  [courseApi.reducerPath]: courseApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
});

export default rootReducer;
