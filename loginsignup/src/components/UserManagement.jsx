import React, { useState, useEffect } from "react";
import {
  getUsers,
  getRoles,
  createUser,
  updateUserRoles,
  deleteUser,
} from "../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", roles: [] });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const response = await getUsers();
    setUsers(response.data);
  };

  const fetchRoles = async () => {
    const response = await getRoles();
    setRoles(response.data);
  };

  const handleCreateUser = async () => {
    await createUser(newUser);
    fetchUsers();
    setNewUser({ username: "", email: "", roles: [] });
  };

  const handleUpdateRoles = async (userId, roles) => {
    await updateUserRoles(userId, { roles });
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    fetchUsers();
  };

  return (
    <div>
      <h2>User Management</h2>

      {/* Create User Form */}
      <div>
        <h3>Create User</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          multiple
          value={newUser.roles}
          onChange={(e) =>
            setNewUser({ ...newUser, roles: [...e.target.selectedOptions].map((o) => o.value) })
          }
        >
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      {/* User List */}
      <div>
        <h3>User List</h3>
        {users.map((user) => (
          <div key={user._id}>
            <p>
              <strong>{user.username}</strong> ({user.email})
            </p>
            <p>Roles: {user.roles.map((role) => role.name).join(", ")}</p>
            <select
              multiple
              value={user.roles.map((role) => role._id)}
              onChange={(e) =>
                handleUpdateRoles(user._id, [...e.target.selectedOptions].map((o) => o.value))
              }
            >
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
