import express from "express";
import {errorMiddleware} from "./shared/middlewares/error.middleware";
import { userRouter } from "./modules/users";
import { authRoutes } from "./modules/auth";

const app = express();

app.use(express.json());

app.use((req, _res, next) => {
  console.log("METHOD:", req.method);
  console.log("CONTENT TYPE:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  next();
});

app.use("/users",userRouter);
app.use("/auth", authRoutes)


app.use(errorMiddleware);

export default app;