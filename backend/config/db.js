import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('ℹ️  No MONGO_URI provided in environment. Running with local high-performance in-memory data store.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection warning: ${error.message}`);
    console.log('ℹ️  HealthCare+ is operating with resilient local in-memory persistence for demo/evaluation.');
    isConnected = false;
    return false;
  }
};

export const getIsConnected = () => isConnected;
