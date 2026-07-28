import express from "express";
import {errorMiddleware} from "./shared/middlewares/error.middleware";
import { userRouter } from "./modules/users";
import { authRoutes } from "./modules/auth";
import cookieParser from "cookie-parser";
import { AuthMiddleware } from "./modules/auth/middlewares/auth.middleware";
import { IAuthMiddleWare } from "./modules/auth/interfaces/auth-middleware.interface";
import { container, TYPES } from "./di";
import { success } from "zod";
import router from "./modules/users/routes/user.routes";

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use((req, _res, next) => {
  console.log("METHOD:", req.method);
  console.log("CONTENT TYPE:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  next();
});
const authMiddleware = container.get<IAuthMiddleWare>(TYPES.AuthMiddleware);

// For testing routes=======================
app.get("/test",authMiddleware.authenticate,(req,res)=>{
  res.json({
    success:true,
    message:"Authenitacated"
  })
})

app.get("/me",authMiddleware.authenticate,(req,res)=>{
  res.status(200).json({
    success:true,
    user:req.user
  })
})

// For testing routes=======================



app.use("/users",userRouter);
app.use("/auth", authRoutes)


app.use(errorMiddleware);

export default app;