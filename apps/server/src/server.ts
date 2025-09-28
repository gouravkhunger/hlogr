import Hapi from "@hapi/hapi";
import hlogr from "hlogr";

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0",
});

server.route({
  path: "/",
  method: "GET",
  handler: () => "Hello World!",
});

export const init = async () => {
  await server.initialize();
  return server;
};

export const start = async () => {
  await server.start();
  await server.register(hlogr);
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});
