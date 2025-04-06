 import { useState } from "react";
import { Form, Input, Button, Card, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/actions/postAction";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { user,singleUser } = useSelector((state) => state.user);
    const navigate = useNavigate()
    const onFinish = async (values) => {
        console.log('user id',singleUser?._id)
        let payload = {
            title: values.title,
            content: values.content,
            categories: values.category,  // Fixed this key
            featuredImage: values.image,
            author: singleUser?._id,  // Added safe check
        };
        dispatch(createPost(payload));
        navigate('/')
    };

    return (
        <div>
        <div>
        <Header/>
        </div>
        <div className="flex justify-center items-center py-10 bg-gray-100">  
            <Card className="w-[450px] shadow-md rounded-xl p-5 bg-white">
                <h2 className="text-xl font-semibold text-center mb-3">Create a Post</h2>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter a title" }]}
                    >
                        <Input placeholder="Enter post title" />
                    </Form.Item>

                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: "Please enter post content" }]}
                    >
                        <Input.TextArea rows={3} placeholder="Write your post here..." className="max-h-32" />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: "Please select a Category" }]}
                    >
                        <Select placeholder="Select Category">
                            <Select.Option value="Technology">Technology</Select.Option>
                            <Select.Option value="Entertainment">Entertainment</Select.Option>
                            <Select.Option value="Sports">Sports</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Image URL"
                        name="image"
                        rules={[{ required: true, message: "Please enter an image URL" }]}
                    >
                        <Input placeholder="Enter image URL" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600"
                        >
                            Submit Post
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div></div>
    );
};

export default PostForm;
