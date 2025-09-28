import Hapi from "@hapi/hapi";

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0",
});

server.route({
  method: "GET",
  path: "/",
  handler: () => {
    return "Hello World!";
  }
});

export const init = async () => {
  await server.initialize();
  return server;
};

export const start = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});
