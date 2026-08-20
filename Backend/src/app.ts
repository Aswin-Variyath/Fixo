import express from "express";
import {errorMiddleware} from "./shared/middlewares/error.middleware";
import { userRouter } from "./modules/users";
import { authRoutes } from "./modules/auth";
import cookieParser from "cookie-parser";
import cors from 'cors'
import { ENV } from "./config/env.config";

const app = express();

app.use(cors({
  origin: ENV.APP.FRONTEND_URL,
  credentials:true
}))

app.use(cookieParser())
app.use(express.json());
// app.use((req, _res, next) => {
//   console.log("METHOD:", req.method);
//   console.log("CONTENT TYPE:", req.headers["content-type"]);
//   console.log("BODY:", req.body);
//   next();
// });






app.use("/auth", authRoutes)
app.use("/users",userRouter);


app.use(errorMiddleware);

export default app;