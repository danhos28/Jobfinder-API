const jwt = require('jsonwebtoken');
const pool = require('../../../db');
const jwtGenerator = require('../utils/jwtGenerator');

module.exports = async (req, res, next) => {
  try {
    let jwtToken = req.header('Authorization');

    if (jwtToken) {
      jwtToken = jwtToken.split(' ')[1];
    }

    jwt.verify(
      jwtToken,
      process.env.ACCESS_TOKEN_KEY,
      async (err, jobseeker) => {
        if (!err) {
          req.jobseeker = jobseeker;
          req.status = 'success';
          next();
        } else {
          const refreshToken = req.cookies.refreshToken;

          if (err instanceof jwt.TokenExpiredError) {
            console.log('JWT token expired');

            const tokenValidate = await pool.query(
              'SELECT * FROM authentications WHERE token = $1',
              [refreshToken],
            );

            if (!tokenValidate.rows[0]) {
              res
                .status(401)
                .json({ status: 'failed', message: 'Unauthorized' });
              console.log('Invalid Refresh Token');
              return null;
            }

            jwt.verify(
              refreshToken,
              process.env.REFRESH_TOKEN_KEY,
              (err, jobseeker) => {
                if (!err) {
                  req.accessToken = jwtGenerator.generateAccessToken(
                    jobseeker.user_id,
                    jobseeker.name,
                  );
                  req.jobseeker = jobseeker;
                  req.status = 'success';
                  next();
                } else {
                  res
                    .status(401)
                    .json({ status: 'failed', message: 'Unauthorized' });
                  console.log('Wrong Refresh Token');
                }
              },
            );
          } else {
            res.status(401).json({ status: 'failed', message: 'Unauthorized' });
            console.log('JWT Invalid Token');
          }
        }
      },
    );
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
