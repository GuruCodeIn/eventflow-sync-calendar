const mongoose = require('mongoose');

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    retryWrites: true,
    w: 'majority'
  };

  let retries = 5;
  
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, options);
      console.log('✅ Connected to MongoDB');
      break;
    } catch (error) {
      console.error(`❌ MongoDB connection error (${retries} retries left):`, error.message);
      retries -= 1;
      
      if (retries === 0) {
        console.error('❌ Failed to connect to MongoDB after multiple attempts');
        process.exit(1);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, (6 - retries) * 1000));
    }
  }

  // Connection event handlers
  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during MongoDB connection cleanup:', error);
      process.exit(1);
    }
  });
};

module.exports = { connectDB };