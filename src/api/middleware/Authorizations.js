const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    let jwtToken = req.header('Authorization');
    // eslint-disable-next-line prefer-destructuring
    jwtToken = jwtToken.split(' ')[1];

    jwt.verify(jwtToken, process.env.ACCESS_TOKEN_KEY, (err, jobseeker) => {
      if (!err) {
        req.jobseeker = jobseeker;
        next();
      } else {
        const error = new Error('Unauthorized user');
        error.errorStatus = 403;
        error.message = 'Not Authorize';
        throw error;
      }
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
