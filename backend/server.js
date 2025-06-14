const app = require('./app');               // Import the configured Express app
const dotenv = require('dotenv');           // Load .env config

dotenv.config({ path: '../.env' });         // Parse environment variables
const PORT = process.env.PORT || 5000;      // Use port from .env or default to 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});