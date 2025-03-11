import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../Controllers/postController.js";
import { protectRoute,adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all posts
router.get("/", protectRoute ,adminRoute,getAllPosts);

// Get a single post by ID
router.get("/:id", getPostById);

// Create a new post
router.post("/",protectRoute, createPost);

// Update a post by ID
router.put("/:id",protectRoute,adminRoute , updatePost);

// Delete a post by ID
router.delete("/:id",protectRoute,adminRoute , deletePost);

export default router;
