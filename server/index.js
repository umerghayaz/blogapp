// const express = require("express")
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./Routes/userRoute.js"
import permissionRoute from "./Routes/permissionRoute.js"
import roleRoute from "./Routes/roleRoute.js"
import rolepermissionRoute from "./Routes/rolepermissionRoute.js"
import cookieParser from "cookie-parser";
import postRoute from "./Routes/postRoute.js"
// import authRoutes from "./routes/authRoutes.js";
// signup
// const EmployeeModel = require("./model/Employee")
import {connectDB} from './lib/db.js'
// import  {signup}  from "./Controllers/userController.js";
const app = express()
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('MY SECRET'));

const corsOptions = {
  origin: "http://localhost:5173",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
};
app.use( cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Allow cookies
}));
// app.use(cors(corsOptions));

app.use("/api/users", userRoute);
app.use("/api/permissions", permissionRoute); 
app.use("/api/roles", roleRoute);
app.use("/api/rolepermissions", rolepermissionRoute);
app.use("/api/posts", postRoute);
app.listen(5000, () => {
    console.log(`server is runing on port ${PORT}`);
    connectDB();
  });