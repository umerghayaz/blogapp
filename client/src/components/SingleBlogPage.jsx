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
    return <div className="flex justify-center items-center h-screen text-lg text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-10">Error: {error}</div>;
  }

  if (!post) {
    return <div className="text-center text-gray-500 text-lg mt-10">Post not found.</div>;
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toDateString();
  }

  return (
    <div>
    <div>
<Header/>
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 min-h-screen  mx-auto px-6 py-18  shadow-2xl "
    >
      <h1 className="text-4xl font-extrabold text-white text-center mb-4">{post.title}</h1>
      <p className="text-sm text-gray-400 text-center">Published on {formatDate(post.createdAt)}</p>

 <div className="flex justify-center">
  <motion.img
    src={post.featuredImage}
    alt={post.title}
    className="h-96 object-cover rounded-2xl mt-6 shadow-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  />
</div>


      <div className="mt-6 text-lg text-gray-300 leading-relaxed px-4 flex justify-center">
        {post.content}
      </div>

      <div className="flex justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="w-56 bg-gray-800 px-5 py-4 text-white transition hover:bg-gray-700"        >
          ← Back to Blog
        </motion.button>
      </div>
    </motion.div>
    </div>
  );
};

export default SingleBlogPage;

