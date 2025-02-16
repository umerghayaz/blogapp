import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Modal, Form, Input, Checkbox  ,Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, editlePost, getAllPosts, getSinglePost} from "../redux/actions/postAction";
import { ExclamationCircleFilled } from '@ant-design/icons';


const BlogControlTable = () => {
  const { singleUser } = useSelector((state) => state.user);
  const { allPosts, post, loading, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(true);
  const [open, setOpen] = useState(false);
  const [postID, setPostID] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [form] = Form.useForm(); // Create a form instance
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [role, setRole] = useState(""); // State for the role dropdown
  const [idValue, setIdValue] = useState("");
  const { TextArea } = Input;

  const showEditModal = async (id) => {
    try {
      setPostID(id);
      await dispatch(getSinglePost(id)); // Fetch singleUser by ID
      setOpen(true); // Open the modal after dispatch
    } catch (error) {
      console.error("Error fetching singleUser:", error);
    }
  };

  const showModal = (id) => {
    setOpen1(true);
    setPostID(id)
  }; 
  const hideModal = () => {
    setOpen(false);
    form.resetFields(); // Reset form fields when closing
  };
  const hideDeleteModal = () => {
    setOpen1(false);
  };

  const handleDelete = async () => {
    try {
      // Uncomment and use your actual delete action:
      // await dispatch(deleteUser(userToDelete));
      dispatch(deletePost(postID))
      console.log("Deleting singleUser with ID:");
      await dispatch(getAllPosts());
    } catch (error) {
      console.error("Error deleting singleUser:", error);
    } finally {
      hideDeleteModal();
    }
  }
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (allPosts) {
      const filtered = allPosts.filter(
        (singleUser) =>
          singleUser.name.toLowerCase().includes(term) ||
          singleUser.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };
  useEffect(() => {
    if (post) { // Ensure post is not undefined
      form.setFieldsValue({
        image: post.featuredImage || "",
        title: post.title || "",
        content: post.content || "",
        isApproved: post.isApproved ?? false,  // Ensure it's boolean
        status: post?.status || "",
      });
      console.log('singleUser',singleUser?._id)
    }
  }, [post, form,singleUser]);
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        await dispatch(getAllPosts());
      } catch (error) {
        console.error("Error fetching users:", error);
      } 
    };
    fetchAllUsers();
  }, [dispatch]);
    useEffect(() => {
      if (allPosts && Array.isArray(allPosts)) {
        setFilteredUsers(allPosts); // Update the filtered list when allUsers changes
      }
    }, [allPosts]);
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* delete modal */}
      <Modal
        title="Delete User"
        open={open1}
        onOk={handleDelete}
        onCancel={hideDeleteModal}
        okText="Yes"
        cancelText="No"
      >
        <p>Are You Sure You Want To Delete It?</p>
      
      </Modal>
      {/* Edit Modal  */}
      <Modal
        title="Edit User"
        open={open}
        onOk={
          () => {
          form
            .validateFields()
            .then((values) => {
            console.log('values',values,values.status)

             let payload = {
                "title": values.title,
                "content":values.content,
                "status": values.status,
                "categories": values.categories,
                "featuredImage": values.image,
                "isApproved": values.isApproved,
                "approvedBy":singleUser?._id,
                "postID": postID
              }
              console.log('payload',payload)

              dispatch(editlePost(payload))
              hideModal();
              dispatch(getAllPosts())

            })
            .catch((info) => console.error("Validation Failed:", info));
        }
      }
        onCancel={hideModal}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Image"
            name="image"
            rules={[
              {
                required: true,
                message: "Please enter the singleUser's name",
              },
            ]}
          >
            <Input placeholder="Enter singleUser name" />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                type: "title",
                message: "Please enter a valid title",
              },
            ]}
          >
            <Input placeholder="Enter singleUser title" />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[
              {
                required: true,
                type: "content",
                message: "Please enter  content",
              },
            ]}
          >
            <TextArea
                  showCount
                  maxLength={1000}
                  placeholder="Content"
                  style={{
                    height: 120,
                    resize: 'none',
                  }}
                />         
           </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a Status" }]}
           >
        <Select
          placeholder="Select Status"
          //value={} // Set default value correctly
          //onChange={} // Dynamically update role value
        >     
          <Select.Option value="draft">Draft</Select.Option>
          <Select.Option value="published">Published</Select.Option>
          <Select.Option value="archived">Archived</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
            name="isApproved"
            valuePropName="checked"
          >
     <Checkbox
      // checked={isChecked}
      // onChange={(e) => setIsChecked(e.target.checked)}
    >
      Approved
    </Checkbox>         
     </Form.Item>
        </Form>
      </Modal>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
       <table className="min-w-full divide-y divide-gray-700">
  <thead>
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
         Image
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
         Title
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
         Content
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
         Approved
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
        Status
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
        Approved By
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((posts) => (
              <motion.tr
                key={posts._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {posts?.featuredImage ? (
                    <img src={posts.featuredImage} alt="Featured" className="w-16 h-16 rounded-md object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                        {posts.title}    
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                {posts.content.split(" ").slice(0, 4).join(" ")}...
                  </td>
                 
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                  {posts?.isApproved ? "Approved" : "Pending"}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {posts.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {posts.approvedBy?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => showEditModal(posts._id)}
                  >
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-300" onClick={() => showModal(posts._id)}>
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BlogControlTable;
