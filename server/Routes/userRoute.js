import express from "express";
import  {signup,login,getProfile,refreshToken,getAllUser,editProfile, deleteUser, getUserById, logout}  from "../Controllers/userController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// import signup from "./"
const router = express.Router();
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
router.get("/profile", getProfile);
router.post("/refresh-token", refreshToken);
router.get("/getAllUser", getAllUser);
router.put("/:id", editProfile); // Update a specific post
router.delete("/:id", deleteUser); // Update a specific post
router.get("/:id", getUserById); // Update a specific post


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
  });
export default router;