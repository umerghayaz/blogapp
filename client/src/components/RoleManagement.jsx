import React, { useState, useEffect } from "react";
import { getRoles, getPermissions } from "../services/api";
const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    const response = await getRoles();
    setRoles(response.data);
  };

  const fetchPermissions = async () => {
    const response = await getPermissions();
    console.log(response.data)
    setPermissions(response.data);
  };

  return (
    <div>
      <h2>Role Management</h2>
      <div>
        <h3>Roles</h3>
        {roles.map((role) => (
          <p key={role._id}>
            <strong>{role.name}</strong>: {role.description}
          </p>
        ))}
      </div>
      <div>
        <h3>Permissions</h3>
        {permissions.map((permission) => (
            console.log('inside',permission),
          <p key={permission._id}>
            <strong>{permission.name}</strong>: {permission.description}
          </p>
        ))}
      </div>
    </div>
  );
};

export default RoleManagement;
