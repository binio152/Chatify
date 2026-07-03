import express from "express";
import "dotenv/config";
import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

const app = express();

// Set Env
app.set("port", process.env.PORT || "3000");

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

export { app };
export default app;
