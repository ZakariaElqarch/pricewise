import mongoose from "mongoose";

let isConnected = false; // Var to track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI)
    return console.log("MONGODB_URI is not defined");

  if (isConnected) return console.log("=> Using existing database connection");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;

    console.log("MongoDB connected");
  } catch (error: any) {
    console.log("MongoDB connection error: ", error);
  }
};
