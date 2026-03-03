import express, { json } from "express";
import cors from 'cors';
import router from "./routes";
import cookieParser from 'cookie-parser';

function createApp() {
    const app = express();

    app.use(cookieParser());

    app.use(cors({
        origin: ['https://seu-frontend.onrender.com', 'http://localhost:5173'],
        credentials: true
    }));

    app.use(json());

    app.use('/api', router);

    return app;
}

export default createApp;