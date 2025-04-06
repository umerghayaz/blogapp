import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userReducer";
import postSlice from "./reducers/postReducer";

export const store = configureStore({
    reducer: {
        post:postSlice,
        user: userSlice, // Add your reducers here
    },
});