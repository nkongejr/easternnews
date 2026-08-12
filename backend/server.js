require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
    console.log(process.env.MONGO_URI);
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Eastern Newspaper API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();