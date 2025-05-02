import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getSinglePost } from "../redux/actions/postAction";
import { motion } from "framer-motion";
import Header from "./Header";

const SingleBlogPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loading, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getSinglePost(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-300 bg-gradient-to-b from-gray-800 to-gray-900">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg mt-10">
        Error: {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        Post not found.
      </div>
    );
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toDateString();
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-6 py-16"
      >
        <h1 className="text-5xl font-extrabold text-white text-center mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-sm text-gray-400 text-center mb-8">
          Published on {formatDate(post.createdAt)}
        </p>

        <div className="flex justify-center">
          <motion.img
            src={post.featuredImage}
            alt={post.title}
            className="w-full max-h-[500px] object-cover rounded-2xl shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="mt-10 text-lg text-gray-300 leading-loose px-2 md:px-8 text-justify">
          {post.content}
        </div>

        <div className="flex justify-center mt-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="w-52 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-full text-white text-lg font-semibold shadow-lg transition-all duration-300"
          >
            ← Back to Blog
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SingleBlogPage;
