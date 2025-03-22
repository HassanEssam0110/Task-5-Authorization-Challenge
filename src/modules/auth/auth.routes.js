import Router from "express";
import * as middleware from "../../middlewares/index.middlewares.js";
import * as controller from "./auth.controller.js";
import * as schema from "./auth.schema.js";
import { checkDuplicateUser, addDefaultRole } from "./auth.utils.js";

const authRouter = Router();

authRouter.post(
  "/register",
  middleware.validator(schema.registerSchema),
  checkDuplicateUser,
  addDefaultRole,
  controller.register
);

authRouter.post(
  "/login",
  middleware.validator(schema.loginSchema),
  controller.login
);

export { authRouter };
