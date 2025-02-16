import User from "../model/user.model"
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { email, password, name,roles } = req.body;
    try {
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await User.create({ name, email, password,roles });
  
      // authenticate
      // const { accessToken, refreshToken } = generateTokens(user._id);
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
  
      setCookies(res, accessToken, refreshToken);
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      });
    } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ message: error.message });
    }
  };
  const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
      sameSite: 'strict',
      path: '/',
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      maxAge: 15 * 60 * 1000, // 15 minutes,

    });
    
    res.cookie("refreshToken", refreshToken, {
      sameSite: 'strict',
      path: '/',
      httpOnly: true, // prevent XSS attacks, cross site scripting attac
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

    });
  };
  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (user && (await user.comparePassword(password))) {
        const { accessToken, refreshToken } = generateTokens(user._id);
         setCookies(res, accessToken, refreshToken);
      
         res.status(200).json({
          success: true,
          message: "Login successfully",
          user,
        });
      } else {
        res.status(400).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.log("Error in login controller", error.message);
      res.status(500).json({ message: error.message });
    }
  };
  export const logout = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
      }
  
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  export const getAllUser = async (req, res) => {
    try {
      const user = await User.find({ });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Users not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Users found successfully",
        allUsers: user,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  export const getProfile = async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  export const editProfile = async (req, res) => {
    try {
     const usertId = req.params.id;
     const updates = req.body;
     const updateduser = await User.findByIdAndUpdate(usertId, updates, {
      new: true,
      runValidators: true,
    }).exec(); 
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user:updateduser
    });
     } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  export const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId).exec();
        if (!deletedUser) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
          User: deletedUser,
        });
     } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
  
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  
    return { accessToken, refreshToken };
  };
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};
  // this will refresh the access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      signed: true,

      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}