import Hapi from "@hapi/hapi";

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0",
});

server.route([
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
]);

export const init = async () => {
  await server.initialize();
  return server;
};

process.on("unhandledRejection", (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});
