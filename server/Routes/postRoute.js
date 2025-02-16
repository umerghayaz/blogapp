import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  approvePost,
  addComment,
} from "../Controllers/postController.js";

const router = express.Router();

router.post("/", createPost); // Create a new post
router.get("/", getAllPosts); // Get all posts
router.get("/:id", getPostById); // Get a specific post by ID
router.put("/:id", updatePost); // Update a specific post
router.delete("/:id", deletePost); // Delete a specific post
router.patch("/:id/approve", approvePost); // Approve a post
router.post("/:id/comments", addComment); // Add a comment to a post

export default router;
