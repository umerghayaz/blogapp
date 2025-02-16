 import { useState,useEffect } from 'react'
import {BrowserRouter, Routes, Route,Router} from 'react-router-dom'
import { Button, Flex } from 'antd';
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import axios from 'axios';
import RoleManagement from './components/RoleManagement';
import UserManagement from './components/UserManagement';
import LoginDumy from './components/LoginDumy';
import UsersPage from './components/UsersPage';
import Sidebar from './components/Sidebar';
import { useLocation } from "react-router-dom";
import BlogPage from './components/BlogPage';
import SingleBlogPage from './components/SingleBlogPage';
import BlogControl from './components/BlogControl';
import ProtectedRoute from './components/ProtectedRoute';
import PostForm from './components/PostForm';

function App() {
   
  return (
    <Routes>
      {/* Login Route without Sidebar */}
      <Route path="/login" element={<LoginDumy />} />
      <Route path="/" element={<BlogPage />} />
      <Route path="/blog/:id" element={<SingleBlogPage />} />
      <Route path='/create-post' element= {<PostForm/>}/>
      {/* Protected Routes (With Sidebar) */}
      <Route
  path="/admin/*"  // ✅ Add a wildcard "*" to allow child routes to render
  element={
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 z-0">
          <div className=" inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
        <Routes>
            <Route path="users" element={<UsersPage />} />  {/* ✅ No leading "/" */}
            <Route path="blogcontrol" element={<BlogControl />} />  {/* ✅ No leading "/" */}
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  }
/>

    </Routes>
   
  )
}

export default App