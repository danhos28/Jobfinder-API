/* eslint-disable no-unused-vars */
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const auth = require('./src/api/middleware/Authorizations');
const upload = require('./src/api/middleware/upload');
const uploadPdf = require('./src/api/middleware/uploadPdf');
const app = express();
const path = require('path');

const corsConfig = {
  credentials: true,
  origin: true,
};

app.use(cookieParser());
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Static files
app.use('/images', express.static(path.join(__dirname, 'storage/images')));
// Routes
app.use('/register', require('./src/api/routes/register'));
app.use('/auth', require('./src/api/routes/login'));
app.use('/isVerify', auth, require('./src/api/routes/isVerify'));
app.use('/application', require('./src/api/routes/application'));
app.use('/savejob', require('./src/api/routes/savejobs'));
app.use(
  '/uploadCv',
  uploadPdf.single('resume'),
  require('./src/api/routes/uploadCv'),
);
app.use('/logout', require('./src/api/routes/logout'));
app.use(
  '/jobseeker',
  upload.single('image'),
  require('./src/api/routes/jobseeker'),
);
app.use(
  '/vacancy',
  upload.single('image'),

  require('./src/api/routes/vacancy'),
);

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
