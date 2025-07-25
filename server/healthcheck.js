const mongoose = require('mongoose');

// Health check endpoint for load balancers and monitoring
const healthCheck = async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    // Check if we can perform a simple database operation
    if (dbState === 1) {
      await mongoose.connection.db.admin().ping();
    }

    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        readyState: dbState
      },
      memory: process.memoryUsage(),
      version: process.version
    };

    res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

module.exports = { healthCheck };