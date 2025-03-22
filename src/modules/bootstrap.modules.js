import {
  NotFoundHandler,
  globalErrorHandler,
} from "../middlewares/index.middlewares.js";
import {
  authRouter,
  roleRouter,
  userRouter,
  bookRouter,
} from "./index.modules.js";

// Routes paths
const rotesArray = [
  { path: "/api/v1/auth", router: authRouter },
  { path: "/api/v1/roles", router: roleRouter },
  { path: "/api/v1/users", router: userRouter },
  { path: "/api/v1/books", router: bookRouter },
];


/**
 * Mounts an array of routes on the Express app.
 *
 * @param {Express.Application} app Express app
 * @param {Array<Object>} routes Array of route objects, each containing a
 *   'path' property and a 'router' property with an Express.Router instance.
 */
const mountRoutes = (app, routes) => {
  routes.forEach(({ path, router }) => {
    app.use(path, router);
  });
};

/**
 * Initializes the Express application by mounting routes, setting up a default
 * root endpoint, and registering global error handlers.
 *
 * @param {Express.Application} app - The Express application instance.
 */

const bootstrap = (app) => {
  // Mount Routes
  mountRoutes(app, rotesArray);

  app.get("/", (req, res, next) => {
    res.status(200).json({
      message: "Hello, World!",
    });
  });

  // Error Handlers
  app.use("*", NotFoundHandler);
  app.use(globalErrorHandler);
};

export default bootstrap;
