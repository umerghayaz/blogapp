import { Permission } from "../model/Permission.model";


// Create a new permission
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const permission = await Permission.create({ name, description });
    res.status(201).json({ message: "Permission created successfully", permission });
  } catch (error) {
    res.status(500).json({ message: "Error creating permission", error: error.message });
  }
};

// Get all permissions
export const getPermission =  async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching permissions", error: error.message });
  }
};

// Delete a permission
export const deletePermission =  async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) return res.status(404).json({ message: "Permission not found" });
    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting permission", error: error.message });
  }
};

