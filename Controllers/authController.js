import userModel from "../Models/userModel.js";

class Auth {
    async isAdmin(req, res) {
        let { loggedInUserId } = req.body;
        try {
            let loggedInUserRole = await userModel.findById(loggedInUserId);
            res.json({ role: loggedInUserRole.userRole });
        } catch {
            res.status(404);
        }
    }
}

const authController = new Auth();
export default authController;