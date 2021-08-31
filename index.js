/* eslint-disable no-unused-vars */
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/register', require('./src/api/routes/register'));

// error handling
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ message, data });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
