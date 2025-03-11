import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
} from "../Controllers/roleController.js";
import { login } from "../Controllers/userController.js";

const router = express.Router();
router.post("/login", login);
router.post("/createRole", createRole);
router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

// Endpoint to assign permissions to a role (e.g., POST /roles/1/permissions)
router.post("/permissions/:roleId", assignPermissionsToRole);

export default router;
