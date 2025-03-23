import express from 'express';
import authController from '../Controllers/authController.js';
const authRouter = express.Router();


authRouter.post("/isadmin", authController.isAdmin);

export default authRouter;