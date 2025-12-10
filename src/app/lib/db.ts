import mongoose from "mongoose";

declare global {
  // Allow global caching of mongoose connection in TypeScript
  var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// Use cached connection in development (useful for frequent reloads)
global.mongooseConn = global.mongooseConn || { conn: null, promise: null };
const cached = global.mongooseConn;

export async function connectDB() {
  if (cached.conn) {
    console.log("[MongoDB] Using existing connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false, // makes connections cleaner in Next.js
      })
      .then((mongooseInstance) => {
        console.log("[MongoDB] Connection established successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("[MongoDB] Connection error:", err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  console.log("[MongoDB] Connection ready to use");
  return cached.conn;
}
