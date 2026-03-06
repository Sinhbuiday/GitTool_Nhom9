const dotenv = require('dotenv');
dotenv.config();

/**
 * Database Configuration
 *
 * This module exports the database connection settings loaded from environment variables.
 * To use with MongoDB (mongoose), install it: npm install mongoose
 * Then uncomment the connectDB function below.
 */

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 27017,
  name: process.env.DB_NAME || 'gittool_nhom9',
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/gittool_nhom9',
};

// --- Example: Connect with Mongoose ---
// const mongoose = require('mongoose');
//
// const connectDB = async () => {
//   try {
//     await mongoose.connect(dbConfig.uri);
//     console.log(`MongoDB connected: ${dbConfig.uri}`);
//   } catch (error) {
//     console.error('Database connection failed:', error.message);
//     process.exit(1);
//   }
// };
//
// module.exports = connectDB;

module.exports = dbConfig;
