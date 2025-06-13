import mongoose from "mongoose";

type ConnectionOptions = {
  uri: string;
  dbName: string;
}

export class MongoDB {
  static async connect({ dbName, uri}: ConnectionOptions): Promise<void> {
    try {
      await mongoose.connect(uri, {
        dbName,
      });      
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }
}