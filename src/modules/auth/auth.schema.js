import Joi from "joi";
import { generalRoles } from "../../utils/index.utils.js";

const registerSchema = {
  body: Joi.object({
    username: generalRoles.username.required(),
    email: generalRoles.email.required(),
    password: generalRoles.password.required(),
    confirmPassword: generalRoles.confirmPassword.required(),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: generalRoles.email.required(),
    password: generalRoles.password.required(),
  }),
};

export { registerSchema, loginSchema };
