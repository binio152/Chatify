import app from "./server.js";
import { connectDB } from "./utils/db.js";

connectDB().then(() => {
  app.listen(app.get("port"), () => {
    console.log(`Server is running on http://localhost:${app.get("port")}`);
  });
});
