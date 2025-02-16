import { createSlice } from "@reduxjs/toolkit";
import { signUp, login, getProfile,refreshToken,getAllUsers,getUserByID,editUser ,deleteUser, logout} from "../actions/userAction";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    singleUser: [],
    loading: false,
    checkingAuth: true,
    error: "",
    allUsers:[]
  },
  reducers: {
    // Define your reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = [action.payload];
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(login.pending, (state, action) => {
        state.loading = true;
        state.singleUser = []
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        console.log('inside',action)
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.checkingAuth = true; // Start the refresh process
        state.error = [];
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token; // Update token
        state.checkingAuth = false; // End the refresh process
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.user = []; // Log out user on failure
        state.singleUser = [];
        state.checkingAuth = false;
        state.error = action.payload; // Capture error
      })
       // Logout
      builder.addCase(logout.fulfilled, (state) => {
        state.user = [];
        state.singleUser = [];
      })
      builder.addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      })
       // Check Auth
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
     })
    builder.addCase(getProfile.rejected, (state) => {
      state.user = [];
      state.loading = false;
    })
    builder.addCase(getAllUsers.pending, (state) => { 
      state.loading = true;
      state.allUsers= []
    })
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.allUsers = action.payload.allUsers;
      state.loading = false;
     })
    builder.addCase(getAllUsers.rejected, (state) => {
      state.allUsers = [];
      state.loading = false;
    })
    builder.addCase(getUserByID.pending, (state) => { 
      state.loading = true;
      state.user= []
    })
    builder.addCase(getUserByID.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
     })
    builder.addCase(getUserByID.rejected, (state) => {
      state.user = [];
      state.loading = false;
    })
    builder.addCase(editUser.pending, (state) => { 
      state.loading = true;
      state.user= []
    })
    builder.addCase(editUser.fulfilled, (state, action) => {
      console.log('edit user',action)
      state.user = action.payload.user;
 
      state.allUsers = state.allUsers.map((item) =>
        item._id === action.payload.user._id ? action.payload.user : item
      );
      state.loading = false;
     })
    builder.addCase(editUser.rejected, (state) => {
      state.user = [];
      state.loading = false;
    })
    builder.addCase(deleteUser.pending, (state) => { 
      state.loading = true;
      state.user= []
    })
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      const { id } = action.payload;
      if (id) {
        state.allUsers = state.allUsers.filter((element) => element.id !== id);
      }
     })
    builder.addCase(deleteUser.rejected, (state) => {
      state.user = [];
      state.loading = false;
    })
  },
});

export default userSlice.reducer;
