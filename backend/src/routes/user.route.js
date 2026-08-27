import {Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controllers/user.controller.js";
import { validateLogin, validateRegister } from "../middlewares/validateRequest.js";

const userRouter = Router();

userRouter.post("/register", validateRegister, registerUser); 
userRouter.post("/login", validateLogin, loginUser);
userRouter.post("/logout", logoutUser); 

export default userRouter;