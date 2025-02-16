import React, { useEffect } from "react";
import { getAllPosts } from "../redux/actions/postAction";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "./Header";
import { motion } from "framer-motion";

const BlogPage = () => {
  const { allPosts, loading, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-xl text-gray-300">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-10">Error: {error}</div>;
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toDateString();
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <div className="relative flex flex-wrap justify-center overflow-hidden py-6 sm:py-12">
        <div className="max-w-screen-lg mx-auto py-4">
          <h2 className="font-extrabold text-center text-5xl text-white">Our Blog Posts</h2>
          <p className="text-center mt-4 text-gray-400 text-lg">Latest insights and stories</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {allPosts.length > 0 ? (
              allPosts.map((post) => (
                <motion.div
                  key={post._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-800 shadow-lg rounded-2xl overflow-hidden transition transform hover:shadow-2xl"
                >
                  <Link to={`/blog/${post._id}`}>
                    <motion.img
                      alt={post.title}
                      src={post.featuredImage}
                      className="h-64 w-full object-cover rounded-t-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  </Link>
                  <div className="p-6">
                    <time dateTime={formatDate(post.createdAt)} className="block text-xs text-gray-400">
                      {formatDate(post.createdAt)}
                    </time>
                    <Link to={`/blog/${post._id}`} className="hover:underline">
                      <h3 className="mt-2 text-xl text-white font-semibold">{post.title}</h3>
                    </Link>
                    <p className="mt-2 text-gray-400 line-clamp-3 text-sm">{post.content}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-lg text-gray-400">No posts available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
