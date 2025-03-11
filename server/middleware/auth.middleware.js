import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import express from "express";
import db from "../model/modelindex.js";

const app = express()
app.use(cookieParser());
const User = db.User;

export const protectRoute = async (req, res, next) => {
  try {
    // const accessToken = req.cookies.accessToken;
    // const authHeader = req.headers["authorization"];
    // const accessToken = authHeader.split(" ")[1];
    // console.log( 'inside cookies',req.cookies);
    
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findOne({
        where: { id: decoded.userId },
        attributes: { exclude: ["password"] }, // Exclude password from the result
      });
      // console.log('user',user)
            if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.dataValues.roleId === 1) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
