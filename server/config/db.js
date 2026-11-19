const mongoose = require('mongoose');

let memoryServer = null;
let usingMemoryDB = false;

/**
 * Connects to MongoDB. If no database is reachable, it transparently starts an
 * in-memory MongoDB instance and seeds demo data so the project works instantly.
 * Set USE_MEMORY_DB=false in .env to require a real MongoDB connection.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railway_reservation';

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (process.env.USE_MEMORY_DB === 'false') {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      process.exit(1);
    }
  }

  try {
    console.warn('⚠️  No MongoDB detected — starting an in-memory demo database...');
    // eslint-disable-next-line global-require
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri('railway_reservation');
    process.env.MONGO_URI = memoryUri;

    const conn = await mongoose.connect(memoryUri);
    usingMemoryDB = true;
    console.log(`✅ In-memory demo database ready: ${conn.connection.host}`);

    // eslint-disable-next-line global-require
    const runSeed = require('../seedData');
    await runSeed();
    return conn;
  } catch (fallbackError) {
    console.error(`❌ Could not start in-memory database: ${fallbackError.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  if (mongoose.connection.readyState) await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
};

module.exports = connectDB;
module.exports.closeDB = closeDB;
module.exports.isMemoryDB = () => usingMemoryDB;
