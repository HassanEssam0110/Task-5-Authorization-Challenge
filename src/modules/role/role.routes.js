import { Router } from "express";
import { systemRoles, systemPermissions } from "../../utils/index.utils.js";
import * as middleware from "../../middlewares/index.middlewares.js";
import * as controller from "./role.controller.js";
import * as schema from "./role.schema.js";

const roleRouter = Router();

roleRouter.use(
  middleware.authenticateUser,
  middleware.authorizeRole(systemRoles.Admin)
);

roleRouter
  .route("/")
  .get(
    middleware.authorizePermission(systemPermissions.Read),
    controller.getAllRoles
  )
  .post(
    middleware.authorizePermission(systemPermissions.Create),
    middleware.validator(schema.createRoleSchema),
    controller.createRole
  );

roleRouter
  .route("/:id")
  .get(
    middleware.authorizePermission(systemPermissions.Read),
    middleware.validator(schema.getRoleSchema),
    controller.getRole
  )
  .put(
    middleware.authorizePermission(systemPermissions.Update),
    middleware.validator(schema.updateRoleSchema),
    controller.updateRole
  )
  .delete(
    middleware.authorizePermission(systemPermissions.Delete),
    middleware.validator(schema.deleteRoleSchema),
    controller.deleteRole
  );

export { roleRouter };
