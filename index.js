import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import authRouter from './Routers/authRouter.js';
console.log("Env Variable: ", process.env.PORT);

// Extracting variables from .env file
const port = process.env.PORT || 8000;
const mongoDbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/E-Commerce-App";

// Database connection
const connection = mongoose.connect(process.env.MONGO_URI);

const app = express();

// Routes
app.get("/", (req, res) => {
    res.send("Server running smoothly");
});
app.use("/api", authRouter);

// Running server
connection.then(() => {
    app.listen(process.env.PORT || 8000, () => console.log(`Server is running on port ${port}`));
})
    .catch((err) => console.log(err))