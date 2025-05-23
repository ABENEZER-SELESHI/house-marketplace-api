const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

const authRoutes = require('./routes/authRoutes.js');
const houseRoutes = require('./routes/houseRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/api/houses`));

const { notFound, errorHandler } = require('./middlewares/errorMiddleware.js');

app.use(notFound);
app.use(errorHandler);
