import express, { json } from "express";
import cors from 'cors';
import router from "./routes";

const app = express();

app.use(cors());
app.use(json());

app.use('/api', router);

app.get("/health", (_req, res) => res.status(200).send("ok"));

export default app;