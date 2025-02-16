import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Alert } from 'antd';
import { API } from "../../services/api";

// create User
export const signUp = createAsyncThunk("signUp", async (data) => {
    if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return 
      } 
    try {
     const response = await API.post("/users/signup", {
       name:data.name, email: data.email, password: data.password, confirmPassword: data.confirmPassword 
      },{ withCredentials: true, headers: {
        "Content-Type": "application/json",
      }})
    console.log(response.data,'data');
    return response.data;
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});

// read User
export const login = createAsyncThunk("login", async (data, thunkAPI) => {
  try {
    console.log('login11111111111',data)

    const res = await API.post("/users/login", {
       email: data.email, password: data.password,
      },{ withCredentials: true, headers: {
        "Content-Type": "application/json",
      }});
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log('error',error)
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Login failed. Please try again."
    );  }
});
export const logout = createAsyncThunk("logout", async () => {
  try {
    await API.post("/users/logout");
    return 
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});
export const getProfile = createAsyncThunk("getProfile", async (data) => {
  try {
    console.log('dataaaaaaa',data)
    const res = await API.get( `/users/profile`,
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
export

const getUserByID = createAsyncThunk("getUserByID", async (data) => {
  try {
    console.log('dataaaaaaa',data)
    const res = await API.get( `/users/${data}`,
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
export const deleteUser = createAsyncThunk("deleteUser", async (data) => {
  try {
    const res = await API.delete( `/users/${data}`,
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
export const getAllUsers = createAsyncThunk("getAllUsers", async (data) => {
  try {
    const res = await API.get( "/users/getAllUser",
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
export const editUser = createAsyncThunk("editUser", async (data) => {
  console.log('edit user',data)
  try {
    let payload  = {
      "name": data.name,
      "email": data.email,
      "roles": [
        {
          "roleName": data.role,
          "roleId": data.idValue
        }
      ]
    }
    
    const res = await API.put( `/users/${data._id}`,
      payload,
      { withCredentials: true, headers: {
      "Content-Type": "application/json",
    }}
      );
    console.log('responseeeeee',res.data);
    return res.data;
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});
export const refreshToken = createAsyncThunk("refreshToken", async (data) => {
  try {
    const res = await axios.post(
      "/users/refresh-token",{ withCredentials: true, headers: {
        "Content-Type": "application/json",
      }}
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});
