import express, { Express } from "express";
import router from "./routes/index.js";
import cors from "cors";
import config from "./config.js";
import swaggerUi from "swagger-ui-express";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use("/", router);

app.use("/api-docs", swaggerUi.serveFiles(config.swagger_specs), swaggerUi.setup(config.swagger_specs));

export default app;
