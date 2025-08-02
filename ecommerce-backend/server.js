const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./DB/db');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
app.use(express.json());
connectDB();

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
