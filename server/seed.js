require('dotenv').config();
const connectDB = require('./config/db');
const runSeed = require('./seedData');

const { closeDB, isMemoryDB } = connectDB;

const seed = async () => {
  try {
    await connectDB();
    // The in-memory fallback seeds itself on first connection.
    if (!isMemoryDB()) await runSeed();
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
};

seed();
