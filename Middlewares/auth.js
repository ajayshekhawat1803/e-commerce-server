import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/keys.js";
import userModel from "../Models/userModel.js";

export const loginCheck = (req, res, next) => {
    try {
        let token = req.headers.token;
        token = token.replace("Bearer ", "");
        let decodedData = jwt.verify(token, JWT_SECRET);
        req.userDetails = decodedData;
        next();
    } catch (error) {
        res.json({ error: "You must be logged in !!!" })
    }
}

export const isAuth = (req, res, next) => {
    let { loggedInUserId } = req.body;
    if (
        !loggedInUserId ||
        !req.userDetails._id ||
        loggedInUserId != req.userDetails._id
    ) {
        res.status(403).json({ error: "You are not authenticated" });
    }
    next();
};

export const isAdmin = async (req, res, next) => {
    try {

        let reqUser = await userModel.findById(req.body.loggedInUserId);
        console.log("-----------==========");
        // If user role 0 that's mean not admin it's customer
        if (reqUser.userRole === 0) {
            res.status(403).json({ error: "Access denied" });
        }
        next();
    } catch {
        res.status(404);
    }
};