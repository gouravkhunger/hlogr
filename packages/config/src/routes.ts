import Boom from "@hapi/boom";
import type { ServerRoute } from "@hapi/hapi";

const routes: ServerRoute[] = [
  {
    path: "/",
    method: "*",
    handler: (request) => {
      switch (request.method.toUpperCase()) {
        case "GET":
          return "Hello World!";
        case "POST":
          return { message: " Received POST request", data: request.payload };
        case "PUT":
          return { message: "Received PUT request", data: request.payload };
        case "DELETE":
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
    method: "GET",
    handler: (_, h) => {
      return h.response({ error: "Not Found" }).code(404);
    },
  },
];

export default routes;
