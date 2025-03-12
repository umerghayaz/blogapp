import db from "../model/modelindex.js";
import { QueryTypes } from "sequelize";
import {sequelize} from "../model/modelindex.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const User = db.User;
export const createUser = async(req, res) => {
  const user = req.body;

  try {
      const response = await User.create(user);
      
      if(!response) {
          res.status(500).json({message: "INTERNALE SERVER ERROR"})
      }
      res.status(201).json({message: "User Created"})
  } catch (error) {
      res.status(400).json(error)
  }
}
const setCookies = (res, accessToken, refreshToken) => {

  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: false, // Change to `true` in production
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60 * 1000, 

  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: false,
    secure: false, // Change to `true` in production
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60 * 1000, 
  });
};
export const getAllUser = async (req, res) => {
  try {
    let users = await sequelize.query(
      "SELECT users.id, users.name, users.email, users.createdAt, users.updatedAt, roles.roleName, roles.description,users.roleId FROM users INNER JOIN roles ON roles.id = users.roleId;",
      { type: sequelize.QueryTypes.SELECT }
    );
    if (!users) {
      return res.status(500).json({ message: "Users Not Found" });
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getAllUser:", error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Fetch user and role from database
    let [user] = await sequelize.query(
      "SELECT users.*, roles.roleName, roles.description FROM users INNER JOIN roles ON roles.id = users.roleId WHERE users.email = ?",
      { replacements: [email], type: sequelize.QueryTypes.SELECT }
    );

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    setCookies(res, accessToken, refreshToken);
    
    res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({error: error.message });
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
  const id = req.params.id;
  try {
    let [user] = await sequelize.query(
      "SELECT users.*, roles.roleName, roles.description FROM users INNER JOIN roles ON roles.id = users.roleId WHERE users.id = ?",
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );

    if (!user) {
      return res.status(404).json({ message: "User Not Found" }); // ✅ Added return to prevent further execution
    }

    return res.status(200).json({ 
      success: true,
      user
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async(req, res) => {
  const id = req.params.id;

  try {
      const user = await User.destroy({
      where: {
        id
      }
    });
      
      if(!user) {
          res.status(500).json({message: "User Not Found"})
      }
      res.status(201).json({user: user})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, roleId,name } = req.body; // Extract fields from request body

  try {
    // Find the user by ID
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare an object with fields that need updating
    const updateData = {};

    if (email) {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }

    if (password) {
      updateData.password = password
    }

    if (roleId) {
      updateData.roleId = roleId;
    }
    if (name) {
      updateData.name = name;
    }


    // Update only provided fields
    await user.update(updateData);

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      } catch (err) {
        console.log("Invalid Refresh Token:", err.message);
        return res.status(400).json({ message: "Invalid refresh token" });
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.json({ message: "Logged out successfully" });
    }

    return res.status(400).json({ message: "No refresh token found" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
