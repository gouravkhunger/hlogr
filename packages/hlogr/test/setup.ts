import Hapi from "@hapi/hapi";
import { routes } from "@repo/config";

export const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "0.0.0.0",
  });
  server.route(routes);
  await server.initialize();
  return server;
};

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection");
  console.error(err);
  process.exit(1);
});
