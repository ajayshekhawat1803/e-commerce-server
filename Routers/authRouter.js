import express from 'express';
import authController from '../Controllers/authController.js';
import { isAdmin, isAuth, loginCheck } from '../Middlewares/auth.js';
const authRouter = express.Router();


authRouter.post("/isadmin", authController.isAdmin);
authRouter.post("/signup", authController.postSignup);
authRouter.post("/signin", authController.postSignin);
authRouter.post("/user", loginCheck, isAuth, isAdmin, authController.allUser);
export default authRouter;