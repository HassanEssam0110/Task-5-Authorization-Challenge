import Joi from "joi";
import { Types } from "mongoose";

const validId = (value, helpers) => {
  return Types.ObjectId.isValid(value) ? value : helpers.error("any.invalid");
};

const generalRoles = {
  // ?==> id validation
  id: Joi.string().custom(validId).trim().messages({
    "string.base": "ID must be a string.",
    "string.empty": "ID cannot be empty.",
    "any.invalid": "Invalid ID format.",
  }),

  // ?==> soft delete roles
  softDelete: Joi.string().valid("true", "false").messages({
    "any.only": "softDelete must be 'true' or 'false'.",
  }),

  // ?==> User Roles
  username: Joi.string().min(6).max(100).trim().messages({
    "string.base": "Username must be a string.",
    "string.empty": "Username is required.",
    "string.min": "Username must be at least 6 characters long.",
    "string.max": "Username must not exceed 100 characters.",
    "any.required": "Username is required.",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .trim()
    .messages({
      "string.base": "Email must be a string.",
      "string.empty": "Email is required.",
      "string.email": "Invalid email format.",
      "any.required": "Email is required.",
    }),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .trim()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
      "string.pattern.base":
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Password and confirm password must match.",
    "any.required": "Confirm password is required.",
  }),

  // ?==> Roles Sytem roles
  roleName: Joi.string().min(3).max(75).trim().messages({
    "string.base": "Role name must be a string.",
    "string.empty": "Role name is required.",
    "string.min": "Role name must be at least 3 characters long.",
    "string.max": "Role name must not exceed 55 characters.",
    "any.required": "Role name is required.",
  }),
  rolePermissions: Joi.array()
    .items(Joi.string().min(3).max(75).trim())
    .min(1)
    .messages({
      "array.base": "Permissions must be an array.",
      "array.empty": "Permissions are required.",
      "array.min": "At least one permission is required.",
      "string.base": "Permission must be a string.",
      "string.empty": "Permission is required.",
      "string.min": "Permission must be at least 3 characters long.",
      "string.max": "Permission must not exceed 55 characters.",
      "any.required": "Permission is required.",
    }),

  // ?==> Book Roles
  title: Joi.string().min(3).max(150).trim().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 2 characters long.",
    "string.max": "Title must not exceed 200 characters.",
    "any.required": "Title is required.",
  }),
  author: Joi.string().min(3).max(150).trim().messages({
    "string.base": "Author name must be a string.",
    "string.empty": "Author name is required.",
    "string.min": "Author name must be at least 2 characters long.",
    "string.max": "Author name must not exceed 200 characters.",
    "any.required": "Author name is required.",
  }),
  publishedDate: Joi.date().iso().messages({
    "date.base": "Published date must be a valid date.",
    "date.format": "Published date must be in ISO 8601 format (YYYY-MM-DD).",
    "any.required": "Published date is required.",
  }),
};

export { generalRoles };
/*
 // ?==> User Roles
  username: Joi.string().min(6).max(55).trim().messages({
    "string.base": "Username must be a string.",
    "string.empty": "Username is required.",
    "string.min": "Username must be at least 6 characters long.",
    "string.max": "Username must not exceed 55 characters.",
    "any.required": "Username is required.",
  }),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .trim()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
      "string.pattern.base":
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
    }),

  repeat_password: Joi.any().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match.",
  }),

  role: Joi.string()
    .valid(...Object.values(roles))
    .messages({
      "any.only": "Role must be 'admin', 'moderator', or 'user'.",
    }),


*/
