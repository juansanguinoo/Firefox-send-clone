const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to database
connectDB();

const corsOptions = {
  origin: process.env.FRONTED_URL
}
app.use( cors(corsOptions) );

const port = process.env.PORT || 4000;

// Enable express.json
app.use(express.json({ extended: true }));

// Enable public folder
app.use(express.static('uploads'));

//Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/url', require('./routes/url'));
app.use('/api/files', require('./routes/files'));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
})