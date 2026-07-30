import mongoose from 'mongoose';
import { seedAdminUser } from './seed-admin';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  seeded: boolean;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null, seeded: false };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    if (!cached.seeded) {
      cached.seeded = true;
      seedAdminUser().catch((err) => console.error('Background admin seed error:', err));
    }
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.seeded) {
      cached.seeded = true;
      seedAdminUser().catch((err) => console.error('Background admin seed error:', err));
    }
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
