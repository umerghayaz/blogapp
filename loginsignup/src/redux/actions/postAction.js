import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Alert } from 'antd';
import { API } from "../../services/api";

export const getAllPosts = createAsyncThunk("getAllPosts", async (data) => {
    try {
      const res = await API.get( "/posts",
        { withCredentials: true, headers: {
        "Content-Type": "application/json",
      }}
        );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return isRejectedWithValue(error.response);
    }
  });
  export const getSinglePost = createAsyncThunk("getSinglePost", async (data) => {
    try {
      const res =await API.get(`/posts/${data}`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      return isRejectedWithValue(error.response);
    }
  });
  export const createPost = createAsyncThunk("createPost", async (data) => {
    try {
      console.log('data',data);
      
      // let payload = {
      //   "title": data.title,
      //   "content":  data.content,
      //   "categories": data.categories,
      //   "featuredImage":  data.featuredImage,
      //    "isApproved": data.isApproved,
      //   "approvedBy": data.approvedBy
      // }
      // console.log('payload',payload)
      const res =await API.post(`/posts`,data,

      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return isRejectedWithValue(error.response);
    }
  });
  export const editlePost = createAsyncThunk("editlePost", async (data) => {
    try {
      console.log('data',data);
      
      let payload = {
        "title": data.title,
        "content":  data.content,
        "status":  data.status,
        "categories": data.categories,
        "featuredImage":  data.featuredImage,
        "isApproved": data.isApproved,
        "approvedBy": data.approvedBy
      }
      console.log('payload',payload)
      const res =await API.put(`/posts/${data.postID}`,payload,

      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return isRejectedWithValue(error.response);
    }
  });
  export const deletePost = createAsyncThunk("deletePost", async (data) => {
    try {
      console.log('data',data);
      const res =await API.delete(`/posts/${data}`

      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return isRejectedWithValue(error.response);
    }
  });
 