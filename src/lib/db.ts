// /lib/db.ts

import dns from 'node:dns';
import mongoose from 'mongoose';

const MONGODB_URL = process.env.DATABASE_URL;

if (!MONGODB_URL) {
  throw new Error('Please define DATABASE_URL_DIRECT or DATABASE_URL for MongoDB connection.');
}

let cachedPromise: Promise<typeof mongoose> | null = null;

// Use Cloudflare DNS to reduce SRV lookup issues when connecting to MongoDB Atlas.
dns.setServers(['1.1.1.1', '1.0.0.1']);

const DBConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected.');
    return;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(MONGODB_URL);
  }

  try {
    return await cachedPromise;
  } catch (error) {
    cachedPromise = null;
    console.error('Error connecting to MongoDB:', error);

    if (typeof MONGODB_URL === 'string' && MONGODB_URL.startsWith('mongodb+srv://')) {
      throw new Error(
        "MongoDB SRV lookup failed. Use Atlas's standard mongodb:// connection string in DATABASE_URL_DIRECT, or fix outbound DNS for SRV records.",
      );
    }

    throw error;
  }
};

export default DBConnect;
