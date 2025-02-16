import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getUsers = () => API.get("/users/getUsers");
export const getRoles = () => API.get("/roles/getRole");
export const getPermissions = () => API.get("/permissions/getPermission");
export const createUser = (data) => API.post("/users", data);
export const updateUserRoles = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
