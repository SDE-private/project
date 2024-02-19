import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import session from "express-session";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import config from "./config.js";
import middleware from "./routes/auth.js";
import routerDB from "./routes/database_tests.js";
import router from "./routes/index.js";

const app: Express = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(
  session({
    secret: "sde",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", middleware);
app.use("/", router);
app.use("/db", routerDB);
app.use(
  "/api-docs",
  swaggerUi.serveFiles(config.swagger_specs),
  swaggerUi.setup(config.swagger_specs),
);

export default app;
