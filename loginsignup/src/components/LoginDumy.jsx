import { React, useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/userAction";
import Header from "./Header";

const LoginDumy = () => {
  const { singleUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (singleUser?.roles?.some((role) => role.roleName === "Admin")) {
      navigate("/admin/blogcontrol");
    } else if (singleUser?.roles?.some((role) => role.roleName === "Guest")) {
      navigate("/blog");
    } else if (singleUser?.roles?.some((role) => role.roleName === "Editor")) {
      navigate("/blog");
    }
  }, [singleUser, navigate]);

  const onFinish = async (values) => {
    try {
      const resultAction = await dispatch(login(values));

      if (login.fulfilled.match(resultAction)) {
        setMessage("Logged in successfully!");
      } else if (login.rejected.match(resultAction)) {
        setMessage(resultAction.payload || "Failed to login - wrong credentials");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <Header />
      <section className="relative flex flex-wrap lg:h-screen lg:items-center">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>
            <p className="mt-4 text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque
              ipsa culpa autem, at itaque nostrum!
            </p>
          </div>

          {/* 🚀 Show Error Message Here */}
          {message && (
            <div className={`text-sm text-center p-2 mb-2 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}

          <Form name="loginForm" onFinish={onFinish} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
            <Form.Item name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
              <Input type="email" placeholder="Enter email" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
              <Input.Password placeholder="Enter password" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" />
            </Form.Item>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                No account?
                <a className="underline" href="#">Sign up</a>
              </p>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-56 bg-gray-900 px-5 py-4 text-white transition hover:bg-gray-700">
                  Sign in
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>

        <div className="hidden lg:block relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default LoginDumy;
