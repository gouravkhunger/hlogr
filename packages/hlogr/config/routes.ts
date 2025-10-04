import { type ServerRoute } from "@hapi/hapi";

export const routes: ServerRoute[] = [
  {
    path: "/",
    method: "GET",
    handler: () => "Hello World!",
  },
  {
    path: "/",
    method: "POST",
    handler: (request) => {
      const payload = request.payload;
      return { message: "Received POST request", data: payload };
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
