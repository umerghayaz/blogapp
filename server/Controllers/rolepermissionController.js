import { RolePermission } from "../model/RolePermission.model";
// Assign a permission to a role
export const createRolePermission = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;
    const rolePermission = await RolePermission.create({ role: roleId, permission: permissionId });
    res.status(201).json({ message: "Permission assigned to role", rolePermission });
  } catch (error) {
    res.status(500).json({ message: "Error assigning permission to role", error: error.message });
  }3
};
// Get all role-permission mappings
export const getRolePermission = async (req, res) => {
  try {
    const rolePermissions = await RolePermission.find()
      .populate("role", "name")
      .populate("permission", "name");
    res.status(200).json(rolePermissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching role-permission mappings", error: error.message });
  }
};

// Delete a role-permission mapping
export const deleteRolePermission = async (req, res) => {
  try {
    const rolePermission = await RolePermission.findByIdAndDelete(req.params.id);
    if (!rolePermission) return res.status(404).json({ message: "Mapping not found" });
    res.status(200).json({ message: "Mapping deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mapping", error: error.message });
  }
};

