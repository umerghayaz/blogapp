// const express = require("express")
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRoute from "./Routes/postRoute.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
// import {User} from "./model/user.js";
// User
import sequelize from "./model/modelindex.js";
import User from "./model/user.js";
import userRoute from "./Routes/userRoute.js";
import roleRouter from "./Routes/roleRoute.js";
import permissionRouter from "./Routes/permissionRoute.js";

// import  {signup}  from "./Controllers/userController.js";
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
    
const corsOptions = {
  origin: "http://localhost:5173",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
};
app.use( cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Allow cookies
}));
// app.use(router);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
// Mount role and permission routes
app.use("/api/roles", roleRouter);
app.use("/api/permissions", permissionRouter);

 



// User.sync();
app.listen(7000, () => {
    console.log(`server is runing on port ${7000}`);
    // connectDB();
  });