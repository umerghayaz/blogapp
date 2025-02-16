import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Role name is required"],
        unique: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },
    { timestamps: true }
  );
  
  export const Role = mongoose.model("Role", roleSchema);
  