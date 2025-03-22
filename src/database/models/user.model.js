import mongoose from "mongoose";
import { createHash } from "../../utils/index.utils.js";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      minLength: 6,
      maxLength: 100,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: 8,
      maxLength: 100,
      required: true,
      select: false,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
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
    versionKey: false,
  }
);

// Pre-save middleware
userSchema.pre("save", async function (next) {
  // Hash password only if modified
  if (!this.isModified("password")) return next();
  this.password = await createHash(this.password);

  next();
});


/*
// to create populate role fild
userSchema.pre(/^find/, function (next) {
  this.populate({ path: "role", select: "name permissions" });
  next();
});
*/

export const User = models.User || model("User", userSchema);
