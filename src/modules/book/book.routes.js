import { Router } from "express";
import { systemRoles, systemPermissions } from "../../utils/index.utils.js";
import * as middleware from "../../middlewares/index.middlewares.js";
import * as controller from "./book.controller.js";
import * as schema from "./book.schema.js";

const bookRouter = Router();

bookRouter.use(middleware.authenticateUser);

bookRouter
  .route("/")
  // All can accress this router
  .get(
    middleware.authorizeRole(
      systemRoles.Admin,
      systemRoles.Editor,
      systemRoles.Viewer
    ),
    middleware.authorizePermission(systemPermissions.Read),
    controller.getAllBooks
  )
  // Both admin and manager can access this router
  .post(
    middleware.authorizeRole(systemRoles.Admin, systemRoles.Editor),
    middleware.authorizePermission(systemPermissions.Create),
    middleware.validator(schema.createBookSchema),
    controller.createBook
  );

bookRouter
  .route("/:id")
  // All can accress this router
  .get(
    middleware.authorizeRole(
      systemRoles.Admin,
      systemRoles.Editor,
      systemRoles.Viewer
    ),
    middleware.authorizePermission(systemPermissions.Read),
    middleware.validator(schema.getBookSchema),
    controller.getBook
  )
  // Both admin and manager can access this router
  .put(
    middleware.authorizeRole(systemRoles.Admin, systemRoles.Editor),
    middleware.authorizePermission(systemPermissions.Update),
    middleware.validator(schema.updateBookSchema),
    controller.updateBook
  )
  // only admin can access this router
  .delete(
    middleware.authorizeRole(systemRoles.Admin),
    middleware.authorizePermission(systemPermissions.Delete),
    middleware.validator(schema.deleteBookSchema),
    controller.deleteBook
  );

export { bookRouter };
