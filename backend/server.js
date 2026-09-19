require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 10000;

const start = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Eastern Newspaper API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();