import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String, required: true }], // e.g:  ['CREATE', 'DELETE']
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Role = models.Role || model("Role", roleSchema);
