import express, { Express } from "express";
import router from "./routes/index.js";
import routerDB from "./routes/database_tests.js";
import cors from "cors";
import config from "./config.js";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import passport from "passport";
import middleware from "./routes/auth.js";
import "./middleware/oauth.js";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(cors({origin:'*'}));
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
