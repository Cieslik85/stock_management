const app = require('./app');                  // Import the configured Express app
const dotenv = require('dotenv');              // Load .env config
const path = require('path');                  // For resolving relative paths

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});