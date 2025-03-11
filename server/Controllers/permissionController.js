import db from "../model/modelindex.js";
const { Permission } = db;

// Create a new permission
export const createPermission = async (req, res) => {
  const { permissionName, description } = req.body;
  
  try {
    const permission = await Permission.create({ permissionName, description });
    res.status(201).json({ message: "Permission created successfully", permission });
  } catch (error) {
    console.error("Error creating permission:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json({ permissions });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single permission by ID
export const getPermissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findOne({ where: { id } });
    if (!permission) return res.status(404).json({ message: "Permission not found" });
    res.status(200).json({ permission });
  } catch (error) {
    console.error("Error fetching permission:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a permission by ID
export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { permissionName, description } = req.body;
  try {
    const [updatedRows] = await Permission.update(
      { permissionName, description },
      { where: { id } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Permission not found or no changes made" });
    }
    const updatedPermission = await Permission.findOne({ where: { id } });
    res.status(200).json({ message: "Permission updated successfully", permission: updatedPermission });
  } catch (error) {
    console.error("Error updating permission:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a permission by ID
export const deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Permission.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    console.error("Error deleting permission:", error);
    res.status(500).json({ error: error.message });
  }
};
