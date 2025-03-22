import Joi from "joi";
import { generalRoles } from "../../utils/index.utils.js";

const createRoleSchema = {
  body: Joi.object({
    name: generalRoles.roleName.required(),
    permissions: generalRoles.rolePermissions.required(),
  }),
};

const getRoleSchema = {
  params: Joi.object({
    id: generalRoles.id.required(),
  }),
};

const updateRoleSchema = {
  params: Joi.object({
    id: generalRoles.id.required(),
  }),
  body: Joi.object({
    name: generalRoles.roleName.optional(),
    permissions: generalRoles.rolePermissions.optional(),
  }),
};

const deleteRoleSchema = {
  params: Joi.object({
    id: generalRoles.id.required(),
  }),
};

export { createRoleSchema, getRoleSchema, updateRoleSchema, deleteRoleSchema };
