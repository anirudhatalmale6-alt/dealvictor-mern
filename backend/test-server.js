const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

const startTestServer = async () => {
  // Create in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  console.log('MongoDB Memory Server started at:', uri);

  // Update mongoose connection
  process.env.MONGODB_URI = uri;

  // Now require and run the main server
  require('./server');

  // Wait for connection and seed data
  mongoose.connection.once('open', async () => {
    console.log('Seeding test data...');
    try {
      const seedTestData = require('./seeders/testData');
      await seedTestData();
    } catch (err) {
      console.error('Seeding error:', err);
    }
  });
};

startTestServer().catch(console.error);
