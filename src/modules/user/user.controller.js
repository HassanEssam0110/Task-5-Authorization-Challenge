import { asyncHandler } from "../../middlewares/index.middlewares.js";
import { User } from "../../database/models/index.models.js";
import { AppError, sanitizeUser } from "../../utils/index.utils.js";

// Only admins can change user roles
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { newRoleName, userId } = req.body;

  // Ensure only admins can assign roles
  if (req.user.role !== "admin" || req.user._id === userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Get the role document
  const role = await Role.findOne({ name: newRoleName });
  if (!role) return next(new AppError(404, "Role not found."));

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { role: role._id },
    { new: true }
  );
  if (!user) return next(new AppError(404, "User not found."));

  return res.status(200).json({ status: "success", user });
});

// Get current user
const me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("role");
  if (!user) return next(new AppError(404, "User not found."));
  res
    .status(200)
    .json({ status: "success", data: { user: sanitizeUser(user) } });
});

// todo update user data
// todo delete user

export { updateUserRole, me };
