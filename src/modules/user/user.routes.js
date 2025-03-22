import { Router } from "express";
import * as controller from "./user.controller.js";
import * as middleware from "../../middlewares/index.middlewares.js";
import { systemRoles, systemPermissions } from "../../utils/index.utils.js";
const userRouter = Router();

userRouter.get(
  "/getMe",
  middleware.authenticateUser,
  middleware.authorizeRole(
    systemRoles.Admin,
    systemRoles.Editor,
    systemRoles.Viewer
  ),
  middleware.authorizePermission(systemPermissions.Read),
  controller.me
);

export { userRouter };
