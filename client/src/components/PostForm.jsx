import { useState } from "react";
import { Form, Input, Button, Card, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/actions/postAction";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user, singleUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    let payload = {
      title: values.title,
      content: values.content,
      categories: values.category,
      featuredImage: values.image,
      author: singleUser?._id,
    };
    await dispatch(createPost(payload));
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <Header />
      <div className="flex flex-1 justify-center items-center p-6">
        <Card className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-gray-800">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Create a New Post</h2>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<span className="font-semibold text-gray-300">Title</span>}
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input
                placeholder="Enter post title"
                className="rounded-lg bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-gray-300">Content</span>}
              name="content"
              rules={[{ required: true, message: "Please enter post content" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Write your post here..."
                className="rounded-lg bg-gray-700 text-white placeholder-gray-400 border-none resize-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-gray-300">Category</span>}
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select category"
                className="rounded-lg bg-gray-700 text-white placeholder-gray-400"
                dropdownStyle={{ backgroundColor: '#1f2937', color: '#ffffff' }}
              >
                <Select.Option value="Technology">Technology</Select.Option>
                <Select.Option value="Entertainment">Entertainment</Select.Option>
                <Select.Option value="Sports">Sports</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-gray-300">Image URL</span>}
              name="image"
              rules={[{ required: true, message: "Please enter an image URL" }]}
            >
              <Input
                placeholder="Enter image URL"
                className="rounded-lg bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold"
              >
                Submit Post
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default PostForm;
