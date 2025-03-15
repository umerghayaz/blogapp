import { QueryTypes } from "sequelize";
import db from "../model/modelindex.js"; // assuming this exports { sequelize, db }
const { sequelize } = db;
const Post = db.Post;

/**
 * Get all posts with author details
 */
export const getAllPosts = async (req, res) => {
  try {
    // Joining posts with users table to include author details
    const posts = await sequelize.query(
      `select posts.*, author.id as AuthorId, author.name as AuthorName,approver.id as ApproverId, approver.name as AuthorName from posts left join users as author on author.id = posts.authorId left join users as approver on approver.id = posts.approverId;`,
      {
        type: QueryTypes.SELECT,
      }
    );
    // You can get pagination parameters from the query string, for example:
    // const limit = parseInt(req.query.limit) || 10;
    // const offset = parseInt(req.query.offset) || 0;

    // // Use findAndCountAll to get both the rows and the total count.
    // const { count, rows } = await Post.findAndCountAll({
    //   where: { status: "draft" }, // Example condition; adjust as needed
    //   limit,
    //   offset,
    //   order: [["createdAt", "DESC"]],
    // });
    // const [post, created] = await Post.findOrCreate({
    //   where: { categories: 'draft1' },
    //   defaults: {
    //     title: 'My new Post',
    //     content:'This is the content of my awesome post. ',
    //     authorId:1
    //   },
    // });

    res.status(200).json({
      // created: created,
      posts: posts,
    });
    // res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single post by ID with author details
 */
export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await sequelize.query(
      `SELECT 
         posts.*,
         users.id AS authorId,
         users.name AS authorName,
         users.email AS authorEmail
       FROM posts 
       LEFT JOIN users ON posts.authorId = users.id
       WHERE posts.id = ? LIMIT 1`,
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    if (posts.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post: posts[0] });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new post
 * Expects: title, content, author (ID), categories, featuredImage in req.body
 */
export const createPost = async (req, res) => {
  const { title, content, author, categories, featuredImage } = req.body;
  try {
    const result = await sequelize.query(
      `INSERT INTO posts 
         (title, content, authorId, categories, featuredImage, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      {
        replacements: [title, content, author, categories, featuredImage],
        type: QueryTypes.INSERT,
      }
    );
    res.status(201).json({ message: "Post created successfully", postId: result[0] });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update an existing post by ID
 * Expects: title, content, categories, featuredImage, status in req.body
 */

export const updatePost = async (req, res) => {
  const { id } = req.params;
  let { title, content, categories, featuredImage, status ,approverId} = req.body;

  try {
    // Ensure all fields have a default value to avoid "undefined" errors
    categories = categories || ""; // Convert array to string if necessary
    title = title || "";
    content = content || "";
    featuredImage = featuredImage || null;
    status = status || "draft"; // Set a default status
    const post = await Post.findByPk(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const updateData = {};
    if (title) {
      updateData.title = title
    }
    if (content) {
      updateData.content = content
    }
    if (featuredImage) {
      updateData.featuredImage = featuredImage
    }
    if (categories) {
      updateData.categories = categories
    }
    if (status) {
      updateData.status = status
    }
    if (approverId) {
      updateData.approverId = approverId
    }
    
    await post.update(updateData);

    

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: error.message });
  }
};


/**
 * Delete a post by ID
 */
export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query(
      "DELETE FROM posts WHERE id = ?",
      {
        replacements: [id],
        type: QueryTypes.DELETE,
      }
    );
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: error.message });
  }
};
