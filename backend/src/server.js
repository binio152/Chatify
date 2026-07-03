import express from "express";
import "dotenv/config";
import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";

const app = express();

// Set Env
app.set("port", process.env.PORT || "3000");

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

export { app };
export default app;
