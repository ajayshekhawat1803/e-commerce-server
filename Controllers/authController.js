import { toTitleCase, validateEmail } from "../config/function.js";
import userModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config/keys.js";

class Auth {
    async isAdmin(req, res) {
        let { loggedInUserId } = req.body;
        if (!loggedInUserId) {
            return res
                .sendStatus(404)
                .json({ error: { loggedInUserId: "Inappropriate data to complete request" } });
        }
        try {
            let loggedInUserRole = await userModel.findById(loggedInUserId);
            res.json({ role: loggedInUserRole.userRole });
        } catch {
            res.status(404);
        }
    }

    async allUser(req, res) {        
        try {
            let allUser = await userModel.find({});
            res.json({ users: allUser });
        } catch {
            res.status(404);
        }
    }

    /* User Registration/Signup controller  */
    async postSignup(req, res) {
        let { name, email, password, cPassword } = req.body;
        let error = {};
        if (!name || !email || !password || !cPassword) {
            if (!name) error.name = "Name must not be empty";
            if (!email) error.email = "Email must not be empty";
            if (!password) error.password = "Password must not be empty";
            if (!cPassword) error.cPassword = "Confirm password must not be empty";
            return res.json({ error });
        }
        if (password !== cPassword) {
            error.cPassword = "Confirm password must be similar to password"
            return res.json({ error });
        }
        if (name.length < 3 || name.length > 25) {
            error = { ...error, name: "Name must be 3-25 charecter" };
            return res.json({ error });
        } else {
            if (validateEmail(email)) {
                name = toTitleCase(name);
                if ((password.length > 255) | (password.length < 8)) {
                    error = {
                        ...error,
                        password: "Password must be at least 8 characters",
                    };
                    return res.json({ error });
                } else {
                    // If Email & Number exists in Database then:
                    try {
                        const data = await userModel.findOne({ email: email });
                        if (data) {
                            error = {
                                ...error,
                                email: "Email already registered",
                            };
                            return res.json({ error });
                        } else {
                            password = bcrypt.hashSync(password, 10);
                            let newUser = new userModel({
                                name,
                                email,
                                password,
                                // ========= Here role 1 for admin signup role 0 for customer signup =========
                                userRole: 1, // Field Name change to userRole from role
                            });
                            newUser
                                .save()
                                .then((data) => {
                                    return res.json({
                                        success: "Account create successfully. Please login",
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                error = {
                    ...error,
                    email: "Email is not valid",
                };
                return res.json({ error });
            }
        }
    }

    /* User Login/Signin controller  */
    async postSignin(req, res) {
        let { email, password } = req.body;
        if (!email || !password) {
            let error = {};
            if (!email) error.email = "Email must not be empty";
            if (!password) error.password = "Password must not be empty";
            return res.json(error);
        }
        try {
            const data = await userModel.findOne({ email: email });
            if (!data) {
                return res.json({
                    error: "Invalid email or password",
                });
            } else {
                const login = await bcrypt.compare(password, data.password);
                if (login) {
                    const token = jwt.sign(
                        { _id: data._id, role: data.userRole, name: data.name }, JWT_SECRET,
                    );
                    const encode = jwt.verify(token, JWT_SECRET);
                    return res.json({
                        token: token,
                        user: encode,
                    });
                } else {
                    return res.json({
                        error: "Invalid email or password",
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const authController = new Auth();
export default authController;