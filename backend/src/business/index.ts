import express, { Express } from "express";
import router from "./routes/index.js";
import routerDB from "./routes/database_tests.js"
import cors from "cors";
import config from "./config.js";
import swaggerUi from "swagger-ui-express";

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/", router);
app.use("/db-tests", routerDB)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(config.swagger_specs));

export default app;
