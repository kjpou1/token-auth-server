import * as middlewares from "./middlewares/middlewares.ts";
import routes from "./routes/routes.ts";
import { Application, log, oakCors } from "./utils/deps.ts";
import { ensureEnvironment } from "./utils/utils.ts";

ensureEnvironment();

const app = new Application();
const LOCATION = new URL(Deno.env.get("URI") || "http://localhost:3001");
const HOST_NAME = LOCATION.hostname;
const PORT = +LOCATION.port;

const controller = new AbortController();
const { signal } = controller;

const startGracefulShutdown = () => {
  log.info("Starting shutdown of server...");
  controller.abort();
};

Deno.addSignalListener("SIGINT", startGracefulShutdown);

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"), // "INFO"
  },
  loggers: {
    default: {
      level: "DEBUG", // "INFO"
      handlers: ["console"],
    },
  },
});

app.addEventListener("error", (event) => {
  log.error(event.error);
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  // if (!hostname || hostname === "0.0.0.0" || "::1") {
  //   hostname = "localhost";
  // }
  const location = {
    href: `${secure ? "https://" : "http://"}${hostname}:${port}`,
    hostname: hostname,
    protocol: `${secure ? "https://" : "http://"}`,
    secure,
  };
  Deno.env.set("location", JSON.stringify(location));
  log.info("################################################");
  log.info(
    `🚀  Server Listening on: ${location.href}`,
  );
  log.info("################################################");
});

// If you use the default options, it will work as both origin: true and credentials: true.
app.use(
  oakCors({
    credentials: true,
    origin: /^.+localhost:(3000|3008|8080)$/,
  }),
);

app.use(middlewares.setContentType);
app.use(middlewares.errorMiddleware);
app.use(middlewares.loggerMiddleware);
app.use(middlewares.timingMiddleware);
app.use(middlewares.bearerAuthMiddleware);
app.use(middlewares.httpOnlyCookieAuthMiddleware);

app.use(routes.routes());
app.use(routes.allowedMethods());
app.use(middlewares.notFoundMiddleware);

if (import.meta.main) {
  log.info(`Starting CORS-enabled server on ${PORT}....`);
  await app.listen({
    hostname: HOST_NAME,
    port: PORT,
    signal,
  });
  log.info(`Server shut down....`);
  Deno.exit(0);
}
