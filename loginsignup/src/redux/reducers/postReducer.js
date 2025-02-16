import { createSlice } from "@reduxjs/toolkit";
import { createPost, deletePost, editlePost, getAllPosts,getSinglePost } from "../actions/postAction";

const postSlice = createSlice({
    name: "post",
    initialState: {
      post: [],
      loading: false,
      error: "",
      allPosts:[]
    },
    reducers: {

    },
    extraReducers: (builder) => {
      builder.addCase(getAllPosts.pending, (state) => { 
        state.loading = true;
        state.allPosts= null
      })
      builder.addCase(getAllPosts.fulfilled, (state, action) => {
        console.log(action.payload.posts);
        state.allPosts = action.payload.posts;
        state.loading = false;
       })
      builder.addCase(getAllPosts.rejected, (state) => {
        state.allPosts = null;
        state.loading = false;
      })
      builder.addCase(createPost.pending, (state) => { 
        state.loading = true;
        state.post= []
      })
      builder.addCase(createPost.fulfilled, (state, action) => {
        console.log(action.payload.post);
        state.post = action.payload.post;
        state.loading = false;
       })
      builder.addCase(createPost.rejected, (state) => {
        state.post = [];
        state.loading = false;
      })
      builder.addCase(getSinglePost.pending, (state) => {
          state.loading = true;
          state.post = [];
        });
      builder.addCase(getSinglePost.fulfilled, (state, action) => {
        console.log(action.payload);
          state.post = action.payload.post;
          state.loading = false;
        });
      builder.addCase(getSinglePost.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }); 
        builder.addCase(editlePost.pending, (state) => {
          state.loading = true;
          state.post = [];
        });
      builder.addCase(editlePost.fulfilled, (state, action) => {
        console.log('hellllllllll',action.payload);
          state.post = action.payload.post;
          state.loading = false;
        });
      builder.addCase(editlePost.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }); 
        builder.addCase(deletePost.pending, (state) => {
          state.loading = true;
          state.post = [];
        });
      builder.addCase(deletePost.fulfilled, (state, action) => {
        console.log(action.payload);
          state.loading = false;
          const { id } = action.payload;
          if (id) {
            state.allPosts = state.allPosts.filter((element) => element.id !== id);
          }
        });
      builder.addCase(deletePost.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }); 
       
    
    },
  });
  
  export default postSlice.reducer;
  