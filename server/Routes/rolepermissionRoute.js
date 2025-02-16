import { getRolePermission, deleteRolePermission, createRolePermission } from "../Controllers/rolepermissionController";
import express from "express";
const router = express.Router();
router.get("/getRolePermission", getRolePermission);
router.delete("/deleteRolePermission", deleteRolePermission);
router.post("/createRolePermission", createRolePermission);
export default router;