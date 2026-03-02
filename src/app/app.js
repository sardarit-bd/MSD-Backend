import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "../middleware/error.middleware.js";
import authRoutes from "../modules/auth/auth.route.js";
import nodeRoutes from "../modules/node/node.route.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/nodes", nodeRoutes);

app.use(errorHandler);

export default app;