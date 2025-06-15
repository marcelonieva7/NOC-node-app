import mongoose from "mongoose"
import { MongoDB } from "../src/infrastructure/database/mongo/init";

export const MongoDBHelper =  {
  connect: async () => {
    try {
      const { MONGO_URL, MONGO_DB_NAME } = process.env
      
      if (!MONGO_URL || !MONGO_DB_NAME) {
        throw new Error('Missing environment variables')
      }
    
      await MongoDB.connect({
        dbName: MONGO_DB_NAME,
        uri: MONGO_URL
      })
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  },
  disconnect: async () => {
    await mongoose.disconnect();
  }
}