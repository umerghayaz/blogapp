import { getPermission,deletePermission,createPermission } from "../Controllers/permissionController";
import express from "express"
const router = express.Router();
router.get("/getPermission", getPermission);
router.delete("/deletePermission", deletePermission);
router.post("/createPermission", createPermission);
export default router;