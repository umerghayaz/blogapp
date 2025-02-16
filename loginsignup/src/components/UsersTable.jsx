import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Modal, Form, Input, Button ,Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getUserByID,editUser,deleteUser } from "../redux/actions/userAction";
import { ExclamationCircleFilled } from '@ant-design/icons';

const UsersTable = () => {
  const { allUsers, user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [userID, setUserId] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [form] = Form.useForm(); // Create a form instance
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [role, setRole] = useState(""); // State for the role dropdown
  const [idValue, setIdValue] = useState("");

  const showEditModal = async (id) => {
    try {
      await dispatch(getUserByID(id)); // Fetch user by ID
      setOpen(true); // Open the modal after dispatch
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const showModal = (id) => {
    setOpen1(true);
    setUserId(id)
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
      dispatch(deleteUser(userID))
      console.log("Deleting user with ID:");
      await dispatch(getAllUsers());
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      hideDeleteModal();
    }
  }
  useEffect(() => {
    console.log('idValue',idValue)
  }, [setIdValue,idValue]);

  const handleRoleChange = (value) => {
    setRole(value); // Update the selected role
    if (value === "Admin") {
      setIdValue("678e8d294733b11ba04f2d16");
  } else if (value === "Guest") {
    setIdValue("678fea167acec4ca56115376");
    } 
    else if (value === "Editor") {
      setIdValue("678fea267acec4ca56115378");
    }
    // setIdValue(idValue); // Update local state
    form.setFieldsValue({ idValue: idValue }); // Update Ant Design Form
  };
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (allUsers) {
      const filtered = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    function getCookie(cName) {
      const name = cName + "=";
      const cDecoded = decodeURIComponent(document.cookie); //to be careful
      const cArr = cDecoded.split('; ');
      let res;
      cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
      })
      return res
    }
    const refreshToken = getCookie("refreshToken");
    console.log("Refresh Token:", refreshToken);
    
    const fetchAllUsers = async () => {
      try {
        await dispatch(getAllUsers());
      } catch (error) {
        console.error("Error fetching users:", error);
      } 
    };
    fetchAllUsers();
  }, [dispatch]);

  useEffect(() => {
    if (allUsers && Array.isArray(allUsers)) {
      setFilteredUsers(allUsers); // Update the filtered list when allUsers changes
    }
  }, [allUsers]);

  useEffect(() => {
    // Update form fields when `user` changes
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.roles?.[0]?.roleName || "",
        _id: user._id,
        idValue:user.roles?.[0]?.roleId || ""
      });
    }
  }, [user, form,idValue]);

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
              console.log('values',values)
              dispatch(editUser(values))
              hideModal();
              // dispatch(getAllUsers())

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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter the user's name",
              },
            ]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>

          <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: "Please select a role" }]}
      >
        <Select
          placeholder="Select Role"
          value={role || user?.roles?.[0]?.roleName} // Set default value correctly
          onChange={handleRoleChange} // Dynamically update role value
        >
          <Select.Option value="Admin">Admin</Select.Option>
          <Select.Option value="Editor">Editor</Select.Option>
          <Select.Option value="Guest">Guest</Select.Option>
        </Select>
      </Form.Item>
          <Form.Item label="_id" name="_id" hidden>
            <Input placeholder="Enter user role" />
          </Form.Item>
          <Form.Item
        label="ID"
        name="idValue" 
        value={idValue}     
      >
        <Input
          value={idValue}
          name="idValue"
          placeholder="Enter ID"
          onChange={(e) => {
            setIdValue(e.target.value); // Update local state
          }}        />
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                    {user?.roles?.[0]?.roleName || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => showEditModal(user._id)}
                  >
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-300" onClick={() => showModal(user._id)}>
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

export default UsersTable;
