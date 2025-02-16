import { Role } from "../model/role.model";

export const createRole  =  async (req, res) => {
    try {
      const { name, description } = req.body;
      const role = await Role.create({ name, description });
      res.status(201).json({ message: "Role created successfully", role });
    } catch (error) {
      res.status(500).json({ message: "Error creating role", error: error.message });
    }
  };
  
  // Get all roles
  export const getRole  =  async (req, res) => {
    try {
      const roles = await Role.find();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching roles", error: error.message });
    }
  };
  
  // Delete a role
  export const deleteRole = async (req, res) => {
    try {
      const role = await Role.findByIdAndDelete(req.params.id);
      if (!role) return res.status(404).json({ message: "Role not found" });
      res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting role", error: error.message });
    }
  }