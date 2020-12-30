const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const logs = require('./api/logs');
const { notFound, errorHandler } = require('./middleware');

const PORT = process.env.PORT || 5000;

const app = express();
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
app.use(cors({
    origin: process.env.CORS_ORGIN
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: "Hello World!"
    });
});

app.use('/api/logs', logs);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});