import { Application, log, oakCors } from "./utils/deps.ts";
import { ensureEnvironment } from "./utils/utils.ts";
import routes from "./routes/routes.ts";
import * as middlewares from "./middlewares/middlewares.ts";

ensureEnvironment();

const app = new Application();
const LOCATION = new URL(Deno.env.get("URI") || "http://localhost:8001");
const HOST_NAME = LOCATION.hostname;
const PORT = +LOCATION.port;


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
  if (!hostname || hostname === "0.0.0.0") {
    hostname = "localhost";
  }
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
    origin: /^.+localhost:(3000|4200|8080)$/,
  }),
);

// app.use(async (ctx, next) => {
//   ctx.response.headers.set('Access-Control-Allow-Origin', '*');
//   ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   await next();
// })

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
    port: PORT,
  });
}
