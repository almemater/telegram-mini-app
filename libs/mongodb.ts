import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectMongoDB(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  if (mongoose.connection.readyState) {
    connection.isConnected = mongoose.connection.readyState;
    if (connection.isConnected === 1) {
      console.log("Using existing DB connection");
      return;
    }
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to DB");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}

export default connectMongoDB;