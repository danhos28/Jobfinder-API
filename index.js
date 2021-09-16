/* eslint-disable no-unused-vars */
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const auth = require('./src/api/middleware/Authorizations');
const upload = require('./src/api/middleware/upload');
const app = express();
const path = require('path');

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Static files
app.use('/images', express.static(path.join(__dirname, 'images')));
// Routes
app.use('/register', require('./src/api/routes/register'));
app.use('/auth', require('./src/api/routes/login'));
app.use(
  '/vacancy',
  upload.single('image'),
  require('./src/api/routes/vacancy'),
);
app.use('/isVerify', auth, require('./src/api/routes/isVerify'));
app.use('/logout', require('./src/api/routes/logout'));
app.post('/upload', auth, upload.single('image'), (req, res) => {
  console.log(req.file.path);
  res.send(`image uploaded`);
});

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
