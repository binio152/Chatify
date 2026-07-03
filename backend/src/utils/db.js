import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) throw new Error("Mongo URI is required");

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("Error occurred while connecting dababase", err);
    process.exit(1);
  }
};
