import Boom from "@hapi/boom";
import type { ServerRoute } from "@hapi/hapi";

const routes: ServerRoute[] = [
  {
    path: "/",
    method: "*",
    handler: (request) => {
      switch (request.method) {
        case "get":
          return "Hello World!";
        case "post":
          return { message: "Received POST request", data: request.payload };
        case "put":
          return { message: "Received PUT request", data: request.payload };
        case "delete":
          return { message: "Received DELETE request", data: request.payload };
        default:
          return { message: `Received ${request.method.toUpperCase()} request` };
      }
    },
  },
  {
    method: "*",
    path: "/error",
    handler: () => {
      throw Boom.internal("This is a generic error");
    },
  },
  {
    path: "/404",
    method: "*",
    handler: (_, h) => {
      return h.response({ error: "Not Found" }).code(404);
    },
  },
  {
    method: "*",
    path: "/{any*}",
    handler: (request) => {
      const messages = [
        { message: "No issues detected", success: true },
        { message: "Everything looks good!", status: "ok" },
        { message: "Operation completed", timestamp: new Date().toISOString() },
        { message: `Received ${request.method.toUpperCase()} request`, data: request.payload },
        Boom.notFound("This route does not exist"),
        Boom.badRequest("Invalid request parameters"),
        Boom.forbidden("Access to this resource is forbidden"),
        Boom.gatewayTimeout("The server took too long to respond"),
        Boom.notImplemented("This functionality is not implemented yet"),
        Boom.unauthorized("You are not authorized to access this resource"),
        Boom.conflict("There is a conflict with the current state of the resource")
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
  },
];

export default routes;
