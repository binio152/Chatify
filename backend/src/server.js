import express from "express";
import "dotenv/config";
import fs from "fs";
import path from "path";
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

// Serve frontend on product
const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

app.get("/health", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

export { app };
export default app;
