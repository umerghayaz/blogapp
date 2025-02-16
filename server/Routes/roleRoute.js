import { createRole,deleteRole,getRole, } from "../Controllers/roleController";
import express from "express"
const router = express.Router();
router.post("/createRole", createRole);
router.get("/getRole",getRole),
router.delete("/deleteRole",deleteRole);

export default router;

