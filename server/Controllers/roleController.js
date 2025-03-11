import { Op } from "sequelize";
import db from "../model/modelindex.js"; // Import your db object containing User, Role, Permission, sequelize
const { Role, Permission } = db;

// Create a new role
export const createRole = async (req, res) => {
  const { roleName, description } = req.body;
  try {
    const role = await Role.create({ roleName, description });
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all roles (optionally with their permissions)
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: { model: Permission, as: "permissions", through: { attributes: [] } },
    });
    res.status(200).json({ roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single role by ID
export const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findOne({
      where: { id },
      include: { model: Permission, as: "permissions", through: { attributes: [] } },
    });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ role });
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a role by ID
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { roleName, description } = req.body;
  try {
    const [updatedRows] = await Role.update(
      { roleName, description },
      { where: { id } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Role not found or no changes made" });
    }
    const updatedRole = await Role.findOne({ where: { id } });
    res.status(200).json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a role by ID
export const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Role.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ error: error.message });
  }
};

// Assign permissions to a role (expects an array of permission IDs)
export const assignPermissionsToRole = async (req, res) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body; // e.g., [1, 2, 3]
  try {
    const role = await Role.findOne({ where: { id: roleId } });
    if (!role) return res.status(404).json({ message: "Role not found" });
    
    // Set the permissions (this will replace existing associations)
    await role.setPermissions(permissionIds);
    
    const updatedRole = await Role.findOne({
      where: { id: roleId },
      include: { model: Permission, as: "permissions", through: { attributes: [] } },
    });
    res.status(200).json({ message: "Permissions assigned successfully", role: updatedRole });
  } catch (error) {
    console.error("Error assigning permissions:", error);
    res.status(500).json({ error: error.message });
  }
};
